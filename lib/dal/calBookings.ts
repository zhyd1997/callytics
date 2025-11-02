import { calBookingsQuerySchema, calBookingsResponseSchema } from "@/lib/schemas/calBookings";
import type { CalBookingsQuery, CalBookingsResponse } from "@/lib/schemas/calBookings";
import {
  CAL_API_BASE_URL,
  CAL_API_VERSION,
  CAL_BOOKINGS_ENDPOINT,
} from "@/constants/oauth";

export type FetchCalBookingsOptions = {
  readonly accessToken: string;
  readonly query?: CalBookingsQuery;
  readonly signal?: AbortSignal;
  readonly baseUrl?: string;
  readonly apiVersion?: string;
  readonly fetchImpl?: typeof fetch;
};

export class CalBookingsApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "CalBookingsApiError";
    this.status = status;
    this.details = details;
  }
}

const buildQueryString = (query?: CalBookingsQuery) => {
  if (!query) {
    return "";
  }

  const parsed = calBookingsQuerySchema.parse(query);
  const params = new URLSearchParams();

  // Helper to add array parameters
  const addArrayParam = (key: string, value: unknown) => {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    }
  };

  // Helper to add string parameters
  const addStringParam = (key: string, value: unknown) => {
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  };

  // Helper to add numeric parameters
  const addNumericParam = (key: string, value: unknown) => {
    if (typeof value === "number") {
      params.set(key, String(value));
    }
  };

  // Array parameters
  addArrayParam("status", parsed.status);
  addArrayParam("eventTypeIds", parsed.eventTypeIds);
  addArrayParam("teamIds", parsed.teamIds);

  // String parameters
  const stringParams = [
    "attendeeEmail", "attendeeName", "bookingUid", "eventTypeId", "teamId",
    "afterStart", "beforeEnd", "afterCreatedAt", "beforeCreatedAt",
    "afterUpdatedAt", "beforeUpdatedAt", "sortStart", "sortEnd",
    "sortCreated", "sortUpdatedAt"
  ] as const;

  for (const key of stringParams) {
    addStringParam(key, parsed[key]);
  }

  // Numeric parameters
  addNumericParam("take", parsed.take);
  addNumericParam("skip", parsed.skip);

  const qs = params.toString();
  return qs.length ? `?${qs}` : "";
};

const resolveBaseUrl = (baseUrl?: string) => {
  const resolved = baseUrl ?? process.env.CAL_API_BASE_URL ?? CAL_API_BASE_URL;
  return resolved.trim().replace(/\/$/, "");
};

const resolveApiVersion = (apiVersion?: string) => {
  return apiVersion ?? process.env.CAL_API_VERSION ?? CAL_API_VERSION;
};

const parseJson = (rawBody: string, status: number) => {
  if (!rawBody.trim().length) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch (error) {
    throw new CalBookingsApiError(
      "Cal.com bookings response is not valid JSON.",
      status,
      {
        rawBody,
        cause: error instanceof Error ? error.message : String(error),
      },
    );
  }
};

const validateResponsePayload = (payload: unknown, status: number): CalBookingsResponse => {
  try {
    return calBookingsResponseSchema.parse(payload);
  } catch (error) {
    throw new CalBookingsApiError(
      "Cal.com bookings response did not match the expected schema.",
      status,
      error,
    );
  }
};

export const fetchCalBookings = async (
  options: FetchCalBookingsOptions,
): Promise<CalBookingsResponse> => {
  try {
    const {
      accessToken,
      query,
      signal,
      baseUrl,
      apiVersion,
      fetchImpl = fetch,
    } = options;

    if (typeof accessToken !== "string") {
      throw new CalBookingsApiError("A valid Cal.com access token is required.", 401);
    }

    const trimmedToken = accessToken.trim();
    if (!trimmedToken.length) {
      throw new CalBookingsApiError("Cal.com access token cannot be empty.", 401);
    }

    const resolvedBaseUrl = resolveBaseUrl(baseUrl);
    const resolvedApiVersion = resolveApiVersion(apiVersion);

    const url = `${resolvedBaseUrl}${CAL_BOOKINGS_ENDPOINT}${buildQueryString(query)}`;

    const response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${trimmedToken}`,
        Accept: "application/json",
        "cal-api-version": resolvedApiVersion,
      },
      signal,
      cache: "no-store",
    });

    const rawBody = await response.text();
    const parsedPayload = parseJson(rawBody, response.status || 500);

    if (!response.ok) {
      throw new CalBookingsApiError(
        `Cal.com bookings request failed with status ${response.status}.`,
        response.status,
        parsedPayload,
      );
    }

    return validateResponsePayload(parsedPayload, response.status || 200);
  } catch (error) {
    console.error("Failed to fetch Cal.com bookings", error);
    throw error;
  }
};
