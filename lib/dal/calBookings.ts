import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import {
  CAL_API_BASE_URL,
  CAL_API_VERSION,
  CAL_BOOKINGS_ENDPOINT,
} from "@/constants/oauth";
import { CalBookingsApiError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { envConfig } from "@/lib/env";
import { HTTP_STATUS, HTTP_HEADERS, CONTENT_TYPES } from "@/lib/constants/http";

export type FetchCalBookingsOptions = {
  readonly accessToken: string;
  readonly query?: Record<string, unknown>;
  readonly signal?: AbortSignal;
  readonly baseUrl?: string;
  readonly apiVersion?: string;
  readonly fetchImpl?: typeof fetch;
};

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

const resolveBaseUrl = (baseUrl?: string): string => {
  const resolved = baseUrl ?? envConfig.calCom.apiBaseUrl ?? CAL_API_BASE_URL;
  return resolved.trim().replace(/\/$/, "");
};

const resolveApiVersion = (apiVersion?: string): string => {
  return apiVersion ?? envConfig.calCom.apiVersion ?? CAL_API_VERSION;
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
    throw new CalBookingsApiError(
      "A valid Cal.com access token is required.",
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const trimmedToken = accessToken.trim();
  if (!trimmedToken) {
    throw new CalBookingsApiError(
      "Cal.com access token cannot be empty.",
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const resolvedBaseUrl = resolveBaseUrl(baseUrl);
  const resolvedApiVersion = resolveApiVersion(apiVersion);

  const url = `${resolvedBaseUrl}${CAL_BOOKINGS_ENDPOINT}${buildQueryString(query)}`;

  try {
    logger.debug("Fetching Cal.com bookings", {
      url: url.replace(trimmedToken, "[REDACTED]"),
      hasQuery: Boolean(query),
    });

    const response = await fetchImpl(url, {
      method: "GET",
      headers: {
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${trimmedToken}`,
        [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
        [HTTP_HEADERS.CAL_API_VERSION]: resolvedApiVersion,
      },
      signal,
      cache: "no-store",
    });

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (parseError) {
      logger.error("Failed to parse Cal.com bookings response", parseError);
      throw new CalBookingsApiError(
        "Failed to parse response body as JSON.",
        HTTP_STATUS.BAD_GATEWAY,
        { parseError: parseError instanceof Error ? parseError.message : String(parseError) },
      );
    }

    if (!response.ok) {
      logger.error("Cal.com bookings API error", undefined, {
        status: response.status,
        statusText: response.statusText,
        payload,
      });
      throw new CalBookingsApiError(
        `Cal.com bookings request failed: ${response.status} ${response.statusText}`,
        response.status,
        payload,
      );
    }

    logger.debug("Successfully fetched Cal.com bookings", {
      status: response.status,
    });

    return payload;
  } catch (error) {
    if (error instanceof CalBookingsApiError) {
      throw error;
    }

    // Handle abort signal
    if (signal?.aborted) {
      logger.warn("Cal.com bookings request aborted");
      throw new CalBookingsApiError(
        "Request was aborted",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    logger.error("Failed to fetch Cal.com bookings", error, {
      baseUrl: resolvedBaseUrl,
    });
    throw new CalBookingsApiError(
      "Unexpected error while fetching Cal.com bookings",
      HTTP_STATUS.BAD_GATEWAY,
      { originalError: error instanceof Error ? error.message : String(error) },
    );
  }
};
