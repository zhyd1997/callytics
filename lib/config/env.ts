/**
 * Centralized Environment Configuration
 * Type-safe environment variable validation and access
 */

import { z } from "zod";

// Environment variable schema with validation
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_APP_URL: z.string().url().optional(),
  
  // Database
  DATABASE_URL: z.string().min(1),
  
  // Cal.com OAuth
  CAL_COM_CLIENT_ID: z.string().min(1),
  CAL_COM_CLIENT_SECRET: z.string().min(1),
  CAL_OAUTH_TOKEN_ENDPOINT: z.string().url().optional(),
  CAL_OAUTH_REDIRECT_URI: z.string().url().optional(),
  
  // Cal.com API
  CAL_API_BASE_URL: z.string().url().optional(),
  CAL_API_VERSION: z.string().optional(),
  
  // Better Auth
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
});

type EnvSchema = z.infer<typeof envSchema>;

/**
 * Validates and parses environment variables
 * @throws {z.ZodError} If validation fails
 */
function validateEnv(): EnvSchema {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
        .join("\n");
      
      throw new Error(
        `Environment validation failed:\n${missingVars}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

// Validate and export environment configuration
export const env = validateEnv();

/**
 * Derives application URL from environment with fallback logic
 */
export function getAppUrl(): string {
  const appUrlFromEnv = env.NEXT_PUBLIC_APP_URL || env.NEXT_APP_URL;
  
  if (!appUrlFromEnv) {
    throw new Error(
      "`NEXT_PUBLIC_APP_URL` (or `NEXT_APP_URL`) must be configured to resolve the application origin."
    );
  }
  
  return appUrlFromEnv.endsWith("/")
    ? appUrlFromEnv.slice(0, -1)
    : appUrlFromEnv;
}

/**
 * Builds a full application URL from a pathname
 * @param pathname - The pathname to append (e.g., "/dashboard")
 * @returns Full URL string
 */
export function buildAppUrl(pathname = ""): string {
  const baseUrl = getAppUrl();
  
  if (!pathname) {
    return baseUrl;
  }
  
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Checks if the application is in production mode
 */
export function isProduction(): boolean {
  return env.NODE_ENV === "production";
}

/**
 * Checks if the application is in development mode
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === "development";
}

/**
 * Checks if the application is in test mode
 */
export function isTest(): boolean {
  return env.NODE_ENV === "test";
}
