/**
 * Standardized Error Classes and Error Handling
 * Provides consistent error types across the application
 */

/**
 * Base application error class
 * All custom errors should extend this class
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly isOperational: boolean;
  readonly timestamp: string;
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.details && { details: this.details }),
    };
  }
}

/**
 * Authentication Error - 401
 */
export class AuthenticationError extends AppError {
  readonly code = "AUTHENTICATION_ERROR";
  readonly statusCode = 401;

  constructor(message = "Authentication required", details?: unknown) {
    super(message, details);
  }
}

/**
 * Authorization Error - 403
 */
export class AuthorizationError extends AppError {
  readonly code = "AUTHORIZATION_ERROR";
  readonly statusCode = 403;

  constructor(message = "Access denied", details?: unknown) {
    super(message, details);
  }
}

/**
 * Validation Error - 400
 */
export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;

  constructor(message = "Validation failed", details?: unknown) {
    super(message, details);
  }
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;

  constructor(message = "Resource not found", details?: unknown) {
    super(message, details);
  }
}

/**
 * External API Error - 502/503
 */
export class ExternalAPIError extends AppError {
  readonly code = "EXTERNAL_API_ERROR";
  readonly statusCode: number;

  constructor(
    message = "External API request failed",
    statusCode = 502,
    details?: unknown,
  ) {
    super(message, details);
    this.statusCode = statusCode;
  }
}

/**
 * Configuration Error - 500
 */
export class ConfigurationError extends AppError {
  readonly code = "CONFIGURATION_ERROR";
  readonly statusCode = 500;

  constructor(message = "Configuration error", details?: unknown) {
    super(message, details);
  }
}

/**
 * Database Error - 500
 */
export class DatabaseError extends AppError {
  readonly code = "DATABASE_ERROR";
  readonly statusCode = 500;

  constructor(message = "Database operation failed", details?: unknown) {
    super(message, details);
  }
}

/**
 * Generic Internal Error - 500
 */
export class InternalError extends AppError {
  readonly code = "INTERNAL_ERROR";
  readonly statusCode = 500;

  constructor(message = "Internal server error", details?: unknown) {
    super(message, details);
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Error factory for creating appropriate error types
 */
export class ErrorFactory {
  static authentication(message?: string, details?: unknown): AuthenticationError {
    return new AuthenticationError(message, details);
  }

  static authorization(message?: string, details?: unknown): AuthorizationError {
    return new AuthorizationError(message, details);
  }

  static validation(message?: string, details?: unknown): ValidationError {
    return new ValidationError(message, details);
  }

  static notFound(message?: string, details?: unknown): NotFoundError {
    return new NotFoundError(message, details);
  }

  static externalAPI(
    message?: string,
    statusCode?: number,
    details?: unknown,
  ): ExternalAPIError {
    return new ExternalAPIError(message, statusCode, details);
  }

  static configuration(message?: string, details?: unknown): ConfigurationError {
    return new ConfigurationError(message, details);
  }

  static database(message?: string, details?: unknown): DatabaseError {
    return new DatabaseError(message, details);
  }

  static internal(message?: string, details?: unknown): InternalError {
    return new InternalError(message, details);
  }

  /**
   * Converts unknown error to AppError
   */
  static fromUnknown(error: unknown): AppError {
    if (isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return new InternalError(error.message, {
        originalError: error.name,
        stack: error.stack,
      });
    }

    return new InternalError("An unknown error occurred", { error });
  }
}

/**
 * Safe error serialization for logging and responses
 */
export function serializeError(error: unknown): Record<string, unknown> {
  if (isAppError(error)) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: "An unknown error occurred",
    error: String(error),
  };
}
