/**
 * Cal.com Bookings Service
 * Business logic layer for Cal.com bookings operations
 * Decouples business logic from API routes and actions
 */

import type { CalBookingsQuery } from "@/lib/schemas/calBookings";
import type { Meeting, MeetingCollection } from "@/lib/types/meeting";
import {
  fetchNormalizedCalBookings,
  fetchTopUpdatedBookings,
  mapNormalizedCalBookingsToMeeting,
  mapCalBookingsToMeetingCollection,
  type NormalizedCalBookingsResponse,
} from "@/lib/dto/calBookings";
import { createLogger } from "@/lib/logging/logger";
import { ErrorFactory, ExternalAPIError } from "@/lib/errors";
import type { Result } from "@/lib/utils/result";
import { ok, err, tryCatch } from "@/lib/utils/result";

const logger = createLogger("service:cal-bookings");

/**
 * Service options for fetching bookings
 */
export interface FetchBookingsOptions {
  accessToken: string;
  query?: CalBookingsQuery;
  baseUrl?: string;
  apiVersion?: string;
}

/**
 * Cal.com Bookings Service
 */
export class CalBookingsService {
  /**
   * Fetches bookings and returns Meeting format
   */
  async fetchBookings(
    options: FetchBookingsOptions,
  ): Promise<Result<Meeting, ExternalAPIError>> {
    logger.info("Fetching Cal.com bookings", {
      hasQuery: !!options.query,
      queryParams: options.query ? Object.keys(options.query) : [],
    });

    const result = await tryCatch(async () => {
      const normalized = await fetchNormalizedCalBookings({
        accessToken: options.accessToken,
        query: options.query,
        baseUrl: options.baseUrl,
        apiVersion: options.apiVersion,
      });

      return mapNormalizedCalBookingsToMeeting(normalized, options.query);
    });

    if (!result.success) {
      logger.error("Failed to fetch bookings", result.error);
      return err(
        ErrorFactory.externalAPI(
          "Failed to fetch Cal.com bookings",
          502,
          result.error,
        ),
      );
    }

    logger.info("Successfully fetched bookings", {
      count: result.data.data.length,
      totalItems: result.data.pagination.totalItems,
    });

    return ok(result.data);
  }

  /**
   * Fetches normalized bookings response
   */
  async fetchNormalizedBookings(
    options: FetchBookingsOptions,
  ): Promise<Result<NormalizedCalBookingsResponse, ExternalAPIError>> {
    logger.info("Fetching normalized Cal.com bookings");

    const result = await tryCatch(() =>
      fetchNormalizedCalBookings({
        accessToken: options.accessToken,
        query: options.query,
        baseUrl: options.baseUrl,
        apiVersion: options.apiVersion,
      }),
    );

    if (!result.success) {
      logger.error("Failed to fetch normalized bookings", result.error);
      return err(
        ErrorFactory.externalAPI(
          "Failed to fetch normalized bookings",
          502,
          result.error,
        ),
      );
    }

    return ok(result.data);
  }

  /**
   * Fetches top updated bookings
   */
  async fetchTopUpdatedBookings(
    options: FetchBookingsOptions,
  ): Promise<Result<MeetingCollection, ExternalAPIError>> {
    logger.info("Fetching top updated bookings");

    const result = await tryCatch(() =>
      fetchTopUpdatedBookings({
        accessToken: options.accessToken,
        query: options.query,
        baseUrl: options.baseUrl,
        apiVersion: options.apiVersion,
      }),
    );

    if (!result.success) {
      logger.error("Failed to fetch top updated bookings", result.error);
      return err(
        ErrorFactory.externalAPI(
          "Failed to fetch top updated bookings",
          502,
          result.error,
        ),
      );
    }

    if (result.data.error) {
      logger.error("Top updated bookings returned error", result.data.error);
      return err(
        ErrorFactory.externalAPI(
          "Failed to fetch top updated bookings",
          502,
          result.data.error,
        ),
      );
    }

    const meetings = mapCalBookingsToMeetingCollection(result.data.data ?? []);
    
    logger.info("Successfully fetched top updated bookings", {
      count: meetings.length,
    });

    return ok(meetings);
  }

  /**
   * Fetches bookings with fallback to top updated bookings
   */
  async fetchBookingsWithFallback(
    options: FetchBookingsOptions,
  ): Promise<Result<MeetingCollection, ExternalAPIError>> {
    logger.info("Fetching bookings with fallback");

    // Try to fetch main bookings
    const bookingsResult = await this.fetchBookings(options);

    if (bookingsResult.success && bookingsResult.data.data.length > 0) {
      logger.info("Using main bookings data");
      return ok(bookingsResult.data.data);
    }

    // Fallback to top updated bookings
    logger.info("Main bookings empty, falling back to top updated");
    return this.fetchTopUpdatedBookings(options);
  }
}

/**
 * Singleton service instance
 */
export const calBookingsService = new CalBookingsService();
