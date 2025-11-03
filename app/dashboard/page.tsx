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
    const statusCode = topUpdatedResponse.error instanceof Error && "statusCode" in topUpdatedResponse.error
      ? (topUpdatedResponse.error as { statusCode: number }).statusCode
      : topUpdatedResponse.error instanceof Error && "status" in topUpdatedResponse.error
        ? (topUpdatedResponse.error as { status: number }).status
        : 500;

    console.error("[Dashboard Page Error]", {
      action: "fetchTopUpdatedBookingsAction",
      statusCode,
      error: {
        name: topUpdatedResponse.error instanceof Error ? topUpdatedResponse.error.name : "UnknownError",
        message: topUpdatedResponse.error instanceof Error ? topUpdatedResponse.error.message : String(topUpdatedResponse.error),
      },
      timestamp: new Date().toISOString(),
    });

    throw new Error(`Failed to fetch top updated bookings (status: ${statusCode})`);
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
