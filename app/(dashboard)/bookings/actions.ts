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
import {
  logApiRequest,
  logApiError,
} from "@/lib/utils/api-logger";
import { CalBookingsApiError } from "@/lib/dal/calBookings";

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

export const fetchCalBookingsAction = async (input: InputParams) => {
  logApiRequest("fetchCalBookingsAction", {
    method: "server-action",
    userId: input.userId,
  });

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
    const statusCode =
      error instanceof CalBookingsApiError ? error.status : 500;

    logApiError("fetchCalBookingsAction failed", {
      method: "server-action",
      statusCode,
      userId: input.userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

export const fetchTopUpdatedBookingsAction = async (input: InputParams) => {
  logApiRequest("fetchTopUpdatedBookingsAction", {
    method: "server-action",
    userId: input.userId,
  });

  try {
    const { accessToken, query, baseUrl, apiVersion } = await resolveActionContext(input);

    return await fetchTopUpdatedBookings({
      accessToken,
      query,
      baseUrl,
      apiVersion,
    });
  } catch (error) {
    const statusCode =
      error instanceof CalBookingsApiError ? error.status : 500;

    logApiError("fetchTopUpdatedBookingsAction failed", {
      method: "server-action",
      statusCode,
      userId: input.userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
