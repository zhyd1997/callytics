/**
 * Utility functions for creating structured API responses with status codes
 * for better Vercel monitoring and error tracking
 */

import { NextResponse } from "next/server";

export type ApiResponseMetadata = {
  readonly statusCode: number;
  readonly timestamp: string;
  readonly path?: string;
};

export type ApiErrorResponse = {
  readonly error: {
    readonly message: string;
    readonly code?: string;
    readonly details?: unknown;
    readonly statusCode: number;
  };
  readonly metadata: ApiResponseMetadata;
};

export type ApiSuccessResponse<T = unknown> = {
  readonly data: T;
  readonly metadata: ApiResponseMetadata;
};

/**
 * Creates a structured error response with status code for monitoring
 */
export function createApiErrorResponse(
  message: string,
  statusCode: number,
  options?: {
    readonly code?: string;
    readonly details?: unknown;
    readonly path?: string;
  },
): NextResponse<ApiErrorResponse> {
  const metadata: ApiResponseMetadata = {
    statusCode,
    timestamp: new Date().toISOString(),
    path: options?.path,
  };

  const errorResponse: ApiErrorResponse = {
    error: {
      message,
      code: options?.code,
      details: options?.details,
      statusCode,
    },
    metadata,
  };

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Creates a structured success response with status code for monitoring
 */
export function createApiSuccessResponse<T>(
  data: T,
  statusCode: number = 200,
  options?: {
    readonly path?: string;
  },
): NextResponse<ApiSuccessResponse<T>> {
  const metadata: ApiResponseMetadata = {
    statusCode,
    timestamp: new Date().toISOString(),
    path: options?.path,
  };

  const successResponse: ApiSuccessResponse<T> = {
    data,
    metadata,
  };

  return NextResponse.json(successResponse, { status: statusCode });
}

/**
 * Logs API response with status code for Vercel monitoring
 */
export function logApiResponse(
  path: string,
  statusCode: number,
  error?: Error,
): void {
  const logData = {
    path,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(error && {
      error: {
        name: error.name,
        message: error.message,
        ...(error instanceof Error && "status" in error && {
          status: (error as { status: number }).status,
        }),
      },
    }),
  };

  if (statusCode >= 400) {
    console.error("[API Error]", JSON.stringify(logData, null, 2));
  } else {
    console.log("[API Success]", JSON.stringify(logData, null, 2));
  }
}

