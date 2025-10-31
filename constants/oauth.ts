// OAuth provider configuration
export const PROVIDER_ID = "calcom"

// Cal.com API endpoints
export const CAL_API_BASE_URL = "https://api.cal.com/v2"
export const CAL_AUTHORIZATION_URL = "https://app.cal.com/auth/oauth2/authorize"
export const CAL_TOKEN_URL = "https://app.cal.com/api/auth/oauth/token"
export const CAL_PROFILE_ENDPOINT = `${CAL_API_BASE_URL}/me`

// OAuth callback and scopes
export const OAUTH_CALLBACK_PATH = "/api/cal/oauth/callback"
export const DEFAULT_OAUTH_SCOPES = ["READ_BOOKING"]
