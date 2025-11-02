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
import { buildAppUrl, envConfig } from "@/lib/env";
import { AuthenticationError, ExternalApiError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { HTTP_STATUS } from "@/lib/constants/http";

// OAuth configuration with environment variable overrides
const DEFAULT_REDIRECT_URI = buildAppUrl(OAUTH_CALLBACK_PATH);

// Use validated environment variables
const CLIENT_ID = envConfig.calCom.clientId;
const CLIENT_SECRET = envConfig.calCom.clientSecret;
const TOKEN_URL = envConfig.calCom.tokenEndpoint ?? CAL_TOKEN_URL;
const REDIRECT_URI = envConfig.calCom.redirectUri ?? DEFAULT_REDIRECT_URI;

async function fetchCalProfile(accessToken: string) {
  if (!accessToken || typeof accessToken !== "string" || accessToken.trim().length === 0) {
    throw new AuthenticationError("Missing or invalid access token");
  }

  try {
    const response = await fetch(CAL_PROFILE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken.trim()}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMessage = `Failed to load Cal.com profile: ${response.status} ${response.statusText}`;
      logger.error("Cal.com profile fetch failed", undefined, {
        status: response.status,
        statusText: response.statusText,
      });
      throw new ExternalApiError(
        errorMessage,
        response.status >= 500 ? HTTP_STATUS.BAD_GATEWAY : response.status,
        "Cal.com API",
      );
    }

    const payload = (await response.json()) as CalProfilePayload;
    const profile = payload.data;

    if (!profile?.id) {
      logger.error("Cal.com profile response missing id", undefined, { payload });
      throw new ExternalApiError(
        "Cal.com profile response missing id",
        HTTP_STATUS.BAD_GATEWAY,
        "Cal.com API",
      );
    }

    return profile;
  } catch (error) {
    if (error instanceof ExternalApiError || error instanceof AuthenticationError) {
      throw error;
    }
    logger.error("Unexpected error fetching Cal.com profile", error);
    throw new ExternalApiError(
      "Failed to fetch Cal.com profile",
      HTTP_STATUS.BAD_GATEWAY,
      "Cal.com API",
      { originalError: error instanceof Error ? error.message : String(error) },
    );
  }
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
