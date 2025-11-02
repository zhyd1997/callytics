/**
 * Centralized error handling system
 * Provides custom error classes and error handling utilities
 */

export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly details?: unknown;
  protected _code: string;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this._code = code;
    this.isOperational = true;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace?.(this, this.constructor);
  }

  get code(): string {
    return this._code;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required", details?: unknown) {
    super(message, 401, "AUTHENTICATION_ERROR", details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions", details?: unknown) {
    super(message, 403, "AUTHORIZATION_ERROR", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class ExternalApiError extends AppError {
  readonly externalService: string;

  constructor(
    message: string,
    statusCode = 502,
    externalService: string,
    details?: unknown,
  ) {
    super(message, statusCode, "EXTERNAL_API_ERROR", details);
    this.externalService = externalService;
  }
}

export class CalBookingsApiError extends ExternalApiError {
  readonly status: number;

  constructor(message: string, status: number, details?: unknown) {
    super(
      message,
      status >= 500 ? 502 : status,
      "Cal.com API",
      details,
    );
    this.status = status;
  }

  override get code(): string {
    return "CAL_BOOKINGS_API_ERROR";
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isOperational" in error &&
    typeof (error as AppError).isOperational === "boolean"
  );
}

/**
 * Convert any error to AppError for consistent handling
 */
export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message || "An unexpected error occurred",
      500,
      "UNKNOWN_ERROR",
      { originalError: error.name },
    );
  }

  return new AppError(
    "An unexpected error occurred",
    500,
    "UNKNOWN_ERROR",
    { originalError: String(error) },
  );
}

/**
 * Get user-friendly error message
 * Avoids leaking sensitive technical details in production
 */
export function getUserFriendlyMessage(
  error: AppError,
  isDevelopment = false,
): string {
  // In development, show more details
  if (isDevelopment) {
    return error.message;
  }

  // In production, show generic messages for operational errors
  if (error.isOperational) {
    switch (error.code) {
      case "VALIDATION_ERROR":
        return "The provided data is invalid. Please check your input and try again.";
      case "AUTHENTICATION_ERROR":
        return "Authentication required. Please sign in to continue.";
      case "AUTHORIZATION_ERROR":
        return "You don't have permission to perform this action.";
      case "NOT_FOUND":
        return "The requested resource was not found.";
      case "CAL_BOOKINGS_API_ERROR":
        return "Unable to fetch bookings. Please try again later.";
      case "EXTERNAL_API_ERROR":
        return "An external service is temporarily unavailable. Please try again later.";
      default:
        return "An error occurred. Please try again later.";
    }
  }

  // For non-operational errors, always show generic message
  return "An unexpected error occurred. Please try again later.";
}
