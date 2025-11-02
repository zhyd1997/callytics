import type { z } from "zod";
import {
  calBookingsQuerySchema,
  calBookingsResponseSchema,
  type CalBookingsQuery,
} from "@/lib/schemas/calBookings";
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

export type CalBookingsResponse = z.infer<typeof calBookingsResponseSchema>;

export class CalBookingsApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  readonly cause?: unknown;

  constructor(message: string, status: number, details?: unknown, cause?: unknown) {
    super(message);
    this.name = "CalBookingsApiError";
    this.status = status;
    this.details = details;
    if (typeof cause !== "undefined") {
      this.cause = cause;
    }
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

    if (!accessToken || typeof accessToken !== "string") {
      throw new CalBookingsApiError("A valid Cal.com access token is required.", 401);
    }

    const trimmedToken = accessToken.trim();
    if (!trimmedToken) {
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
    const normalizedBody = rawBody.trim();
    let payload: unknown = undefined;

    if (normalizedBody.length > 0) {
      try {
        payload = JSON.parse(normalizedBody);
      } catch (parseError) {
        throw new CalBookingsApiError(
          "Failed to parse Cal.com bookings response.",
          response.ok ? 502 : response.status,
          normalizedBody,
          parseError,
        );
      }
    }

    if (!response.ok) {
      throw new CalBookingsApiError(
        "Cal.com bookings request failed.",
        response.status,
        payload ?? normalizedBody ?? null,
      );
    }

    const parsedPayload = calBookingsResponseSchema.safeParse(payload);
    if (!parsedPayload.success) {
      throw new CalBookingsApiError(
        "Unsupported Cal.com bookings response shape.",
        response.ok ? 502 : response.status,
        {
          issues: parsedPayload.error.issues,
          details: parsedPayload.error.flatten(),
          payload,
        },
        parsedPayload.error,
      );
    }

    return parsedPayload.data;
  } catch (error) {
    console.error("Failed to fetch Cal.com bookings", error);
    throw error;
  }
};
