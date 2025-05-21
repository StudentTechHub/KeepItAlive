import { ServiceStatus } from "@prisma/client";
import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

import { PingResult, BasePingOptions } from "../shared/types";

import { CommonInternalResponse } from "@/types/backend";
import { db } from "@/lib/db";

// Default configuration for MongoDB pings
export const DEFAULT_MONGO_CONFIG = {
  timeout: 30000, // 30 seconds default timeout
  retryCount: 2,
  retryDelay: 1000, // 1 second between retries
  pingInterval: 300, // 5 minutes default ping interval (in seconds)
  commandTimeoutMS: 10000 // 10 seconds command timeout
};

// MongoDB-specific ping options
export interface MongoDbPingOptions extends BasePingOptions {
  commandTimeoutMS?: number;
}

/**
 * Core function to ping a MongoDB instance by connection URL
 *
 * @param connectionUrl - The MongoDB connection string
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with success/failure and response time
 */
export async function pingMongoDbCore(
  connectionUrl: string,
  options: MongoDbPingOptions = {}
): Promise<CommonInternalResponse<{ responseTime: number }>> {
  const startTime = Date.now();
  let client: MongoClient | null = null;

  // Merge default options with provided options
  const pingOptions = {
    ...DEFAULT_MONGO_CONFIG,
    ...options
  };

  try {
    if (!connectionUrl) {
      return {
        success: false,
        type: "ERROR",
        title: "Invalid connection URL",
        message: "MongoDB connection URL is empty or invalid"
      };
    }

    // Set up MongoDB client options
    const clientOptions: MongoClientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      },
      connectTimeoutMS: pingOptions.timeout
    };

    // Connect to MongoDB
    client = new MongoClient(connectionUrl, clientOptions);
    await client.connect();

    // Ping the MongoDB server
    const adminDb = client.db("admin");
    const pingCommand = { ping: 1 };

    await adminDb.command(pingCommand, { timeoutMS: pingOptions.commandTimeoutMS });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      success: true,
      type: "SUCCESS",
      title: "MongoDB ping successful",
      data: { responseTime }
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "MongoDB ping failed",
      message: errorMessage,
      errorData: { responseTime }
    };
  } finally {
    // Ensure client is closed to prevent resource leaks
    if (client) {
      await client.close();
    }
  }
}

/**
 * Ping a MongoDB service and update its status
 *
 * @param serviceId - ID of the service to ping
 * @param connectionUrl - MongoDB connection string
 * @param options - Optional ping configuration
 * @returns CommonInternalResponse with ping result
 */
export async function pingMongoDbService(
  serviceId: string,
  connectionUrl: string,
  options: MongoDbPingOptions = {}
): Promise<CommonInternalResponse<PingResult>> {
  // Ping the MongoDB server
  const pingResult = await pingMongoDbCore(connectionUrl, options);

  // Prepare the result
  const result: PingResult = {
    serviceId,
    successful: pingResult.success,
    responseTime: pingResult.success
      ? pingResult.data.responseTime
      : pingResult.errorData &&
          typeof pingResult.errorData == "object" &&
          "responseTime" in pingResult.errorData
        ? (pingResult.errorData?.responseTime as number)
        : undefined,
    errorMessage: !pingResult.success ? pingResult.message : undefined,
    timestamp: new Date()
  };

  // Update service status
  await updateServiceStatus(
    serviceId,
    pingResult.success ? ServiceStatus.ONLINE : ServiceStatus.OFFLINE,
    result
  );

  // Return formatted result
  if (pingResult.success) {
    return {
      success: true,
      type: "SUCCESS",
      title: "MongoDB ping successful",
      data: result
    };
  } else {
    return {
      success: false,
      type: "ERROR",
      title: "MongoDB ping failed",
      message: pingResult.message,
      errorData: result
    };
  }
}

/**
 * Updates the status of a service based on ping results
 *
 * @param serviceId - ID of the service to update
 * @param status - New status to set
 * @param pingResult - Result of the ping operation
 */
export async function updateServiceStatus(
  serviceId: string,
  status: ServiceStatus,
  pingResult: PingResult
): Promise<void> {
  try {
    const service = await db.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      console.error(`Service not found: ${serviceId}`);

      return;
    }

    // Update consecutive failures count
    let consecutiveFailures = service.consecutiveFailures;
    let shouldDisable = false;

    if (pingResult.successful) {
      // Reset consecutive failures on success
      consecutiveFailures = 0;
    } else {
      // Increment consecutive failures on failure
      consecutiveFailures += 1;

      // Check if service should be disabled based on failure threshold
      if (
        service.disabledOnConsecutiveFailure &&
        consecutiveFailures >= service.failuresThreshold
      ) {
        status = ServiceStatus.DISABLED;
        shouldDisable = true;
      }
    }

    // Calculate uptime percentage
    const totalPings = await db.servicePing.count({
      where: { serviceId }
    });

    const successfulPings = await db.servicePing.count({
      where: {
        serviceId,
        successful: true
      }
    });

    const uptimePercentage =
      totalPings > 0 ? (successfulPings / totalPings) * 100 : service.uptimePercentage;

    // Update service record
    await db.service.update({
      where: { id: serviceId },
      data: {
        status,
        consecutiveFailures,
        uptimePercentage,
        ...(pingResult.successful
          ? { lastSuccessfulCheck: pingResult.timestamp }
          : { lastFailedCheck: pingResult.timestamp }),
        nextScheduledCheck: new Date(Date.now() + service.pingInterval * 1000)
      }
    });

    // Create ping record
    await db.servicePing.create({
      data: {
        serviceId,
        timestamp: pingResult.timestamp,
        successful: pingResult.successful,
        responseTime: pingResult.responseTime,
        statusCode: pingResult.statusCode,
        errorMessage: pingResult.errorMessage
      }
    });

    // If service was disabled due to consecutive failures, create a log entry
    if (shouldDisable) {
      await db.log.create({
        data: {
          severity: "WARNING",
          category: "SERVICE",
          serviceId,
          serviceName: service.name,
          actionType: "AUTO_DISABLE",
          status: "FAILURE",
          errorMessage: `Service automatically disabled after ${consecutiveFailures} consecutive failures`
        }
      });
    }
  } catch (error) {
    console.error("Error updating service status:", error);
  }
}
