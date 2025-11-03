/**
 * Centralized error handling utilities
 * Provides consistent error handling patterns across server actions, API routes, and DAL
 */

/**
 * Base error interface with status code support
 */
export interface ErrorWithStatus extends Error {
  readonly status?: number;
  readonly statusCode?: number;
}

/**
 * Extracts HTTP status code from error objects
 * Checks both 'status' and 'statusCode' properties for compatibility
 */
export function extractStatusCode(error: unknown): number {
  if (error instanceof Error) {
    const errorWithStatus = error as ErrorWithStatus;
    return errorWithStatus.statusCode ?? errorWithStatus.status ?? 500;
  }
  return 500;
}

/**
 * Checks if error is an instance of Error with status
 */
export function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
  return error instanceof Error && 
    ('status' in error || 'statusCode' in error);
}

/**
 * Creates a structured error log object
 */
export function createErrorLog(
  context: string,
  error: unknown,
  additionalData?: Record<string, unknown>
): Record<string, unknown> {
  const statusCode = extractStatusCode(error);
  
  return {
    context,
    statusCode,
    error: {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
    },
    timestamp: new Date().toISOString(),
    ...additionalData,
  };
}

/**
 * Logs error with consistent format
 */
export function logError(
  context: string,
  error: unknown,
  additionalData?: Record<string, unknown>
): void {
  const logData = createErrorLog(context, error, additionalData);
  console.error(`[${context}]`, logData);
}

/**
 * Logs success with consistent format
 */
export function logSuccess(
  context: string,
  data?: Record<string, unknown>
): void {
  console.log(`[${context}]`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Type guard for checking if a value is a Record
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Safely extracts error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
