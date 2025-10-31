import type { CalProfilePayload } from "@/lib/types/cal";
import {
  CAL_AUTHORIZATION_URL,
  CAL_TOKEN_URL,
  CAL_PROFILE_ENDPOINT,
  OAUTH_CALLBACK_PATH,
  DEFAULT_OAUTH_SCOPES,
  PROVIDER_ID,
} from "@/constants/oauth";
import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { buildAppUrl } from "@/lib/env";

// OAuth configuration with environment variable overrides
const DEFAULT_REDIRECT_URI = buildAppUrl(OAUTH_CALLBACK_PATH);

// Environment variables
const CLIENT_ID = process.env.CAL_COM_CLIENT_ID;
const CLIENT_SECRET = process.env.CAL_COM_CLIENT_SECRET;
const TOKEN_URL = process.env.CAL_OAUTH_TOKEN_ENDPOINT ?? CAL_TOKEN_URL;
const REDIRECT_URI =
  process.env.CAL_OAUTH_REDIRECT_URI ?? DEFAULT_REDIRECT_URI;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "`CAL_COM_CLIENT_ID` and `CAL_COM_CLIENT_SECRET` must be configured.",
  );
}

async function fetchCalProfile(accessToken?: string) {
  if (!accessToken) {
    throw new Error("Missing access token!");
  }

  const response = await fetch(CAL_PROFILE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load Cal.com profile.");
  }

  const payload = (await response.json()) as CalProfilePayload;
  const profile = payload.data;

  if (!profile?.id) {
    throw new Error("Cal.com profile response missing id.");
  }

  return profile;
}

/**
 * @see https://www.better-auth.com/docs/concepts/oauth
 * @see https://cal.com/help/apps-and-integrations/oauth
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: PROVIDER_ID,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          authorizationUrl: CAL_AUTHORIZATION_URL,
          tokenUrl: TOKEN_URL,
          redirectURI: REDIRECT_URI,
          scopes: DEFAULT_OAUTH_SCOPES,
          // Additional available scopes: "EVENT_TYPE_READ", "BOOKING_READ", "SCHEDULE_READ", "APPS_READ", "PROFILE_READ"
          // discoveryUrl: "https://auth.example.com/.well-known/openid-configuration", 
          // ... other config options
          async getUserInfo(token) {
            const profile = await fetchCalProfile(token.accessToken);

            return {
              id: profile.id,
              name: profile?.username ?? undefined,
              email: profile?.email ?? undefined,
              image: profile?.avatar_url ?? undefined,
              // TODO: fix it, use real value.
              emailVerified: true,
            };
          },
        },
        // Add more providers as needed
      ],
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ],
});
