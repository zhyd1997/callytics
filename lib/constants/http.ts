/**
 * HTTP status codes and related constants
 * Centralized HTTP status code definitions for consistency
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

/**
 * HTTP header names
 */
export const HTTP_HEADERS = {
  AUTHORIZATION: "authorization",
  CONTENT_TYPE: "content-type",
  ACCEPT: "accept",
  CACHE_CONTROL: "cache-control",
  CAL_API_VERSION: "cal-api-version",
} as const;

/**
 * HTTP content types
 */
export const CONTENT_TYPES = {
  JSON: "application/json",
  TEXT: "text/plain",
  HTML: "text/html",
} as const;
