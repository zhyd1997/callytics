import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";

const DEFAULT_CAL_API_BASE_URL = "https://api.cal.com";
const DEFAULT_CAL_API_VERSION = "2024-08-13";
const BOOKINGS_ENDPOINT = "/v2/bookings";

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

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "CalBookingsApiError";
    this.status = status;
    this.details = details;
  }
}

const buildQueryString = (query?: Record<string, unknown>) => {
  if (!query) {
    return "";
  }

  const parsed = calBookingsQuerySchema.parse(query);
  const params = new URLSearchParams();

  if (parsed.status?.length) {
    params.set("status", parsed.status.join(","));
  }

  if (parsed.attendeeEmail) {
    params.set("attendeeEmail", parsed.attendeeEmail);
  }

  if (parsed.attendeeName) {
    params.set("attendeeName", parsed.attendeeName);
  }

  if (parsed.bookingUid) {
    params.set("bookingUid", parsed.bookingUid);
  }

  if (parsed.eventTypeIds?.length) {
    params.set("eventTypeIds", parsed.eventTypeIds.join(","));
  }

  if (parsed.eventTypeId) {
    params.set("eventTypeId", parsed.eventTypeId);
  }

  if (parsed.teamIds?.length) {
    params.set("teamIds", parsed.teamIds.join(","));
  }

  if (parsed.teamId) {
    params.set("teamId", parsed.teamId);
  }

  if (parsed.afterStart) {
    params.set("afterStart", parsed.afterStart);
  }

  if (parsed.beforeEnd) {
    params.set("beforeEnd", parsed.beforeEnd);
  }

  if (parsed.afterCreatedAt) {
    params.set("afterCreatedAt", parsed.afterCreatedAt);
  }

  if (parsed.beforeCreatedAt) {
    params.set("beforeCreatedAt", parsed.beforeCreatedAt);
  }

  if (parsed.afterUpdatedAt) {
    params.set("afterUpdatedAt", parsed.afterUpdatedAt);
  }

  if (parsed.beforeUpdatedAt) {
    params.set("beforeUpdatedAt", parsed.beforeUpdatedAt);
  }

  if (parsed.sortStart) {
    params.set("sortStart", parsed.sortStart);
  }

  if (parsed.sortEnd) {
    params.set("sortEnd", parsed.sortEnd);
  }

  if (parsed.sortCreated) {
    params.set("sortCreated", parsed.sortCreated);
  }

  if (parsed.sortUpdatedAt) {
    params.set("sortUpdatedAt", parsed.sortUpdatedAt);
  }

  if (typeof parsed.take !== "undefined") {
    params.set("take", String(parsed.take));
  }

  if (typeof parsed.skip !== "undefined") {
    params.set("skip", String(parsed.skip));
  }

  const qs = params.toString();
  return qs.length ? `?${qs}` : "";
};

const resolveBaseUrl = (baseUrl?: string) => {
  const resolved = baseUrl ?? process.env.CAL_API_BASE_URL ?? DEFAULT_CAL_API_BASE_URL;
  return resolved.trim().replace(/\/$/, "");
};

const resolveApiVersion = (apiVersion?: string) => {
  return apiVersion ?? process.env.CAL_API_VERSION ?? DEFAULT_CAL_API_VERSION;
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

    const url = `${resolvedBaseUrl}${BOOKINGS_ENDPOINT}${buildQueryString(query)}`;

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
        payload,
      );
    }

    return payload;
  } catch (error) {
    console.error("Failed to fetch Cal.com bookings", error);
    throw error;
  }
};
