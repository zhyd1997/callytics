import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import {
  CAL_API_BASE_URL,
  CAL_API_VERSION,
  CAL_BOOKINGS_ENDPOINT,
} from "@/constants/oauth";

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
  readonly statusCode: number; // Alias for consistency
  readonly details: unknown;
  readonly url?: string;

  constructor(message: string, status: number, details: unknown, url?: string) {
    super(message);
    this.name = "CalBookingsApiError";
    this.status = status;
    this.statusCode = status; // Expose as statusCode for monitoring
    this.details = details;
    this.url = url;
    
    // Ensure error is properly serializable
    Object.setPrototypeOf(this, CalBookingsApiError.prototype);
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
      throw new Error("A valid Cal.com access token is required.");
    }

    const trimmedToken = accessToken.trim();
    if (!trimmedToken) {
      throw new Error("Cal.com access token cannot be empty.");
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

    const payload = await response
      .json()
      .catch(() => ({
        error: "Failed to parse response body as JSON.",
        statusCode: response.status,
      }));

    if (!response.ok) {
      const errorDetails = {
        ...(typeof payload === "object" && payload !== null ? payload : { raw: payload }),
        statusCode: response.status,
        url,
      };

      // Log for Vercel monitoring
      console.error("[Cal.com API Error]", {
        statusCode: response.status,
        url,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      });

      throw new CalBookingsApiError(
        `Cal.com bookings request failed with status ${response.status}.`,
        response.status,
        errorDetails,
        url,
      );
    }

    // Log successful response for monitoring
    console.log("[Cal.com API Success]", {
      statusCode: response.status,
      url,
      timestamp: new Date().toISOString(),
    });

    return payload;
  } catch (error) {
    // Re-throw CalBookingsApiError as-is to preserve status code
    if (error instanceof CalBookingsApiError) {
      throw error;
    }

    // Wrap other errors with status code context
    console.error("[Cal.com API Fetch Error]", {
      error: {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
      },
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};
