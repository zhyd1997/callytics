/**
 * Standardized API Response Utilities
 * Provides consistent response formatting across API routes
 */

import { NextResponse } from "next/server";
import { AppError, isAppError, serializeError } from "@/lib/errors";
import { createLogger } from "@/lib/logging/logger";

const logger = createLogger("api:response");

/**
 * Standard API success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
    [key: string]: unknown;
  };
}

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
  };
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: ApiSuccessResponse<T>["meta"],
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

/**
 * Creates an error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Converts an AppError to an error response
 */
export function createErrorResponseFromAppError(error: AppError): ApiErrorResponse {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
    },
  };
}

/**
 * Creates a NextResponse with success data
 */
export function successResponse<T>(
  data: T,
  options?: {
    status?: number;
    meta?: ApiSuccessResponse<T>["meta"];
    headers?: HeadersInit;
  },
): NextResponse<ApiSuccessResponse<T>> {
  const { status = 200, meta, headers } = options ?? {};
  
  return NextResponse.json(createSuccessResponse(data, meta), {
    status,
    headers,
  });
}

/**
 * Creates a NextResponse with error data
 */
export function errorResponse(
  error: unknown,
  options?: {
    status?: number;
    headers?: HeadersInit;
  },
): NextResponse<ApiErrorResponse> {
  const { status, headers } = options ?? {};

  // Handle AppError
  if (isAppError(error)) {
    logger.error(error.message, error, {
      code: error.code,
      statusCode: error.statusCode,
    });

    return NextResponse.json(createErrorResponseFromAppError(error), {
      status: status ?? error.statusCode,
      headers,
    });
  }

  // Handle standard Error
  if (error instanceof Error) {
    logger.error(error.message, error);
    
    return NextResponse.json(
      createErrorResponse(
        "INTERNAL_ERROR",
        error.message || "An unexpected error occurred",
        serializeError(error),
      ),
      {
        status: status ?? 500,
        headers,
      },
    );
  }

  // Handle unknown errors
  logger.error("Unknown error occurred", error);
  
  return NextResponse.json(
    createErrorResponse(
      "UNKNOWN_ERROR",
      "An unknown error occurred",
      serializeError(error),
    ),
    {
      status: status ?? 500,
      headers,
    },
  );
}

/**
 * Wraps an async API route handler with error handling
 */
export function withErrorHandling<T>(
  handler: () => Promise<NextResponse<ApiSuccessResponse<T>>>,
): Promise<NextResponse<ApiResponse<T>>> {
  return handler().catch((error) => errorResponse(error));
}

/**
 * Creates pagination metadata
 */
export function createPaginationMeta(
  page: number,
  pageSize: number,
  total: number,
): ApiSuccessResponse["meta"] {
  return {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
