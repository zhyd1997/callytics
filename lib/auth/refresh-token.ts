import { CAL_REFRESH_TOKEN_URL, PROVIDER_ID } from "@/constants/oauth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * Buffer time before token expiry to trigger refresh (5 minutes in milliseconds)
 */
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

/**
 * Zod schema for validating Cal.com refresh token response
 */
const refreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
  token_type: z.string().optional(),
});

/**
 * Response from Cal.com refresh token endpoint
 */
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

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
 * Calls Cal.com's refresh token endpoint and updates the database with new tokens.
 * This is typically called automatically by `getValidAccessToken()`, but can be
 * called directly if you need to force a token refresh.
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await refreshCalAccessToken(userId);
 *   console.log('New access token:', result.access_token);
 * } catch (error) {
 *   if (error instanceof TokenRefreshError) {
 *     // Handle refresh error (e.g., prompt user to re-authenticate)
 *     console.error('Token refresh failed:', error.message, error.status);
 *   }
 * }
 * ```
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
      const errorBody = await response
        .text()
        .catch(() => `Failed to read error response body (status: ${response.status})`);
      throw new TokenRefreshError(
        "Failed to refresh access token",
        response.status,
        errorBody
      );
    }

    // Parse and validate the response
    const rawData = await response.json();
    const parseResult = refreshTokenResponseSchema.safeParse(rawData);
    
    if (!parseResult.success) {
      throw new TokenRefreshError(
        "Invalid refresh token response format",
        500,
        parseResult.error.format()
      );
    }

    const data = parseResult.data;

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
 * This function automatically handles token expiration by:
 * 1. Checking if the current token is expired or will expire within 5 minutes
 * 2. Refreshing the token if needed using the refresh token
 * 3. Updating the database with new tokens
 * 4. Returning a valid access token
 * 
 * @example
 * ```typescript
 * // In a server action
 * const accessToken = await getValidAccessToken(userId);
 * const response = await fetch('https://api.cal.com/v2/bookings', {
 *   headers: { Authorization: `Bearer ${accessToken}` }
 * });
 * ```
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

  // Check if token is expired or will expire soon
  // If no expiration date is set, we cannot determine if it's expired,
  // so we return the token as-is and let the API call fail if needed
  const isExpired = account.accessTokenExpiresAt
    ? account.accessTokenExpiresAt.getTime() - Date.now() < TOKEN_EXPIRY_BUFFER_MS
    : false;

  if (isExpired) {
    // Token is expired or about to expire, refresh it
    const refreshResult = await refreshCalAccessToken(userId);
    return refreshResult.access_token;
  }

  return account.accessToken;
}
