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
import { getValidAccessToken } from "@/lib/oauth/refreshToken";

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

  // Get a valid access token, automatically refreshing if needed
  const { accessToken } = await getValidAccessToken(userId, PROVIDER_ID);

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
    console.error("Failed to execute fetchCalBookingsAction", error);
    throw error;
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
    console.error("Failed to execute fetchTopUpdatedBookingsAction", error);
    throw error;
  }
};
