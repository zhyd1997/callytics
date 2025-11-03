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
    const errorMessage = topUpdatedResponse.error instanceof Error 
      ? topUpdatedResponse.error.message 
      : 'Failed to fetch top updated bookings';
    
    throw new Error(errorMessage);
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
