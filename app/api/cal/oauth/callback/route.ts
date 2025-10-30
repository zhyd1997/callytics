import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type CalOAuthSuccess = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type: string;
};

type CalOAuthError = {
  error?: string;
  error_description?: string;
  error_uri?: string;
};

const DEFAULT_TOKEN_ENDPOINT = "https://api.cal.com/v2/oauth/token";

const TOKEN_ENDPOINT =
  process.env.CAL_OAUTH_TOKEN_ENDPOINT ?? DEFAULT_TOKEN_ENDPOINT;
const CLIENT_ID = process.env.CAL_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.CAL_OAUTH_CLIENT_SECRET;

const STATE_COOKIE_KEY = "cal_oauth_state";

export const dynamic = "force-dynamic";

function resolveRedirectUri(origin: string) {
  return (
    process.env.CAL_OAUTH_REDIRECT_URI ??
    `${origin}/api/cal/oauth/callback`
  );
}

function buildErrorResponse(message: string, status = 400, meta?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      details: meta,
    },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  return NextResponse.redirect(`http://localhost:3000/api/auth/oauth2/callback/calcom?${url.searchParams.toString()}`)
  // const url = request.nextUrl;
  // const stateFromQuery = url.searchParams.get("state");
  // const code = url.searchParams.get("code");
  // const error = url.searchParams.get("error");
  // const errorDescription = url.searchParams.get("error_description");

  // if (error) {
  //   return buildErrorResponse(errorDescription ?? error, 400, {
  //     error,
  //     error_description: errorDescription,
  //   });
  // }

  // if (!code) {
  //   return buildErrorResponse(
  //     "Cal.com did not return an authorization code.",
  //     400,
  //   );
  // }

  // const cookieStore = await cookies();
  // const stateCookie = cookieStore.get(STATE_COOKIE_KEY)?.value;

  // if (!stateCookie || !stateFromQuery || stateCookie !== stateFromQuery) {
  //   cookieStore.delete(STATE_COOKIE_KEY);
  //   return buildErrorResponse(
  //     "OAuth state mismatch. Restart the Cal.com authorization flow.",
  //     400,
  //   );
  // }

  // cookieStore.delete(STATE_COOKIE_KEY);

  // if (!CLIENT_ID || !CLIENT_SECRET) {
  //   return buildErrorResponse(
  //     "CAL_OAUTH_CLIENT_ID and CAL_OAUTH_CLIENT_SECRET must be configured.",
  //     500,
  //   );
  // }

  // const redirectUri = resolveRedirectUri(url.origin);

  // const payload = new URLSearchParams({
  //   grant_type: "authorization_code",
  //   code,
  //   redirect_uri: redirectUri,
  //   client_id: CLIENT_ID,
  //   client_secret: CLIENT_SECRET,
  // });

  // let tokenResponse: Response;
  // try {
  //   tokenResponse = await fetch(TOKEN_ENDPOINT, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       Accept: "application/json",
  //     },
  //     body: payload,
  //     cache: "no-store",
  //   });
  // } catch (fetchError) {
  //   return buildErrorResponse(
  //     "Failed to reach Cal.com token endpoint.",
  //     502,
  //     fetchError,
  //   );
  // }

  // const responseBody = (await tokenResponse.json().catch(() => ({}))) as
  //   | CalOAuthSuccess
  //   | CalOAuthError
  //   | Record<string, unknown>;

  // if (!tokenResponse.ok || !("access_token" in responseBody)) {
  //   return buildErrorResponse(
  //     "Cal.com token exchange failed.",
  //     tokenResponse.status || 500,
  //     responseBody,
  //   );
  // }

  // const { access_token, refresh_token, expires_in, scope, token_type } =
  //   responseBody as CalOAuthSuccess;

  // return NextResponse.json({
  //   ok: true,
  //   accessToken: access_token,
  //   refreshToken: refresh_token,
  //   expiresIn: expires_in,
  //   scope,
  //   tokenType: token_type,
  //   redirectUri,
  //   tokenEndpoint: TOKEN_ENDPOINT,
  //   secureNote:
  //     "Persist these tokens securely (server-side store or secrets manager); they are not saved automatically.",
  // });
}
