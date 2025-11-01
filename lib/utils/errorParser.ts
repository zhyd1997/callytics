/**
 * Error parsing utilities for dashboard error handling
 */

export type ErrorDetails = {
  readonly isAuthError: boolean;
  readonly isForbiddenError: boolean;
  readonly userMessage: string;
  readonly technicalMessage?: string;
};

/**
 * Checks if error has a status property with value 403
 */
const isForbiddenStatus = (error: Error): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === 403
  );
};

/**
 * Checks if error indicates a Cal.com bookings API issue
 */
const isCalBookingsError = (errorName: string, errorMessage: string): boolean => {
  return (
    errorName === "CalBookingsApiError" ||
    errorMessage.includes("cal.com bookings request failed")
  );
};

/**
 * Checks if error indicates an OAuth authentication issue
 */
const isOAuthError = (errorMessage: string): boolean => {
  return (
    errorMessage.includes("permissionsguard") ||
    errorMessage.includes("no oauth client found") ||
    errorMessage.includes("access token")
  );
};

/**
 * Checks if error indicates a 403 Forbidden response
 */
const isForbiddenError = (error: Error, errorMessage: string): boolean => {
  return (
    isForbiddenStatus(error) ||
    errorMessage.includes("403") ||
    errorMessage.includes("forbidden")
  );
};

/**
 * Checks if error is authentication-related
 */
const isAuthError = (errorMessage: string): boolean => {
  return (
    isOAuthError(errorMessage) ||
    errorMessage.includes("no accesstoken found") ||
    errorMessage.includes("no session found")
  );
};

/**
 * Generates user-friendly error message and technical details
 */
const generateErrorMessages = (
  error: Error,
  errorMessage: string,
  isAuth: boolean,
  isOAuth: boolean,
  isForbidden: boolean,
  isCalBookings: boolean
): Pick<ErrorDetails, "userMessage" | "technicalMessage"> => {
  const defaultMessage = "An unexpected error occurred while loading your dashboard.";

  if (isAuth) {
    if (isOAuth && isForbidden) {
      return {
        userMessage:
          "Your Cal.com authentication has expired or is invalid. Please sign in again to continue.",
        technicalMessage: "OAuth client not found for access token",
      };
    }
    if (errorMessage.includes("no accesstoken found")) {
      return {
        userMessage: "Authentication required. Please sign in to access your dashboard.",
      };
    }
    if (errorMessage.includes("no session found")) {
      return {
        userMessage: "Your session has expired. Please sign in again.",
      };
    }
    return {
      userMessage: "There was a problem with your authentication. Please sign in again.",
    };
  }

  if (isCalBookings && isForbidden) {
    return {
      userMessage:
        "Unable to access your Cal.com bookings. Please verify your permissions and try again.",
      technicalMessage: "Cal.com API returned a 403 Forbidden error",
    };
  }

  if (isForbidden) {
    return {
      userMessage:
        "You don't have permission to access this resource. Please check your account settings.",
    };
  }

  if (errorMessage.includes("failed to fetch")) {
    return {
      userMessage: "Unable to load your data. Please check your connection and try again.",
    };
  }

  return { userMessage: defaultMessage };
};

/**
 * Parses error object and returns structured error details for UI display
 */
export const parseErrorDetails = (error: Error): ErrorDetails => {
  const errorName = error.name || "";
  const errorMessage = error.message || "";
  const errorMessageLower = errorMessage.toLowerCase();

  const isCalBookings = isCalBookingsError(errorName, errorMessageLower);
  const isOAuth = isOAuthError(errorMessageLower);
  const isForbidden = isForbiddenError(error, errorMessageLower);
  const isAuth = isAuthError(errorMessageLower);

  const { userMessage, technicalMessage } = generateErrorMessages(
    error,
    errorMessage,
    isAuth,
    isOAuth,
    isForbidden,
    isCalBookings
  );

  return {
    isAuthError: isAuth,
    isForbiddenError: isForbidden,
    userMessage,
    technicalMessage,
  };
};
