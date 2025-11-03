/**
 * Common API type definitions
 * Provides standardized types for API responses, errors, and pagination
 */

/**
 * Generic API response wrapper
 */
export type ApiResponse<T> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ApiError };

/**
 * Standard API error structure
 */
export interface ApiError {
  readonly message: string;
  readonly code?: string;
  readonly statusCode?: number;
  readonly details?: unknown;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  readonly page: number;
  readonly perPage: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly pagination: PaginationMeta;
}

/**
 * Standard success response
 */
export interface SuccessResponse<T = unknown> {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  readonly success: false;
  readonly error: ApiError;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ErrorResponse {
  return response.success === false;
}

