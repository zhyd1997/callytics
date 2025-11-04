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

  // Get a valid access token using better-auth's token refresh plugin
  // This automatically refreshes the token if expired or expiring soon
  const tokenResult = await auth.api.getValidAccessToken({
    headers: requestHeaders,
    body: { providerId: PROVIDER_ID, userId },
  });

  if (!tokenResult?.accessToken) {
    throw new Error("No accessToken found!");
  }

  return {
    accessToken: tokenResult.accessToken,
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
