import { CAL_REFRESH_TOKEN_URL } from "@/constants/oauth";
import prisma from "@/lib/prisma";

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
};

export type RefreshTokenOptions = {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  refreshTokenUrl?: string;
};

export class TokenRefreshError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "TokenRefreshError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Refresh Cal.com access token using the refresh token
 * @see https://cal.com/docs/api-reference/v2/oauth-clients/
 */
export async function refreshCalAccessToken(
  options: RefreshTokenOptions,
): Promise<RefreshTokenResponse> {
  const { refreshToken, clientId, clientSecret, refreshTokenUrl } = options;

  if (!refreshToken || typeof refreshToken !== "string") {
    throw new Error("A valid refresh token is required.");
  }

  if (!clientId || typeof clientId !== "string") {
    throw new Error("A valid client ID is required.");
  }

  if (!clientSecret || typeof clientSecret !== "string") {
    throw new Error("A valid client secret is required.");
  }

  const url = refreshTokenUrl ?? CAL_REFRESH_TOKEN_URL;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken.trim()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({
      error: "Failed to parse response body as JSON.",
    }));

    if (!response.ok) {
      throw new TokenRefreshError(
        "Cal.com token refresh request failed.",
        response.status,
        payload,
      );
    }

    return payload as RefreshTokenResponse;
  } catch (error) {
    console.error("Failed to refresh Cal.com access token", error);
    throw error;
  }
}

/**
 * Get a valid access token for a user and provider, automatically refreshing if needed
 */
export async function getValidAccessToken(
  userId: string,
  providerId: string,
): Promise<{ accessToken: string; refreshed: boolean }> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId,
    },
  });

  if (!account) {
    throw new Error("No account found for this user and provider.");
  }

  if (!account.accessToken) {
    throw new Error("No access token found for this account.");
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  const now = new Date();
  const expiresAt = account.accessTokenExpiresAt;
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  const needsRefresh = !expiresAt || expiresAt <= fiveMinutesFromNow;

  if (!needsRefresh) {
    return { accessToken: account.accessToken, refreshed: false };
  }

  // Token is expired or will expire soon, refresh it
  if (!account.refreshToken) {
    throw new Error(
      "Access token is expired and no refresh token is available.",
    );
  }

  const clientId = process.env.CAL_COM_CLIENT_ID;
  const clientSecret = process.env.CAL_COM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "CAL_COM_CLIENT_ID and CAL_COM_CLIENT_SECRET must be configured.",
    );
  }

  const refreshed = await refreshCalAccessToken({
    refreshToken: account.refreshToken,
    clientId,
    clientSecret,
  });

  // Calculate new expiration time (default to 1 hour if not provided)
  const expiresInSeconds = refreshed.expires_in ?? 3600;
  const newExpiresAt = new Date(now.getTime() + expiresInSeconds * 1000);

  // Update the account with new tokens
  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token,
      accessTokenExpiresAt: newExpiresAt,
      updatedAt: now,
    },
  });

  return { accessToken: refreshed.access_token, refreshed: true };
}
