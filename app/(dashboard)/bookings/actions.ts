'use server';

import {
  fetchCalBookingsActionSchema,
  type FetchCalBookingsActionInput,
  type CalBookingsQuery,
} from "@/lib/schemas/calBookings";
import {
  fetchNormalizedCalBookings,
  fetchTopUpdatedBookings,
  mapNormalizedCalBookingsToMeeting,
} from "@/lib/dto/calBookings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PROVIDER_ID } from "@/constants/oauth";
import { requireAuth } from "@/lib/middleware/auth";
import { validateOrThrow } from "@/lib/middleware/validation";
import { createLogger } from "@/lib/logging/logger";
import { ErrorFactory } from "@/lib/errors";

const logger = createLogger("actions:bookings");

type InputParams = FetchCalBookingsActionInput;

type ActionContext = {
  accessToken: string;
  query: CalBookingsQuery | undefined;
  baseUrl?: string;
  apiVersion?: string;
};

/**
 * Resolves and validates action context with authentication
 */
const resolveActionContext = async (input: InputParams): Promise<ActionContext> => {
  // Validate input
  const { query, baseUrl, apiVersion, userId } = validateOrThrow(
    fetchCalBookingsActionSchema,
    input,
    "fetchCalBookingsAction input",
  );

  logger.debug("Resolving action context", { userId, hasQuery: !!query });

  // Authenticate user
  const authResult = await requireAuth(userId);
  
  if (!authResult.success) {
    throw authResult.error;
  }

  const { accessToken } = authResult.data;

  logger.debug("Successfully resolved action context", { userId });

  return {
    accessToken,
    query,
    baseUrl,
    apiVersion,
  };
};

/**
 * Server action to fetch Cal.com bookings
 */
export const fetchCalBookingsAction = async (input: InputParams) => {
  try {
    logger.info("Executing fetchCalBookingsAction");
    
    const { accessToken, query, baseUrl, apiVersion } = await resolveActionContext(input);

    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
      baseUrl,
      apiVersion,
    });

    const meeting = mapNormalizedCalBookingsToMeeting(result, query);
    
    logger.info("Successfully fetched bookings", {
      count: meeting.data.length,
      totalItems: meeting.pagination.totalItems,
    });

    return meeting;
  } catch (error) {
    logger.error("Failed to execute fetchCalBookingsAction", error);
    throw error;
  }
};

/**
 * Server action to fetch top updated bookings
 */
export const fetchTopUpdatedBookingsAction = async (input: InputParams) => {
  try {
    logger.info("Executing fetchTopUpdatedBookingsAction");
    
    const { accessToken, query, baseUrl, apiVersion } = await resolveActionContext(input);

    const result = await fetchTopUpdatedBookings({
      accessToken,
      query,
      baseUrl,
      apiVersion,
    });
    
    logger.info("Successfully fetched top updated bookings", {
      count: result.data?.length ?? 0,
      hasError: !!result.error,
    });

    return result;
  } catch (error) {
    logger.error("Failed to execute fetchTopUpdatedBookingsAction", error);
    throw error;
  }
};
