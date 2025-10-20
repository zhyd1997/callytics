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

type InputParams = Omit<FetchCalBookingsActionInput, "accessToken">;

const ACCESS_TOKEN =
  process.env.NODE_ENV === "development" ? process.env.CAL_API_KEY?.trim() ?? "" : "";

export const fetchCalBookingsAction = async (input: InputParams) => {
  try {
    const { accessToken, query, baseUrl, apiVersion } = fetchCalBookingsActionSchema.parse({
      accessToken: ACCESS_TOKEN,
      ...input,
    });

    const result = await fetchNormalizedCalBookings({
      accessToken,
      query: query as CalBookingsQuery | undefined,
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
    const { accessToken, query, baseUrl, apiVersion } = fetchCalBookingsActionSchema.parse({
      accessToken: ACCESS_TOKEN,
      ...input,
    });

    return await fetchTopUpdatedBookings({
      accessToken,
      query: query as CalBookingsQuery | undefined,
      baseUrl,
      apiVersion,
    });
  } catch (error) {
    console.error("Failed to execute fetchTopUpdatedBookingsAction", error);
    throw error;
  }
};
