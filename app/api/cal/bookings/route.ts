import type { CalBookingsQuery } from "@/lib/schemas/calBookings";
import type { Meeting } from "@/lib/types/meeting";
import { NextRequest, NextResponse } from "next/server";
import { CalBookingsApiError } from "@/lib/dal/calBookings";
import {
  fetchNormalizedCalBookings,
  mapNormalizedCalBookingsToMeeting,
} from "@/lib/dto/calBookings";
import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import { ZodError } from "zod";
import {
  logApiRequest,
  logApiResponse,
  logApiError,
} from "@/lib/utils/api-logger";

export const dynamic = "force-dynamic";

function parseAuthorizationHeader(request: NextRequest) {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) {
    return null;
  }

  const trimmed = header.trim();
  if (!trimmed.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = trimmed.slice(7).trim();
  return token.length ? token : null;
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
  statusCode?: number,
): Meeting => {
  const errorPayload: Record<string, unknown> = { message };
  if (typeof details !== "undefined") {
    errorPayload.details = details;
  }
  if (typeof statusCode === "number") {
    errorPayload.statusCode = statusCode;
  }

  return {
    status: "error",
    data: [],
    pagination: createEmptyPagination(query),
    error: errorPayload,
  };
};

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const url = request.nextUrl.toString();
  const method = "GET";

  logApiRequest("GET /api/cal/bookings", {
    method,
    url,
  });

  const accessToken = parseAuthorizationHeader(request);
  if (!accessToken) {
    const duration = Date.now() - startTime;
    logApiError("Missing authorization header", {
      method,
      url,
      statusCode: 401,
      duration,
    });

    return NextResponse.json(
      createMeetingErrorResponse(
        "Missing or invalid Authorization header. Expected `Bearer <token>`.",
        undefined,
        undefined,
        401,
      ),
      { status: 401 },
    );
  }

  let query: CalBookingsQuery | undefined;
  try {
    query = mapSearchParamsToQuery(request.nextUrl.searchParams);
  } catch (error) {
    const duration = Date.now() - startTime;
    const statusCode = 400;

    logApiError("Invalid query parameters", {
      method,
      url,
      statusCode,
      duration,
      error:
        error instanceof ZodError
          ? JSON.stringify(error.flatten())
          : error instanceof Error
            ? error.message
            : String(error),
    });

    if (error instanceof ZodError) {
      return NextResponse.json(
        createMeetingErrorResponse("Invalid query parameters.", error.flatten(), undefined, statusCode),
        { status: statusCode },
      );
    }

    return NextResponse.json(
      createMeetingErrorResponse("Failed to parse query parameters.", error, undefined, statusCode),
      { status: statusCode },
    );
  }

  try {
    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
    });

    const duration = Date.now() - startTime;
    logApiResponse("GET /api/cal/bookings - success", {
      method,
      url,
      statusCode: 200,
      duration,
    });

    return NextResponse.json(mapNormalizedCalBookingsToMeeting(result, query));
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof CalBookingsApiError) {
      const statusCode = error.status || 500;

      logApiError("Cal.com bookings API error", {
        method,
        url,
        statusCode,
        duration,
        error: error.message,
        details: error.details,
      });

      return NextResponse.json(
        createMeetingErrorResponse(error.message, error.details, query, statusCode),
        { status: statusCode },
      );
    }

    logApiError("Unexpected error in bookings API route", {
      method,
      url,
      statusCode: 500,
      duration,
      error:
        error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      createMeetingErrorResponse("Unexpected error while fetching Cal.com bookings.", error, query, 500),
      { status: 500 },
    );
  }
}
