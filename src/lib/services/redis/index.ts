import { Service } from "@prisma/client";

import { PingResult } from "../shared/types";

import {
  pingRedisCore,
  pingRedisService,
  updateServiceStatus,
  RedisPingOptions,
  DEFAULT_REDIS_CONFIG
} from "./core";

import { CommonInternalResponse } from "@/types/backend";

/**
 * Main Redis service module that exports all Redis-related functionality
 */

/**
 * Pings a Redis service and updates its status
 *
 * @param service - The service to ping (needs at least id and connectionUrl)
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with ping result
 */
export async function pingRedis(
  service: Pick<Service, "id" | "connectionUrl">,
  options?: RedisPingOptions
): Promise<CommonInternalResponse<PingResult>> {
  return pingRedisService(service.id, service.connectionUrl, options);
}

/**
 * Direct ping to a Redis instance without storing results
 *
 * @param connectionUrl - Redis connection string
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with response time
 */
export async function pingRedisDirect(
  connectionUrl: string,
  options?: RedisPingOptions
): Promise<CommonInternalResponse<{ responseTime: number }>> {
  return pingRedisCore(connectionUrl, options);
}

/**
 * Process multiple Redis services in sequence
 *
 * @param services - Array of Redis services to process
 * @param options - Optional configuration for the pings
 * @returns CommonInternalResponse with results summary
 */
export async function processRedisPings(
  services: Pick<Service, "id" | "connectionUrl">[],
  options?: RedisPingOptions
): Promise<CommonInternalResponse<{ successful: number; failed: number; total: number }>> {
  try {
    let successful = 0;
    let failed = 0;

    for (const service of services) {
      const result = await pingRedis(service, options);

      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    return {
      success: true,
      type: "SUCCESS",
      title: "Redis ping processing complete",
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
      title: "Failed to process Redis pings",
      message: errorMessage
    };
  }
}

// Export types and constants
export type { RedisPingOptions };
export { DEFAULT_REDIS_CONFIG };

// Export core functions
export { pingRedisCore, pingRedisService, updateServiceStatus };
