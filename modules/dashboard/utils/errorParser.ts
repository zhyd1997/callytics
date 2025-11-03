/**
 * Error parsing utilities for dashboard error handling
 */

export type ErrorDetails = {
  readonly isAuthError: boolean;
  readonly isForbiddenError: boolean;
  readonly userMessage: string;
  readonly technicalMessage?: string;
  readonly statusCode?: number;
};

/**
 * Checks if error has a status or statusCode property with value 403
 */
const isForbiddenStatus = (error: Error): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const errorObj = error as { status?: number; statusCode?: number };
  return (
    errorObj.status === 403 ||
    errorObj.statusCode === 403
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

type ErrorClassification = {
  readonly isAuth: boolean;
  readonly isOAuth: boolean;
  readonly isForbidden: boolean;
  readonly isCalBookings: boolean;
};

/**
 * Generates user-friendly error message and technical details
 */
const generateErrorMessages = (
  error: Error,
  errorMessage: string,
  classification: ErrorClassification
): Pick<ErrorDetails, "userMessage" | "technicalMessage"> => {
  const defaultMessage = "An unexpected error occurred while loading your dashboard.";
  const { isAuth, isOAuth, isForbidden, isCalBookings } = classification;

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
 * Extracts status code from error object
 */
const extractStatusCode = (error: Error): number | undefined => {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as { status?: number; statusCode?: number };
    return errorObj.statusCode ?? errorObj.status;
  }
  return undefined;
};

/**
 * Parses error object and returns structured error details for UI display
 */
export const parseErrorDetails = (error: Error): ErrorDetails => {
  const errorName = error.name || "";
  const errorMessage = error.message || "";
  const errorMessageLower = errorMessage.toLowerCase();
  const statusCode = extractStatusCode(error);

  const classification: ErrorClassification = {
    isCalBookings: isCalBookingsError(errorName, errorMessageLower),
    isOAuth: isOAuthError(errorMessageLower),
    isForbidden: isForbiddenError(error, errorMessageLower),
    isAuth: isAuthError(errorMessageLower),
  };

  const { userMessage, technicalMessage } = generateErrorMessages(
    error,
    errorMessageLower,
    classification
  );

  return {
    isAuthError: classification.isAuth,
    isForbiddenError: classification.isForbidden,
    userMessage,
    technicalMessage,
    statusCode,
  };
};
