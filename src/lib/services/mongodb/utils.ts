import { PingResult } from "../shared/types";

import { pingMongoDB, processMongoPings } from "./index";

import { CommonInternalResponse } from "@/types/backend";
import { db } from "@/lib/db";

/**
 * Utility function to ping all MongoDB services for a specific user
 *
 * @param userId - ID of the user whose services should be pinged
 * @returns CommonInternalResponse with results summary
 */
export async function pingUserMongoServices(
  userId: string
): Promise<CommonInternalResponse<{ successful: number; failed: number; total: number }>> {
  try {
    // Find all MongoDB services for the user
    const services = await db.service.findMany({
      where: {
        userId,
        // Find services with MongoDB in the serviceType
        serviceType: {
          type: {
            contains: "MongoDB",
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
        title: "No MongoDB services found",
        data: {
          successful: 0,
          failed: 0,
          total: 0
        }
      };
    }

    // Process all found services
    return await processMongoPings(services);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping MongoDB services",
      message: errorMessage
    };
  }
}

/**
 * Utility function to ping a specific MongoDB service by ID
 *
 * @param serviceId - ID of the service to ping
 * @param userId - ID of the user (for authorization)
 * @returns CommonInternalResponse with ping result
 */
export async function pingMongoServiceById(
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
        message: "The specified MongoDB service was not found or does not belong to you"
      };
    }

    // Check if it's a MongoDB service
    const isMongoDB = service.serviceType.type.toLowerCase().includes("mongo");

    if (!isMongoDB) {
      return {
        success: false,
        type: "ERROR",
        title: "Invalid service type",
        message: "The specified service is not a MongoDB service"
      };
    }

    // Ping the MongoDB service
    return await pingMongoDB(service);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping MongoDB service",
      message: errorMessage
    };
  }
}
