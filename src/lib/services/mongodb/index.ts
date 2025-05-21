import { Service } from "@prisma/client";

import { PingResult } from "../shared/types";

import {
  pingMongoDbCore,
  pingMongoDbService,
  updateServiceStatus,
  MongoDbPingOptions,
  DEFAULT_MONGO_CONFIG
} from "./core";

import { CommonInternalResponse } from "@/types/backend";

/**
 * Main MongoDB service module that exports all MongoDB-related functionality
 */

/**
 * Pings a MongoDB service and updates its status
 *
 * @param service - The service to ping (needs at least id and connectionUrl)
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with ping result
 */
export async function pingMongoDB(
  service: Pick<Service, "id" | "connectionUrl">,
  options?: MongoDbPingOptions
): Promise<CommonInternalResponse<PingResult>> {
  return pingMongoDbService(service.id, service.connectionUrl, options);
}

/**
 * Direct ping to a MongoDB instance without storing results
 *
 * @param connectionUrl - MongoDB connection string
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with response time
 */
export async function pingMongoDirect(
  connectionUrl: string,
  options?: MongoDbPingOptions
): Promise<CommonInternalResponse<{ responseTime: number }>> {
  return pingMongoDbCore(connectionUrl, options);
}

/**
 * Process multiple MongoDB services in sequence
 *
 * @param services - Array of MongoDB services to process
 * @param options - Optional configuration for the pings
 * @returns CommonInternalResponse with results summary
 */
export async function processMongoPings(
  services: Pick<Service, "id" | "connectionUrl">[],
  options?: MongoDbPingOptions
): Promise<CommonInternalResponse<{ successful: number; failed: number; total: number }>> {
  try {
    let successful = 0;
    let failed = 0;

    for (const service of services) {
      const result = await pingMongoDB(service, options);

      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    return {
      success: true,
      type: "SUCCESS",
      title: "MongoDB ping processing complete",
      data: {
        successful,
        failed,
        total: services.length
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to process MongoDB pings",
      message: errorMessage
    };
  }
}

// Export types and constants
export type { MongoDbPingOptions };
export { DEFAULT_MONGO_CONFIG };

// Export core functions
export { pingMongoDbCore, pingMongoDbService, updateServiceStatus };
