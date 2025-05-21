"use server";

import { revalidatePath } from "next/cache";

import { pingMongoServiceById, pingUserMongoServices } from "@/lib/services/mongodb/utils";
import { createClient } from "@/utils/supabase/server";
import { CommonInternalResponse } from "@/types/backend";
import { PingResult } from "@/lib/services/shared/types";

/**
 * Server action to ping a specific MongoDB service
 *
 * @param serviceId - ID of the service to ping
 * @returns CommonInternalResponse with ping result
 */
export async function pingService(serviceId: string): Promise<CommonInternalResponse<PingResult>> {
  try {
    // Get the current user from Supabase
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        type: "ERROR",
        title: "Unauthorized",
        message: "You need to be logged in to ping services"
      };
    }

    // Ping the specific service
    const result = await pingMongoServiceById(serviceId, user.id);

    // Revalidate the service page to show updated data
    revalidatePath(`/dashboard/services/${serviceId}`);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping service",
      message: errorMessage
    };
  }
}

/**
 * Server action to ping all MongoDB services for the current user
 *
 * @returns CommonInternalResponse with results summary
 */
export async function pingAllMongoServices(): Promise<
  CommonInternalResponse<{ successful: number; failed: number; total: number }>
> {
  try {
    // Get the current user from Supabase
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        type: "ERROR",
        title: "Unauthorized",
        message: "You need to be logged in to ping services"
      };
    }

    // Ping all MongoDB services for the user
    const result = await pingUserMongoServices(user.id);

    // Revalidate the dashboard to show updated data
    revalidatePath("/dashboard");

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      type: "ERROR",
      title: "Failed to ping services",
      message: errorMessage
    };
  }
}
