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
import { buildAppUrl, env } from "@/lib/config/env";
import { createLogger } from "@/lib/logging/logger";
import { ErrorFactory } from "@/lib/errors";

const logger = createLogger("auth");

// OAuth configuration with environment variable overrides
const DEFAULT_REDIRECT_URI = buildAppUrl(OAUTH_CALLBACK_PATH);

// Environment variables from validated config
const CLIENT_ID = env.CAL_COM_CLIENT_ID;
const CLIENT_SECRET = env.CAL_COM_CLIENT_SECRET;
const TOKEN_URL = env.CAL_OAUTH_TOKEN_ENDPOINT ?? CAL_TOKEN_URL;
const REDIRECT_URI = env.CAL_OAUTH_REDIRECT_URI ?? DEFAULT_REDIRECT_URI;

/**
 * Fetches Cal.com user profile using access token
 */
async function fetchCalProfile(accessToken?: string) {
  if (!accessToken) {
    logger.error("Missing access token for profile fetch");
    throw ErrorFactory.authentication("Missing access token");
  }

  logger.debug("Fetching Cal.com profile");

  const response = await fetch(CAL_PROFILE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    logger.error("Failed to load Cal.com profile", undefined, {
      status: response.status,
      statusText: response.statusText,
    });
    throw ErrorFactory.externalAPI(
      "Failed to load Cal.com profile",
      response.status,
    );
  }

  const payload = (await response.json()) as CalProfilePayload;
  const profile = payload.data;

  if (!profile?.id) {
    logger.error("Cal.com profile response missing id");
    throw ErrorFactory.externalAPI("Cal.com profile response missing id", 502);
  }

  logger.debug("Successfully fetched Cal.com profile", { userId: profile.id });
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
