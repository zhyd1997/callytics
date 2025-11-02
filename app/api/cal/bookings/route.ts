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

  const raw: Record<string, unknown> = {};
  const keys = new Set(searchParams.keys());

  for (const key of keys) {
    const values = searchParams
      .getAll(key)
      .map((value) => value.trim())
      .filter(Boolean);

    if (!values.length) {
      continue;
    }

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

const toSerializableErrorDetails = (details: unknown) => {
  if (details === null || typeof details === "undefined") {
    return undefined;
  }

  if (details instanceof ZodError) {
    return details.flatten();
  }

  if (details instanceof Error) {
    return {
      name: details.name,
      message: details.message,
    };
  }

  if (typeof details === "object") {
    try {
      return JSON.parse(JSON.stringify(details));
    } catch (serializationError) {
      console.error("Failed to serialize error details", serializationError, details);
      return undefined;
    }
  }

  return details;
};

const createMeetingErrorResponse = (
  message: string,
  details?: unknown,
  query?: CalBookingsQuery,
): Meeting => {
  const normalizedDetails = toSerializableErrorDetails(details);
  const errorPayload: Record<string, unknown> = { message };

  if (typeof normalizedDetails !== "undefined") {
    errorPayload.details = normalizedDetails;
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
    return NextResponse.json(
      createMeetingErrorResponse(
        "Missing or invalid Authorization header. Expected `Bearer <token>`.",
      ),
      { status: 401 },
    );
  }

  let query: CalBookingsQuery | undefined;
  try {
    query = mapSearchParamsToQuery(request.nextUrl.searchParams);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        createMeetingErrorResponse("Invalid query parameters.", error.flatten()),
        { status: 400 },
      );
    }

    return NextResponse.json(
      createMeetingErrorResponse("Failed to parse query parameters.", error),
      { status: 400 },
    );
  }

  try {
    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
    });

    return NextResponse.json(mapNormalizedCalBookingsToMeeting(result, query));
  } catch (error) {
    if (error instanceof CalBookingsApiError) {
      return NextResponse.json(
        createMeetingErrorResponse(error.message, error.details, query),
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      createMeetingErrorResponse("Unexpected error while fetching Cal.com bookings.", error, query),
      { status: 500 },
    );
  }
}
