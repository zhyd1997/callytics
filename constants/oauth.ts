/**
 * Cal.com OAuth and API Configuration
 * Centralized constants for Cal.com integration
 */

// Provider identification
export const PROVIDER_ID = "calcom"

// Base URLs
export const CAL_API_ROOT_URL = "https://api.cal.com"
export const CAL_API_BASE_URL = "https://api.cal.com/v2"
export const CAL_APP_BASE_URL = "https://app.cal.com"

// API versioning
export const CAL_API_VERSION = "2024-08-13"

// OAuth endpoints
export const CAL_AUTHORIZATION_URL = `${CAL_APP_BASE_URL}/auth/oauth2/authorize`
export const CAL_TOKEN_URL = `${CAL_APP_BASE_URL}/api/auth/oauth/token`

// API endpoints
export const CAL_PROFILE_ENDPOINT = `${CAL_API_BASE_URL}/me`
export const CAL_BOOKINGS_ENDPOINT = "/v2/bookings"

// OAuth configuration
export const OAUTH_CALLBACK_PATH = "/api/cal/oauth/callback"
export const DEFAULT_OAUTH_SCOPES = ["READ_BOOKING"]
