/**
 * Authentication Middleware
 * Provides reusable authentication checks for API routes and server actions
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PROVIDER_ID } from "@/constants/oauth";
import { AuthenticationError, AuthorizationError, ErrorFactory } from "@/lib/errors";
import { createLogger } from "@/lib/logging/logger";
import type { Result } from "@/lib/utils/result";
import { ok, err } from "@/lib/utils/result";

const logger = createLogger("middleware:auth");

/**
 * Session data returned from authentication middleware
 */
export interface AuthenticatedSession {
  userId: string;
  sessionId: string;
  accessToken: string;
}

/**
 * Extracts and validates Bearer token from Authorization header
 */
export function extractBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  
  if (!header) {
    return null;
  }

  const trimmed = header.trim();
  if (!trimmed.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = trimmed.slice(7).trim();
  return token.length ? token : null;
}

/**
 * Validates user session and returns authenticated session data
 * For use in server actions
 */
export async function requireAuth(
  userId: string,
): Promise<Result<AuthenticatedSession, AuthenticationError | AuthorizationError>> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session) {
      logger.warn("No session found during auth check");
      return err(ErrorFactory.authentication("No session found"));
    }

    if (session.session.userId !== userId) {
      logger.warn("User ID mismatch in session", {
        requestedUserId: userId,
        sessionUserId: session.session.userId,
      });
      return err(ErrorFactory.authorization("User ID mismatch"));
    }

    const tokenResult = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { providerId: PROVIDER_ID, userId },
    });

    if (!tokenResult.accessToken) {
      logger.warn("No access token found for user", { userId });
      return err(ErrorFactory.authentication("No access token found"));
    }

    return ok({
      userId: session.session.userId,
      sessionId: session.session.id,
      accessToken: tokenResult.accessToken,
    });
  } catch (error) {
    logger.error("Error during authentication", error, { userId });
    return err(ErrorFactory.authentication("Authentication failed", error));
  }
}

/**
 * Validates user session and returns authenticated session data
 * For use in API routes with Bearer token
 */
export async function requireAuthWithToken(
  request: NextRequest,
): Promise<Result<{ accessToken: string }, AuthenticationError>> {
  const accessToken = extractBearerToken(request);
  
  if (!accessToken) {
    logger.warn("Missing or invalid Authorization header");
    return err(
      ErrorFactory.authentication(
        "Missing or invalid Authorization header. Expected `Bearer <token>`.",
      ),
    );
  }

  return ok({ accessToken });
}

/**
 * Validates that a user can access a specific resource
 */
export async function requireResourceAccess(
  userId: string,
  resourceOwnerId: string,
): Promise<Result<void, AuthorizationError>> {
  if (userId !== resourceOwnerId) {
    logger.warn("Unauthorized resource access attempt", {
      userId,
      resourceOwnerId,
    });
    return err(ErrorFactory.authorization("Access denied to this resource"));
  }

  return ok(undefined);
}
