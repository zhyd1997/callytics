'use server';

import {
  fetchCalBookingsActionSchema,
  type FetchCalBookingsActionInput,
  type CalBookingsQuery,
} from "@/lib/schemas/calBookings";
import {
  fetchNormalizedCalBookings,
  fetchTopUpdatedBookings,
  mapNormalizedCalBookingsToMeeting,
} from "@/lib/dto/calBookings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PROVIDER_ID } from "@/constants/oauth";
import { AuthenticationError, AuthorizationError, normalizeError } from "@/lib/errors";
import { logger } from "@/lib/logger";

type InputParams = FetchCalBookingsActionInput;

type ActionContext = {
  accessToken: string;
  query: CalBookingsQuery | undefined;
  baseUrl?: string;
  apiVersion?: string;
};

const resolveActionContext = async (input: InputParams): Promise<ActionContext> => {
  let parsedInput;
  try {
    parsedInput = fetchCalBookingsActionSchema.parse(input);
  } catch (error) {
    logger.error("Invalid input for bookings action", error);
    throw error;
  }

  const { query, baseUrl, apiVersion, userId } = parsedInput;

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    logger.warn("No session found in bookings action", { userId });
    throw new AuthenticationError("No session found");
  }

  if (session.session.userId !== userId) {
    logger.warn("User ID mismatch in bookings action", {
      sessionUserId: session.session.userId,
      requestedUserId: userId,
    });
    throw new AuthorizationError("User ID mismatch");
  }

  let accessToken: string;
  try {
    const tokenResult = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { providerId: PROVIDER_ID, userId },
    });

    if (!tokenResult?.accessToken) {
      logger.warn("No access token found in bookings action", { userId });
      throw new AuthenticationError("No access token found");
    }

    accessToken = tokenResult.accessToken;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    logger.error("Failed to get access token", error, { userId });
    throw new AuthenticationError("Failed to retrieve access token");
  }

  return {
    accessToken,
    query,
    baseUrl,
    apiVersion,
  };
};

export const fetchCalBookingsAction = async (input: InputParams) => {
  try {
    const { accessToken, query, baseUrl, apiVersion } = await resolveActionContext(input);

    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
      baseUrl,
      apiVersion,
    });

    return mapNormalizedCalBookingsToMeeting(result, query);
  } catch (error) {
    const normalizedError = normalizeError(error);
    logger.error("Failed to execute fetchCalBookingsAction", normalizedError, {
      userId: input.userId,
    });
    throw normalizedError;
  }
};

export const fetchTopUpdatedBookingsAction = async (input: InputParams) => {
  try {
    const { accessToken, query, baseUrl, apiVersion } = await resolveActionContext(input);

    return await fetchTopUpdatedBookings({
      accessToken,
      query,
      baseUrl,
      apiVersion,
    });
  } catch (error) {
    const normalizedError = normalizeError(error);
    logger.error("Failed to execute fetchTopUpdatedBookingsAction", normalizedError, {
      userId: input.userId,
    });
    throw normalizedError;
  }
};
