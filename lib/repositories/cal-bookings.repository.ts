/**
 * Cal.com Bookings Repository
 * Data access layer with repository pattern for better testability and separation of concerns
 */

import type { CalBookingsQuery } from "@/lib/schemas/calBookings";
import { calBookingsQuerySchema } from "@/lib/schemas/calBookings";
import {
  CAL_API_BASE_URL,
  CAL_API_VERSION,
  CAL_BOOKINGS_ENDPOINT,
} from "@/constants/oauth";
import { createLogger } from "@/lib/logging/logger";
import { ErrorFactory, ExternalAPIError } from "@/lib/errors";
import type { Result } from "@/lib/utils/result";
import { ok, err, tryCatch } from "@/lib/utils/result";
import { Timeouts } from "@/lib/constants";

const logger = createLogger("repository:cal-bookings");

/**
 * Repository configuration
 */
export interface RepositoryConfig {
  baseUrl?: string;
  apiVersion?: string;
  timeout?: number;
  fetchImpl?: typeof fetch;
}

/**
 * Fetch options for bookings requests
 */
export interface FetchBookingsParams {
  accessToken: string;
  query?: CalBookingsQuery;
  signal?: AbortSignal;
}

/**
 * Cal.com Bookings Repository
 * Handles low-level data access to Cal.com API
 */
export class CalBookingsRepository {
  private readonly config: Required<RepositoryConfig>;

  constructor(config: RepositoryConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? process.env.CAL_API_BASE_URL ?? CAL_API_BASE_URL,
      apiVersion: config.apiVersion ?? process.env.CAL_API_VERSION ?? CAL_API_VERSION,
      timeout: config.timeout ?? Timeouts.LONG,
      fetchImpl: config.fetchImpl ?? fetch,
    };

    // Normalize base URL (remove trailing slash)
    this.config.baseUrl = this.config.baseUrl.trim().replace(/\/$/, "");
  }

  /**
   * Builds query string from CalBookingsQuery
   */
  private buildQueryString(query?: CalBookingsQuery): string {
    if (!query) {
      return "";
    }

    const parsed = calBookingsQuerySchema.parse(query);
    const params = new URLSearchParams();

    // Array parameters
    if (parsed.status?.length) {
      params.set("status", parsed.status.join(","));
    }
    if (parsed.eventTypeIds?.length) {
      params.set("eventTypeIds", parsed.eventTypeIds.join(","));
    }
    if (parsed.teamIds?.length) {
      params.set("teamIds", parsed.teamIds.join(","));
    }

    // String parameters
    const stringParams = [
      "attendeeEmail",
      "attendeeName",
      "bookingUid",
      "eventTypeId",
      "teamId",
      "afterStart",
      "beforeEnd",
      "afterCreatedAt",
      "beforeCreatedAt",
      "afterUpdatedAt",
      "beforeUpdatedAt",
      "sortStart",
      "sortEnd",
      "sortCreated",
      "sortUpdatedAt",
    ] as const;

    for (const key of stringParams) {
      const value = parsed[key];
      if (typeof value === "string" && value) {
        params.set(key, value);
      }
    }

    // Numeric parameters
    if (typeof parsed.take === "number") {
      params.set("take", String(parsed.take));
    }
    if (typeof parsed.skip === "number") {
      params.set("skip", String(parsed.skip));
    }

    const qs = params.toString();
    return qs.length ? `?${qs}` : "";
  }

  /**
   * Validates access token
   */
  private validateAccessToken(accessToken: string): Result<string, ExternalAPIError> {
    if (!accessToken || typeof accessToken !== "string") {
      return err(
        ErrorFactory.externalAPI("A valid Cal.com access token is required", 400),
      );
    }

    const trimmed = accessToken.trim();
    if (!trimmed) {
      return err(
        ErrorFactory.externalAPI("Cal.com access token cannot be empty", 400),
      );
    }

    return ok(trimmed);
  }

  /**
   * Fetches bookings from Cal.com API
   */
  async fetchBookings(params: FetchBookingsParams): Promise<Result<unknown, ExternalAPIError>> {
    const { accessToken, query, signal } = params;

    // Validate access token
    const tokenValidation = this.validateAccessToken(accessToken);
    if (!tokenValidation.success) {
      return tokenValidation;
    }

    const validToken = tokenValidation.data;
    const url = `${this.config.baseUrl}${CAL_BOOKINGS_ENDPOINT}${this.buildQueryString(query)}`;

    logger.debug("Fetching Cal.com bookings", {
      url,
      hasQuery: !!query,
    });

    // Create abort controller for timeout if no signal provided
    const abortController = signal ? null : new AbortController();
    const timeoutId = abortController
      ? setTimeout(() => abortController.abort(), this.config.timeout)
      : null;

    const fetchResult = await tryCatch(async () => {
      const response = await this.config.fetchImpl(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validToken}`,
          Accept: "application/json",
          "cal-api-version": this.config.apiVersion,
        },
        signal: signal ?? abortController?.signal,
        cache: "no-store",
      });

      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Parse response body
      const payload = await response.json().catch(() => ({
        error: "Failed to parse response body as JSON.",
      }));

      if (!response.ok) {
        throw ErrorFactory.externalAPI(
          "Cal.com bookings request failed",
          response.status,
          payload,
        );
      }

      return payload;
    });

    if (!fetchResult.success) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      logger.error("Failed to fetch Cal.com bookings", fetchResult.error);

      // Handle specific error types
      if (fetchResult.error instanceof ExternalAPIError) {
        return err(fetchResult.error);
      }

      return err(
        ErrorFactory.externalAPI(
          "Failed to fetch Cal.com bookings",
          502,
          fetchResult.error,
        ),
      );
    }

    logger.debug("Successfully fetched Cal.com bookings");
    return ok(fetchResult.data);
  }

  /**
   * Creates a new repository instance with updated config
   */
  withConfig(config: Partial<RepositoryConfig>): CalBookingsRepository {
    return new CalBookingsRepository({
      ...this.config,
      ...config,
    });
  }
}

/**
 * Default repository instance
 */
export const calBookingsRepository = new CalBookingsRepository();
