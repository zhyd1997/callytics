import type { CalBookingsQuery } from "@/lib/schemas/calBookings";
import { NextRequest } from "next/server";
import { CalBookingsApiError } from "@/lib/dal/calBookings";
import {
  fetchNormalizedCalBookings,
  mapNormalizedCalBookingsToMeeting,
} from "@/lib/dto/calBookings";
import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import { ZodError } from "zod";
import { requireAuthWithToken } from "@/lib/middleware/auth";
import { validate } from "@/lib/middleware/validation";
import { successResponse, errorResponse } from "@/lib/api/response";
import { createLogger } from "@/lib/logging/logger";
import { ErrorFactory } from "@/lib/errors";

const logger = createLogger("api:bookings");

export const dynamic = "force-dynamic";

/**
 * Maps URL search params to CalBookingsQuery
 */
function mapSearchParamsToQuery(searchParams: URLSearchParams): CalBookingsQuery | undefined {
  if ([...searchParams.keys()].length === 0) {
    return undefined;
  }

  const accumulator = new Map<string, string[]>();
  for (const [key, value] of searchParams.entries()) {
    const trimmed = value.trim();
    if (!trimmed.length) {
      continue;
    }

    const existing = accumulator.get(key);
    if (existing) {
      existing.push(trimmed);
    } else {
      accumulator.set(key, [trimmed]);
    }
  }

  const raw: Record<string, unknown> = {};
  for (const [key, values] of accumulator.entries()) {
    raw[key] = values.length === 1 ? values[0] : values;
  }

  if (!Object.keys(raw).length) {
    return undefined;
  }

  return calBookingsQuerySchema.parse(raw);
}


/**
 * GET /api/cal/bookings
 * Fetches Cal.com bookings with authentication and validation
 */
export async function GET(request: NextRequest) {
  try {
    logger.info("Received bookings request");

    // Authenticate request
    const authResult = await requireAuthWithToken(request);
    if (!authResult.success) {
      return errorResponse(authResult.error);
    }

    const { accessToken } = authResult.data;

    // Parse and validate query parameters
    let query: CalBookingsQuery | undefined;
    try {
      query = mapSearchParamsToQuery(request.nextUrl.searchParams);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Invalid query parameters", undefined, error);
        return errorResponse(
          ErrorFactory.validation("Invalid query parameters", error.flatten()),
        );
      }

      logger.error("Failed to parse query parameters", error);
      return errorResponse(
        ErrorFactory.validation("Failed to parse query parameters", error),
      );
    }

    // Fetch bookings
    logger.debug("Fetching bookings", { hasQuery: !!query });
    
    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
    });

    const meeting = mapNormalizedCalBookingsToMeeting(result, query);
    
    logger.info("Successfully fetched bookings", {
      count: meeting.data.length,
      totalItems: meeting.pagination.totalItems,
    });

    return successResponse(meeting);
  } catch (error) {
    logger.error("Unexpected error in bookings endpoint", error);
    
    if (error instanceof CalBookingsApiError) {
      return errorResponse(
        ErrorFactory.externalAPI(error.message, error.status, error.details),
      );
    }

    return errorResponse(error);
  }
}
