'use client';

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

type ErrorDetails = {
  isAuthError: boolean;
  isForbiddenError: boolean;
  userMessage: string;
  technicalMessage?: string;
};

const parseErrorDetails = (error: Error): ErrorDetails => {
  const errorName = error.name || "";
  const errorMessage = error.message || "";
  const errorMessageLower = errorMessage.toLowerCase();
  
  // Check if it's a CalBookingsApiError
  const isCalBookingsError =
    errorName === "CalBookingsApiError" ||
    errorMessageLower.includes("cal.com bookings request failed");
  
  // Check for OAuth/authentication errors
  const isOAuthError =
    errorMessageLower.includes("permissionsguard") ||
    errorMessageLower.includes("no oauth client found") ||
    errorMessageLower.includes("access token");
  
  // Check for 403 Forbidden
  const isForbiddenError =
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 403) ||
    errorMessageLower.includes("403") ||
    errorMessageLower.includes("forbidden");
  
  const isAuthError =
    isOAuthError ||
    errorMessageLower.includes("no accesstoken found") ||
    errorMessageLower.includes("no session found");
  
  // Generate user-friendly message
  let userMessage = "An unexpected error occurred while loading your dashboard.";
  let technicalMessage: string | undefined;
  
  if (isAuthError) {
    if (isOAuthError && isForbiddenError) {
      userMessage = "Your Cal.com authentication has expired or is invalid. Please sign in again to continue.";
      technicalMessage = "OAuth client not found for access token";
    } else if (errorMessage.includes("No accessToken found")) {
      userMessage = "Authentication required. Please sign in to access your dashboard.";
    } else if (errorMessage.includes("No session found")) {
      userMessage = "Your session has expired. Please sign in again.";
    } else {
      userMessage = "There was a problem with your authentication. Please sign in again.";
    }
  } else if (isCalBookingsError && isForbiddenError) {
    userMessage = "Unable to access your Cal.com bookings. Please verify your permissions and try again.";
    technicalMessage = "Cal.com API returned a 403 Forbidden error";
  } else if (isForbiddenError) {
    userMessage = "You don't have permission to access this resource. Please check your account settings.";
  } else if (errorMessageLower.includes("failed to fetch")) {
    userMessage = "Unable to load your data. Please check your connection and try again.";
  }
  
  return {
    isAuthError,
    isForbiddenError,
    userMessage,
    technicalMessage,
  };
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);
  
  const errorDetails = parseErrorDetails(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur">
        <div className="flex flex-col items-center gap-6 text-center">
          <span 
            className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10")}
            role="img"
            aria-label="Error"
          >
            <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </span>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {errorDetails.isAuthError 
                ? "Authentication Required" 
                : "Something went wrong"}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {errorDetails.userMessage}
            </p>
            {errorDetails.technicalMessage && (
              <p className="text-xs text-muted-foreground/70">
                {errorDetails.technicalMessage}
              </p>
            )}
            {error.digest && (
              <p className="text-xs text-muted-foreground/80">
                Error reference: {error.digest}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {errorDetails.isAuthError ? (
              <Button asChild className="gap-2">
                <Link href="/">
                  <RefreshCcw className="h-4 w-4" aria-hidden />
                  Sign in again
                </Link>
              </Button>
            ) : (
              <Button onClick={reset} variant="default" className="gap-2">
                <RefreshCcw className="h-4 w-4" aria-hidden />
                Try again
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/">Back to landing</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
