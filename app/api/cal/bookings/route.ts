import type { CalBookingsQuery } from "@/lib/schemas/calBookings";
import type { Meeting } from "@/lib/types/meeting";
import { NextRequest, NextResponse } from "next/server";
import { normalizeError, getUserFriendlyMessage } from "@/lib/errors";
import {
  fetchNormalizedCalBookings,
  mapNormalizedCalBookingsToMeeting,
} from "@/lib/dto/calBookings";
import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import { logger } from "@/lib/logger";
import { HTTP_STATUS, HTTP_HEADERS, CONTENT_TYPES } from "@/lib/constants/http";
import { envConfig } from "@/lib/env";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

function parseAuthorizationHeader(request: NextRequest): string | null {
  const header = request.headers.get(HTTP_HEADERS.AUTHORIZATION);
  if (!header) {
    return null;
  }

  const trimmed = header.trim();
  const bearerPrefix = "bearer ";
  if (!trimmed.toLowerCase().startsWith(bearerPrefix)) {
    return null;
  }

  const token = trimmed.slice(bearerPrefix.length).trim();
  return token.length > 0 ? token : null;
}

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

const createEmptyPagination = (query?: CalBookingsQuery) => {
  const take = typeof query?.take === "number" && query.take > 0 ? query.take : 0;
  const skip = typeof query?.skip === "number" && query.skip >= 0 ? query.skip : 0;
  const currentPage = take > 0 ? Math.floor(skip / take) : 0;

  return {
    totalItems: 0,
    remainingItems: 0,
    returnedItems: 0,
    itemsPerPage: take,
    currentPage,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: skip > 0,
  };
};

const createMeetingErrorResponse = (
  message: string,
  details?: unknown,
  query?: CalBookingsQuery,
): Meeting => {
  const errorPayload: Record<string, unknown> = { message };
  if (typeof details !== "undefined") {
    errorPayload.details = details;
  }

  return {
    status: "error",
    data: [],
    pagination: createEmptyPagination(query),
    error: errorPayload,
  };
};

export async function GET(request: NextRequest) {
  const accessToken = parseAuthorizationHeader(request);
  if (!accessToken) {
    logger.warn("Missing or invalid Authorization header in bookings request");
    return NextResponse.json(
      createMeetingErrorResponse(
        "Missing or invalid Authorization header. Expected `Bearer <token>`.",
      ),
      {
        status: HTTP_STATUS.UNAUTHORIZED,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        },
      },
    );
  }

  let query: CalBookingsQuery | undefined;
  try {
    query = mapSearchParamsToQuery(request.nextUrl.searchParams);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Invalid query parameters in bookings request", undefined, {
        errors: error.flatten(),
      });
      return NextResponse.json(
        createMeetingErrorResponse("Invalid query parameters.", error.flatten()),
        {
          status: HTTP_STATUS.BAD_REQUEST,
          headers: {
            [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
          },
        },
      );
    }

    logger.error("Failed to parse query parameters", error);
    return NextResponse.json(
      createMeetingErrorResponse("Failed to parse query parameters.", error),
      {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        },
      },
    );
  }

  try {
    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
    });

    return NextResponse.json(mapNormalizedCalBookingsToMeeting(result, query), {
      status: HTTP_STATUS.OK,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
      },
    });
  } catch (error) {
    const normalizedError = normalizeError(error);
    const userMessage = getUserFriendlyMessage(normalizedError, envConfig.isDevelopment);

    logger.error("Error fetching Cal.com bookings", normalizedError, {
      statusCode: normalizedError.statusCode,
      code: normalizedError.code,
    });

    return NextResponse.json(
      createMeetingErrorResponse(userMessage, normalizedError.details, query),
      {
        status: normalizedError.statusCode,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        },
      },
    );
  }
}
