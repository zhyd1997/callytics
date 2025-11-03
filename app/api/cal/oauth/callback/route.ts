import { NextRequest, NextResponse } from "next/server";
import { buildAppUrl } from "@/lib/env";
import {
  logApiRequest,
  logApiResponse,
} from "@/lib/utils/api-logger";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const url = request.nextUrl.toString();
  const method = "GET";

  logApiRequest("GET /api/cal/oauth/callback", {
    method,
    url,
  });

  const redirectUrl = request.nextUrl;
  const search = redirectUrl.searchParams.toString();
  const pathname = `/api/auth/oauth2/callback/calcom${search ? `?${search}` : ""}`;

  const duration = Date.now() - startTime;
  logApiResponse("GET /api/cal/oauth/callback - redirecting", {
    method,
    url,
    statusCode: 302,
    duration,
  });

  return NextResponse.redirect(buildAppUrl(pathname));
}
