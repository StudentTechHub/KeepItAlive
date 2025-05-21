import { Service } from "@prisma/client";

import { PingResult } from "../shared/types";

import {
  pingPostgresqlCore,
  pingPostgresqlService,
  updateServiceStatus,
  PostgresqlPingOptions,
  DEFAULT_PG_CONFIG
} from "./core";

import { CommonInternalResponse } from "@/types/backend";

/**
 * Main PostgreSQL service module that exports all PostgreSQL-related functionality
 */

/**
 * Pings a PostgreSQL service and updates its status
 *
 * @param service - The service to ping (needs at least id and connectionUrl)
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with ping result
 */
export async function pingPostgreSQL(
  service: Pick<Service, "id" | "connectionUrl">,
  options?: PostgresqlPingOptions
): Promise<CommonInternalResponse<PingResult>> {
  return pingPostgresqlService(service.id, service.connectionUrl, options);
}

/**
 * Direct ping to a PostgreSQL instance without storing results
 *
 * @param connectionUrl - PostgreSQL connection string
 * @param options - Optional configuration for the ping
 * @returns CommonInternalResponse with response time
 */
export async function pingPostgresDirect(
  connectionUrl: string,
  options?: PostgresqlPingOptions
): Promise<CommonInternalResponse<{ responseTime: number }>> {
  return pingPostgresqlCore(connectionUrl, options);
}

/**
 * Process multiple PostgreSQL services in sequence
 *
 * @param services - Array of PostgreSQL services to process
 * @param options - Optional configuration for the pings
 * @returns CommonInternalResponse with results summary
 */
export async function processPostgresPings(
  services: Pick<Service, "id" | "connectionUrl">[],
  options?: PostgresqlPingOptions
): Promise<CommonInternalResponse<{ successful: number; failed: number; total: number }>> {
  try {
    let successful = 0;
    let failed = 0;

    for (const service of services) {
      const result = await pingPostgreSQL(service, options);

      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    return {
      success: true,
      type: "SUCCESS",
      title: "PostgreSQL ping processing complete",
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
      title: "Failed to process PostgreSQL pings",
      message: errorMessage
    };
  }
}

// Export types and constants
export type { PostgresqlPingOptions };
export { DEFAULT_PG_CONFIG };

// Export core functions
export { pingPostgresqlCore, pingPostgresqlService, updateServiceStatus };
