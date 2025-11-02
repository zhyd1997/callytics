import { z } from "zod";

/**
 * Environment variable schema for type-safe access
 * Validates all environment variables at startup
 */
const envSchema = z.object({
  // Application URL
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_APP_URL: z.string().url().optional(),

  // Cal.com OAuth credentials
  CAL_COM_CLIENT_ID: z.string().min(1),
  CAL_COM_CLIENT_SECRET: z.string().min(1),

  // Cal.com API configuration (optional with defaults)
  CAL_API_BASE_URL: z.string().url().optional(),
  CAL_API_VERSION: z.string().min(1).optional(),

  // Cal.com OAuth endpoints (optional with defaults)
  CAL_OAUTH_TOKEN_ENDPOINT: z.string().url().optional(),
  CAL_OAUTH_REDIRECT_URI: z.string().url().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type EnvOutput = z.output<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws descriptive error if validation fails
 */
function parseEnv(): EnvOutput {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.errors.map((err) => {
      const path = err.path.join(".");
      return `  - ${path}: ${err.message}`;
    });

    throw new Error(
      `Invalid environment variables:\n${errors.join("\n")}\n\nPlease check your .env file and ensure all required variables are set.`,
    );
  }

  return parsed.data;
}

const env = parseEnv();

/**
 * Get application URL from environment
 * Falls back to NEXT_APP_URL if NEXT_PUBLIC_APP_URL is not set
 */
const appUrlFromEnv = env.NEXT_PUBLIC_APP_URL ?? env.NEXT_APP_URL;

if (!appUrlFromEnv) {
  throw new Error(
    "`NEXT_PUBLIC_APP_URL` (or `NEXT_APP_URL`) must be configured to resolve the application origin.",
  );
}

const normalizedAppUrl = appUrlFromEnv.endsWith("/")
  ? appUrlFromEnv.slice(0, -1)
  : appUrlFromEnv;

/**
 * Get the base application URL
 */
export const getAppUrl = (): string => normalizedAppUrl;

/**
 * Build a full URL from a pathname
 */
export const buildAppUrl = (pathname = ""): string => {
  if (!pathname) {
    return normalizedAppUrl;
  }

  return `${normalizedAppUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
};

/**
 * Type-safe environment variable access
 * Use this instead of direct process.env access
 */
export const envConfig = {
  appUrl: normalizedAppUrl,
  calCom: {
    clientId: env.CAL_COM_CLIENT_ID,
    clientSecret: env.CAL_COM_CLIENT_SECRET,
    tokenEndpoint: env.CAL_OAUTH_TOKEN_ENDPOINT,
    redirectUri: env.CAL_OAUTH_REDIRECT_URI,
    apiBaseUrl: env.CAL_API_BASE_URL,
    apiVersion: env.CAL_API_VERSION,
  },
  nodeEnv: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
} as const;
