import { PingResult } from "../shared/types";

import { pingPostgreSQL, processPostgresPings } from "./index";

import { CommonInternalResponse } from "@/types/backend";
import { db } from "@/lib/db";

/**
 * Utility function to ping all PostgreSQL services for a specific user
 *
 * @param userId - ID of the user whose services should be pinged
 * @returns CommonInternalResponse with results summary
 */
export async function pingUserPostgresServices(
  userId: string
): Promise<CommonInternalResponse<{ successful: number; failed: number; total: number }>> {
  try {
    // Find all PostgreSQL services for the user
    const services = await db.service.findMany({
      where: {
        userId,
        // Find services with PostgreSQL in the serviceType
        serviceType: {
          type: {
            contains: "PostgreSQL",
            mode: "insensitive"
          }
        }
      },
      select: {
        id: true,
        connectionUrl: true
      }
    });

    if (!services || services.length === 0) {
      return {
        success: true,
        type: "INFO",
        title: "No PostgreSQL services found",
        data: {
          successful: 0,
          failed: 0,
          total: 0
        }
      };
    }

    // Process all found services
    return await processPostgresPings(services);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping PostgreSQL services",
      message: errorMessage
    };
  }
}

/**
 * Utility function to ping a specific PostgreSQL service by ID
 *
 * @param serviceId - ID of the service to ping
 * @param userId - ID of the user (for authorization)
 * @returns CommonInternalResponse with ping result
 */
export async function pingPostgresServiceById(
  serviceId: string,
  userId: string
): Promise<CommonInternalResponse<PingResult>> {
  try {
    // Find the specific service
    const service = await db.service.findUnique({
      where: {
        id: serviceId,
        userId // Ensure the service belongs to the user
      },
      include: {
        serviceType: true
      }
    });

    if (!service) {
      return {
        success: false,
        type: "ERROR",
        title: "Service not found",
        message: "The specified PostgreSQL service was not found or does not belong to you"
      };
    }

    // Check if it's a PostgreSQL service
    const isPostgreSQL = service.serviceType.type.toLowerCase().includes("postgres");

    if (!isPostgreSQL) {
      return {
        success: false,
        type: "ERROR",
        title: "Invalid service type",
        message: "The specified service is not a PostgreSQL service"
      };
    }

    // Ping the PostgreSQL service
    return await pingPostgreSQL(service);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping PostgreSQL service",
      message: errorMessage
    };
  }
}
