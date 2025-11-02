import { redirect } from "next/navigation";

import { App as DashboardApp } from "@/modules/dashboard/App";
import { mapCalBookingsToMeetingCollection } from "@/lib/dto/calBookings";
import type { MeetingCollection } from "@/lib/types/meeting";
import {
  fetchCalBookingsAction,
  fetchTopUpdatedBookingsAction,
} from "@/app/(dashboard)/bookings/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/");
  }

  const [bookingsResponse, topUpdatedResponse] = await Promise.all([
    fetchCalBookingsAction({
      query: {
        sortUpdatedAt: "desc",
        take: 100,
      },
      userId: session.session.userId,
    }),
    fetchTopUpdatedBookingsAction({
      query: {
        sortUpdatedAt: "desc",
        take: 100,
      },
      userId: session.session.userId,
    }),
  ]);

  if (topUpdatedResponse.error) {
    // If top updated bookings fails, we can still use the main bookings response
    // Only throw if both fail or if it's a critical error
    const error = topUpdatedResponse.error;
    if (error instanceof Error) {
      // Re-throw with more context for error boundary
      throw new Error(`Failed to fetch top updated bookings: ${error.message}`);
    }
    // If bookingsResponse also failed, the error boundary will catch it
  }

  const meetings: MeetingCollection =
    bookingsResponse.data.length > 0
      ? bookingsResponse.data
      : mapCalBookingsToMeetingCollection(topUpdatedResponse.data ?? []);

  return (
    <DashboardApp
      initialMeetings={meetings}
    />
  );
}
