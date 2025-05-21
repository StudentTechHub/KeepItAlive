import { PingResult } from "../shared/types";

import { pingRedis, processRedisPings } from "./index";

import { CommonInternalResponse } from "@/types/backend";
import { db } from "@/lib/db";

/**
 * Utility function to ping all Redis services for a specific user
 *
 * @param userId - ID of the user whose services should be pinged
 * @returns CommonInternalResponse with results summary
 */
export async function pingUserRedisServices(
  userId: string
): Promise<CommonInternalResponse<{ successful: number; failed: number; total: number }>> {
  try {
    // Find all Redis services for the user
    const services = await db.service.findMany({
      where: {
        userId,
        // Find services with Redis in the serviceType
        serviceType: {
          type: {
            contains: "Redis",
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
        title: "No Redis services found",
        data: {
          successful: 0,
          failed: 0,
          total: 0
        }
      };
    }

    // Process all found services
    return await processRedisPings(services);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping Redis services",
      message: errorMessage
    };
  }
}

/**
 * Utility function to ping a specific Redis service by ID
 *
 * @param serviceId - ID of the service to ping
 * @param userId - ID of the user (for authorization)
 * @returns CommonInternalResponse with ping result
 */
export async function pingRedisServiceById(
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
        message: "The specified Redis service was not found or does not belong to you"
      };
    }

    // Check if it's a Redis service
    const isRedis = service.serviceType.type.toLowerCase().includes("redis");

    if (!isRedis) {
      return {
        success: false,
        type: "ERROR",
        title: "Invalid service type",
        message: "The specified service is not a Redis service"
      };
    }

    // Ping the Redis service
    return await pingRedis(service);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping Redis service",
      message: errorMessage
    };
  }
}
