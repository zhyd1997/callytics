import { NextRequest, NextResponse } from "next/server";
import { buildAppUrl } from "@/lib/env";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const search = url.searchParams.toString();
  const pathname = `/api/auth/oauth2/callback/calcom${search ? `?${search}` : ""}`;

  return NextResponse.redirect(buildAppUrl(pathname));
}
