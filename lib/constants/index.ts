/**
 * Application Constants
 * Centralized constants with organized enums and values
 */

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * API Versioning
 */
export enum ApiVersion {
  V1 = "v1",
  V2 = "v2",
}

/**
 * Cache Control Values (in seconds)
 */
export const CacheControl = {
  NO_CACHE: 0,
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 1 day
} as const;

/**
 * Pagination Defaults
 */
export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
} as const;

/**
 * Request Timeouts (in milliseconds)
 */
export const Timeouts = {
  SHORT: 5000, // 5 seconds
  MEDIUM: 15000, // 15 seconds
  LONG: 30000, // 30 seconds
  VERY_LONG: 60000, // 1 minute
} as const;

/**
 * Date Formats
 */
export const DateFormats = {
  ISO_8601: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  DATE_ONLY: "YYYY-MM-DD",
  TIME_ONLY: "HH:mm:ss",
  DISPLAY: "MMM D, YYYY",
  DISPLAY_WITH_TIME: "MMM D, YYYY h:mm A",
} as const;

/**
 * Regular Expressions
 */
export const Regex = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ISO_DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
} as const;
