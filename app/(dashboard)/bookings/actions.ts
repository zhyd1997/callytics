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
import { extractStatusCode, logError } from "@/lib/utils/errors";

type InputParams = FetchCalBookingsActionInput;

type ActionContext = {
  accessToken: string;
  query: CalBookingsQuery | undefined;
  baseUrl?: string;
  apiVersion?: string;
};

const resolveActionContext = async (input: InputParams): Promise<ActionContext> => {
  const { query, baseUrl, apiVersion, userId } = fetchCalBookingsActionSchema.parse(input);

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    throw new Error("No session found!");
  }

  if (session.session.userId !== userId) {
    throw new Error("Not Authorized!");
  }

  const { accessToken } = await auth.api.getAccessToken({
    headers: requestHeaders,
    body: { providerId: PROVIDER_ID, userId },
  })

  if (!accessToken) {
    throw new Error("No accessToken found!");
  }

  return {
    accessToken,
    query,
    baseUrl,
    apiVersion,
  };
};

/**
 * Fetches Cal.com bookings for authenticated user
 * @throws {Error} When authentication fails or API request fails
 */
export const fetchCalBookingsAction = async (input: InputParams) => {
  try {
    const { accessToken, query, baseUrl, apiVersion } = await resolveActionContext(input);

    const result = await fetchNormalizedCalBookings({
      accessToken,
      query,
      baseUrl,
      apiVersion,
    });

    return mapNormalizedCalBookingsToMeeting(result, query, 200);
  } catch (error) {
    logError('Server Action: fetchCalBookingsAction', error, {
      statusCode: extractStatusCode(error),
    });
    throw error;
  }
};

/**
 * Fetches top updated bookings for authenticated user
 * @throws {Error} When authentication fails or API request fails
 */
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
    logError('Server Action: fetchTopUpdatedBookingsAction', error, {
      statusCode: extractStatusCode(error),
    });
    throw error;
  }
};
