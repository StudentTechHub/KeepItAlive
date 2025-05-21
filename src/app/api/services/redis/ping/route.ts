import { NextRequest } from "next/server";

import { processRedisPings } from "@/lib/services/redis";
import { db } from "@/lib/db";

/**
 * API route to ping Redis services
 * This can be called by a Vercel Cron job or other scheduling mechanism
 *
 * @param request - The incoming request
 * @returns Response with results
 */
export async function POST(request: NextRequest) {
  try {
    // Get batch size from query parameters (default to 50)
    const { searchParams } = new URL(request.url);
    const batchSize = parseInt(searchParams.get("batchSize") || "50", 10);

    // Get API key for authorization (in a real app, you'd validate this)
    const apiKey = request.headers.get("x-api-key");

    // In production, validate API key here
    if (!process.env.PING_API_KEY || apiKey !== process.env.PING_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          type: "ERROR",
          title: "Unauthorized",
          message: "Invalid API key"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Find all Redis services that are due for a ping
    const currentTime = new Date();
    const services = await db.service.findMany({
      where: {
        serviceType: {
          type: {
            contains: "Redis",
            mode: "insensitive"
          }
        },
        // Only select services that are due for a ping
        OR: [{ nextScheduledCheck: { lte: currentTime } }, { nextScheduledCheck: null }]
      },
      // Limit the number of services to process in one batch
      take: batchSize,
      // Only select the fields we need
      select: {
        id: true,
        connectionUrl: true
      }
    });

    if (!services || services.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          type: "INFO",
          title: "No services to ping",
          data: { servicesCount: 0 }
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Process all services in sequence
    const result = await processRedisPings(services);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        type: "ERROR",
        title: "Failed to ping Redis services",
        message: errorMessage
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
