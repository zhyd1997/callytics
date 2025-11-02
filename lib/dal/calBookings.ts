import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import {
  CAL_API_BASE_URL,
  CAL_API_VERSION,
  CAL_BOOKINGS_ENDPOINT,
} from "@/constants/oauth";
import { ExternalAPIError } from "@/lib/errors";
import { createLogger } from "@/lib/logging/logger";

const logger = createLogger("dal:cal-bookings");

export type FetchCalBookingsOptions = {
  readonly accessToken: string;
  readonly query?: Record<string, unknown>;
  readonly signal?: AbortSignal;
  readonly baseUrl?: string;
  readonly apiVersion?: string;
  readonly fetchImpl?: typeof fetch;
};

/**
 * @deprecated Use ExternalAPIError from @/lib/errors instead
 */
export class CalBookingsApiError extends ExternalAPIError {
  constructor(message: string, status: number, details: unknown) {
    super(message, status, details);
    this.name = "CalBookingsApiError";
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
      throw new CalBookingsApiError(
        "A valid Cal.com access token is required.",
        400,
        null,
      );
    }

    const trimmedToken = accessToken.trim();
    if (!trimmedToken) {
      throw new CalBookingsApiError(
        "Cal.com access token cannot be empty.",
        400,
        null,
      );
    }

    const resolvedBaseUrl = resolveBaseUrl(baseUrl);
    const resolvedApiVersion = resolveApiVersion(apiVersion);

    const url = `${resolvedBaseUrl}${CAL_BOOKINGS_ENDPOINT}${buildQueryString(query)}`;

    logger.debug("Fetching Cal.com bookings", { url, hasQuery: !!query });

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
      }));

    if (!response.ok) {
      throw new CalBookingsApiError(
        "Cal.com bookings request failed.",
        response.status,
        JSON.stringify(payload),
      );
    }

    logger.debug("Successfully fetched Cal.com bookings");
    return payload;
  } catch (error) {
    logger.error("Failed to fetch Cal.com bookings", error);
    throw error;
  }
};
