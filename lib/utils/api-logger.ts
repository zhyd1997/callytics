/**
 * Structured logging utility for API calls with status codes
 * Optimized for Vercel monitoring and observability
 */

type LogLevel = "info" | "warn" | "error";

type ApiLogContext = {
  readonly method?: string;
  readonly url?: string;
  readonly statusCode?: number;
  readonly statusText?: string;
  readonly duration?: number;
  readonly error?: unknown;
  readonly requestId?: string;
  readonly userId?: string;
  readonly [key: string]: unknown;
};

/**
 * Creates a structured log entry for API operations
 * This format is optimized for Vercel's logging and monitoring systems
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context: ApiLogContext = {},
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };

  // Use appropriate console method based on level
  switch (level) {
    case "error":
      console.error(JSON.stringify(logEntry));
      break;
    case "warn":
      console.warn(JSON.stringify(logEntry));
      break;
    case "info":
    default:
      console.log(JSON.stringify(logEntry));
      break;
  }
}

/**
 * Logs API request initiation
 */
export function logApiRequest(
  message: string,
  context: Omit<ApiLogContext, "statusCode" | "statusText" | "duration" | "error"> = {},
): void {
  createLogEntry("info", message, context);
}

/**
 * Logs successful API response with status code
 * Critical for Vercel monitoring to track API health
 */
export function logApiSuccess(
  message: string,
  context: Required<Pick<ApiLogContext, "statusCode">> &
    Omit<ApiLogContext, "error"> = {} as never,
): void {
  createLogEntry("info", message, {
    ...context,
    statusText: getStatusText(context.statusCode),
  });
}

/**
 * Logs API error with status code
 * Essential for Vercel error tracking and alerting
 */
export function logApiError(
  message: string,
  context: Required<Pick<ApiLogContext, "statusCode">> &
    Omit<ApiLogContext, "statusText"> = {} as never,
): void {
  createLogEntry("error", message, {
    ...context,
    statusText: getStatusText(context.statusCode),
  });
}

/**
 * Logs API response (both success and error cases)
 * Always includes status code for monitoring
 */
export function logApiResponse(
  message: string,
  context: Required<Pick<ApiLogContext, "statusCode">> &
    Omit<ApiLogContext, "statusText"> = {} as never,
): void {
  const statusCode = context.statusCode;
  const isError = statusCode >= 400;

  if (isError) {
    logApiError(message, context);
  } else {
    logApiSuccess(message, context);
  }
}

/**
 * Helper to get HTTP status text for a given status code
 */
function getStatusText(statusCode: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  return statusTexts[statusCode] ?? "Unknown";
}

/**
 * Measures and logs API call duration
 */
export async function logApiCall<T>(
  message: string,
  operation: () => Promise<T>,
  context: Omit<ApiLogContext, "duration" | "statusCode" | "statusText"> = {},
): Promise<T> {
  const startTime = Date.now();
  logApiRequest(message, context);

  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    logApiSuccess(`${message} - completed`, {
      ...context,
      duration,
      statusCode: 200,
    });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const statusCode =
      error && typeof error === "object" && "status" in error
        ? (error.status as number)
        : 500;

    logApiError(`${message} - failed`, {
      ...context,
      duration,
      statusCode,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

