import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PROVIDER_ID } from "@/constants/oauth";

export const dynamic = "force-dynamic";

/**
 * POST /api/cal/oauth/refresh
 * Manually refresh the Cal.com access token for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. No session found." },
        { status: 401 },
      );
    }

    const userId = session.session.userId;

    try {
      // Use better-auth's token refresh plugin
      const result = await auth.api.getValidAccessToken({
        headers: request.headers,
        body: { providerId: PROVIDER_ID, userId },
      });

      return NextResponse.json({
        success: true,
        refreshed: result.refreshed,
        message: result.refreshed
          ? "Access token refreshed successfully."
          : "Access token is still valid, no refresh needed.",
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to refresh access token.",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error in token refresh endpoint", error);
    return NextResponse.json(
      {
        error: "Unexpected error occurred.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
