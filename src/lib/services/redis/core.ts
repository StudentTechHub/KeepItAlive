import { ServiceStatus } from "@prisma/client";
import { createClient, RedisClientOptions, RedisClientType } from "redis";

import { PingResult, BasePingOptions } from "../shared/types";

import { CommonInternalResponse } from "@/types/backend";
import { db } from "@/lib/db";

// Default configuration for Redis pings
export const DEFAULT_REDIS_CONFIG = {
  timeout: 10000, // 10 seconds default timeout
  retryCount: 2,
  retryDelay: 1000, // 1 second between retries
  pingInterval: 300, // 5 minutes default ping interval (in seconds)
  commandTimeoutMS: 5000 // 5 seconds command timeout
};

// Redis-specific ping options
export interface RedisPingOptions extends BasePingOptions {
  commandTimeoutMS?: number;
}

/**
 * Core function to ping a Redis instance by connection URL
 *
 * @param connectionUrl - The Redis connection string
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with success/failure and response time
 */
export async function pingRedisCore(
  connectionUrl: string,
  options: RedisPingOptions = {}
): Promise<CommonInternalResponse<{ responseTime: number }>> {
  const startTime = Date.now();
  let client: RedisClientType | null = null;

  // Merge default options with provided options
  const pingOptions = {
    ...DEFAULT_REDIS_CONFIG,
    ...options
  };

  try {
    if (!connectionUrl) {
      return {
        success: false,
        type: "ERROR",
        title: "Invalid connection URL",
        message: "Redis connection URL is empty or invalid"
      };
    }

    // Set up Redis client options
    const clientOptions: RedisClientOptions = {
      url: connectionUrl,
      socket: {
        connectTimeout: pingOptions.timeout,
        reconnectStrategy: false
      },
      commandsQueueMaxLength: 1
    }; // Create Redis client with proper type casting

    client = createClient(clientOptions) as RedisClientType;

    // Set up error handling before connecting
    client.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    // Connect to Redis with timeout to prevent hanging
    const connectPromise = client.connect();
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Connection timeout")), pingOptions.timeout);
    });

    await Promise.race([connectPromise, timeoutPromise]);

    // Ping the Redis server
    const pong = await Promise.race([
      client.ping(),
      new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error("Ping timeout")), pingOptions.commandTimeoutMS);
      })
    ]);

    if (pong !== "PONG") {
      throw new Error("Invalid response from Redis server");
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      success: true,
      type: "SUCCESS",
      title: "Redis ping successful",
      data: { responseTime }
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Redis ping failed",
      message: errorMessage,
      errorData: { responseTime }
    };
  } finally {
    // Ensure client is disconnected to prevent resource leaks
    if (client) {
      try {
        // Check connection status before disconnecting
        if (client.isOpen || client.isReady) {
          client.destroy();
        }
      } catch (error) {
        console.error("Error disconnecting Redis client:", error);
      }
    }
  }
}

/**
 * Ping a Redis service and update its status
 *
 * @param serviceId - ID of the service to ping
 * @param connectionUrl - Redis connection string
 * @param options - Optional ping configuration
 * @returns CommonInternalResponse with ping result
 */
export async function pingRedisService(
  serviceId: string,
  connectionUrl: string,
  options: RedisPingOptions = {}
): Promise<CommonInternalResponse<PingResult>> {
  // Ping the Redis server
  const pingResult = await pingRedisCore(connectionUrl, options);

  // Prepare the result
  const result: PingResult = {
    serviceId,
    successful: pingResult.success,
    responseTime: pingResult.success
      ? pingResult.data.responseTime
      : pingResult.errorData &&
          typeof pingResult.errorData === "object" &&
          pingResult.errorData !== null
        ? (pingResult.errorData as { responseTime?: number })?.responseTime
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
      title: "Redis ping successful",
      data: result
    };
  } else {
    return {
      success: false,
      type: "ERROR",
      title: "Redis ping failed",
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
