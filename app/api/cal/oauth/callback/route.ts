import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  return NextResponse.redirect(`http://localhost:3000/api/auth/oauth2/callback/calcom?${url.searchParams.toString()}`)
}
