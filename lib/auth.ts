import type { CalProfilePayload } from "@/lib/types/cal";
import {
  CAL_AUTHORIZATION_URL,
  CAL_TOKEN_URL,
  CAL_REFRESH_TOKEN_URL,
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
import type { BetterAuthPlugin } from "better-auth";

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
 * Better-auth plugin for auto-refreshing Cal.com OAuth tokens
 */
const oauthTokenRefresh = (): BetterAuthPlugin => {
  return {
    id: "oauth-token-refresh",
    endpoints: {
      getValidAccessToken: {
        method: "POST",
        body: {
          providerId: { type: "string", required: true },
          userId: { type: "string", required: true },
        },
        async handler(ctx) {
          const { providerId, userId } = ctx.body;

          // Find the OAuth account for this user and provider
          const account = await ctx.context.adapter.findOne({
            model: "account",
            where: [
              { field: "userId", value: userId },
              { field: "providerId", value: providerId },
            ],
          });

          if (!account) {
            throw new Error("No account found for this user and provider.");
          }

          if (!account.accessToken) {
            throw new Error("No access token found for this account.");
          }

          // Check if token is expired or will expire soon (within 5 minutes)
          const now = new Date();
          const expiresAt = account.accessTokenExpiresAt ? new Date(account.accessTokenExpiresAt) : null;
          const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

          const needsRefresh = !expiresAt || expiresAt <= fiveMinutesFromNow;

          if (!needsRefresh) {
            return {
              accessToken: account.accessToken,
              refreshed: false,
            };
          }

          // Token is expired or will expire soon, refresh it
          if (!account.refreshToken) {
            throw new Error(
              "Access token is expired and no refresh token is available.",
            );
          }

          // Refresh the token using Cal.com's refresh endpoint
          // Note: Cal.com uses a non-standard OAuth2 implementation where the
          // refresh token is sent in the Authorization header (instead of the body)
          const response = await fetch(CAL_REFRESH_TOKEN_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${account.refreshToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              grant_type: "refresh_token",
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
            }),
            cache: "no-store",
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              `Failed to refresh Cal.com access token: ${response.status} - ${JSON.stringify(errorData)}`,
            );
          }

          const refreshData = await response.json();

          // Validate response
          if (!refreshData.access_token || !refreshData.refresh_token) {
            throw new Error(
              "Invalid response from Cal.com refresh endpoint. Missing required fields.",
            );
          }

          // Calculate new expiration time (default to 1 hour if not provided)
          const expiresInSeconds = refreshData.expires_in ?? 3600;
          const newExpiresAt = new Date(now.getTime() + expiresInSeconds * 1000);

          // Update the account with new tokens
          await ctx.context.adapter.update({
            model: "account",
            where: [{ field: "id", value: account.id }],
            update: {
              accessToken: refreshData.access_token,
              refreshToken: refreshData.refresh_token,
              accessTokenExpiresAt: newExpiresAt,
              updatedAt: now,
            },
          });

          return {
            accessToken: refreshData.access_token,
            refreshed: true,
          };
        },
      },
    },
  };
};

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
          accessType: "offline", // Request refresh token from Cal.com
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
    oauthTokenRefresh(),
    nextCookies(), // make sure this is the last plugin in the array
  ],
});
