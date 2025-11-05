import { CAL_REFRESH_TOKEN_URL, PROVIDER_ID } from "@/constants/oauth";
import prisma from "@/lib/prisma";

/**
 * Response from Cal.com refresh token endpoint
 */
export type RefreshTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

/**
 * Error thrown when token refresh fails
 */
export class TokenRefreshError extends Error {
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "TokenRefreshError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Refreshes the Cal.com access token using the refresh token
 * 
 * @param userId - The user ID to refresh the token for
 * @returns The new access token and optionally a new refresh token
 * @throws TokenRefreshError if the refresh fails
 */
export async function refreshCalAccessToken(
  userId: string
): Promise<RefreshTokenResponse> {
  try {
    // Get the user's account with the refresh token
    const account = await prisma.account.findFirst({
      where: {
        userId,
        providerId: PROVIDER_ID,
      },
      select: {
        id: true,
        refreshToken: true,
        refreshTokenExpiresAt: true,
      },
    });

    if (!account) {
      throw new TokenRefreshError(
        "No Cal.com account found for user",
        404
      );
    }

    if (!account.refreshToken) {
      throw new TokenRefreshError(
        "No refresh token available for user",
        400
      );
    }

    // Check if refresh token is expired
    if (account.refreshTokenExpiresAt && account.refreshTokenExpiresAt < new Date()) {
      throw new TokenRefreshError(
        "Refresh token has expired",
        401
      );
    }

    // Get client credentials from environment
    const clientId = process.env.CAL_COM_CLIENT_ID;
    const clientSecret = process.env.CAL_COM_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new TokenRefreshError(
        "Cal.com OAuth credentials not configured",
        500
      );
    }

    // Call Cal.com refresh token endpoint
    const response = await fetch(CAL_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: account.refreshToken,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      throw new TokenRefreshError(
        "Failed to refresh access token",
        response.status,
        errorBody
      );
    }

    const data = (await response.json()) as RefreshTokenResponse;

    if (!data.access_token) {
      throw new TokenRefreshError(
        "Invalid refresh token response: missing access_token",
        500,
        data
      );
    }

    // Update the account with new tokens
    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : null;

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        accessToken: data.access_token,
        accessTokenExpiresAt: expiresAt,
        // Update refresh token if a new one is provided
        ...(data.refresh_token && { refreshToken: data.refresh_token }),
      },
    });

    return data;
  } catch (error) {
    if (error instanceof TokenRefreshError) {
      throw error;
    }
    throw new TokenRefreshError(
      `Unexpected error during token refresh: ${error instanceof Error ? error.message : String(error)}`,
      500,
      error
    );
  }
}

/**
 * Gets a valid access token for the user, refreshing if necessary
 * 
 * @param userId - The user ID to get the access token for
 * @returns The valid access token
 * @throws TokenRefreshError if unable to get a valid token
 */
export async function getValidAccessToken(
  userId: string
): Promise<string> {
  // Get the user's account
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: PROVIDER_ID,
    },
    select: {
      accessToken: true,
      accessTokenExpiresAt: true,
    },
  });

  if (!account) {
    throw new TokenRefreshError(
      "No Cal.com account found for user",
      404
    );
  }

  if (!account.accessToken) {
    throw new TokenRefreshError(
      "No access token available for user",
      400
    );
  }

  // Check if token is expired or will expire in the next 5 minutes
  const expiryBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
  const isExpired = account.accessTokenExpiresAt
    ? account.accessTokenExpiresAt.getTime() - Date.now() < expiryBuffer
    : false;

  if (isExpired) {
    // Token is expired or about to expire, refresh it
    const refreshResult = await refreshCalAccessToken(userId);
    return refreshResult.access_token;
  }

  return account.accessToken;
}
