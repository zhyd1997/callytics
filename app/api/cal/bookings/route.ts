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
import { logApiResponse } from "@/lib/utils/api-response";

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
    statusCode,
  };
};

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = parseAuthorizationHeader(request);
  
  if (!accessToken) {
    const statusCode = 401;
    logApiResponse(path, statusCode);
    return NextResponse.json(
      createMeetingErrorResponse(
        "Missing or invalid Authorization header. Expected `Bearer <token>`.",
        undefined,
        undefined,
        statusCode,
      ),
      { status: statusCode },
    );
  }

  let query: CalBookingsQuery | undefined;
  try {
    query = mapSearchParamsToQuery(request.nextUrl.searchParams);
  } catch (error) {
    const statusCode = 400;
    logApiResponse(path, statusCode, error instanceof Error ? error : new Error(String(error)));
    
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

    const meetingResponse = mapNormalizedCalBookingsToMeeting(result, query);
    const statusCode = 200;
    logApiResponse(path, statusCode);
    
    return NextResponse.json({
      ...meetingResponse,
      statusCode,
    }, { status: statusCode });
  } catch (error) {
    if (error instanceof CalBookingsApiError) {
      const statusCode = error.status || 500;
      logApiResponse(path, statusCode, error);
      
      return NextResponse.json(
        createMeetingErrorResponse(error.message, error.details, query, statusCode),
        { status: statusCode },
      );
    }

    const statusCode = 500;
    logApiResponse(path, statusCode, error instanceof Error ? error : new Error(String(error)));
    
    return NextResponse.json(
      createMeetingErrorResponse("Unexpected error while fetching Cal.com bookings.", error, query, statusCode),
      { status: statusCode },
    );
  }
}
