import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import {
  CAL_API_BASE_URL,
  CAL_API_VERSION,
  CAL_BOOKINGS_ENDPOINT,
} from "@/constants/oauth";
import {
  logApiRequest,
  logApiResponse,
  logApiError,
} from "@/lib/utils/api-logger";

export type FetchCalBookingsOptions = {
  readonly accessToken: string;
  readonly query?: Record<string, unknown>;
  readonly signal?: AbortSignal;
  readonly baseUrl?: string;
  readonly apiVersion?: string;
  readonly fetchImpl?: typeof fetch;
};

export class CalBookingsApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  readonly url?: string;
  readonly method?: string;
  readonly timestamp: string;

  constructor(
    message: string,
    status: number,
    details: unknown,
    context?: { url?: string; method?: string },
  ) {
    super(message);
    this.name = "CalBookingsApiError";
    this.status = status;
    this.details = details;
    this.url = context?.url;
    this.method = context?.method;
    this.timestamp = new Date().toISOString();
  }
}

const buildQueryString = (query?: Record<string, unknown>) => {
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
): Promise<unknown> => {
  const {
    accessToken,
    query,
    signal,
    baseUrl,
    apiVersion,
    fetchImpl = fetch,
  } = options;

  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("A valid Cal.com access token is required.");
  }

  const trimmedToken = accessToken.trim();
  if (!trimmedToken) {
    throw new Error("Cal.com access token cannot be empty.");
  }

  const resolvedBaseUrl = resolveBaseUrl(baseUrl);
  const resolvedApiVersion = resolveApiVersion(apiVersion);

  const url = `${resolvedBaseUrl}${CAL_BOOKINGS_ENDPOINT}${buildQueryString(query)}`;

  logApiRequest("Fetching Cal.com bookings", {
    method: "GET",
    url,
    apiVersion: resolvedApiVersion,
  });

  try {
    const startTime = Date.now();
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

    const duration = Date.now() - startTime;

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = {
        error: "Failed to parse response body as JSON.",
      };
    }

    // Always log response with status code for Vercel monitoring
    logApiResponse("Cal.com bookings API response", {
      method: "GET",
      url,
      statusCode: response.status,
      duration,
      apiVersion: resolvedApiVersion,
    });

    if (!response.ok) {
      logApiError("Cal.com bookings request failed", {
        method: "GET",
        url,
        statusCode: response.status,
        duration,
        error: JSON.stringify(payload),
        apiVersion: resolvedApiVersion,
      });

      throw new CalBookingsApiError(
        `Cal.com bookings request failed with status ${response.status}.`,
        response.status,
        payload,
        { url, method: "GET" },
      );
    }

    return payload;
  } catch (error) {
    // Re-throw CalBookingsApiError as-is (already logged)
    if (error instanceof CalBookingsApiError) {
      throw error;
    }

    // Log unexpected errors
    logApiError("Unexpected error fetching Cal.com bookings", {
      method: "GET",
      url,
      statusCode: 500,
      error:
        error instanceof Error ? error.message : String(error),
      apiVersion: resolvedApiVersion,
    });

    throw error;
  }
};
