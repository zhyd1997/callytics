'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home, WifiOff, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseErrorDetails } from "@/modules/dashboard/utils/errorParser";
import { logger } from "@/lib/logger";
import { isAppError } from "@/lib/errors";
import { envConfig } from "@/lib/env";

type DashboardErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

type ErrorCategory = 'auth' | 'network' | 'server' | 'unknown';

function getErrorCategory(error: Error): ErrorCategory {
  if (isAppError(error)) {
    if (error.code === 'AUTHENTICATION_ERROR' || error.code === 'AUTHORIZATION_ERROR') {
      return 'auth';
    }
    if (error.code === 'EXTERNAL_API_ERROR' || error.code === 'CAL_BOOKINGS_API_ERROR') {
      return 'network';
    }
    return 'server';
  }
  
  const message = error.message.toLowerCase();
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return 'network';
  }
  if (message.includes('auth') || message.includes('session') || message.includes('token')) {
    return 'auth';
  }
  return 'unknown';
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    logger.error("Dashboard route error", error, {
      digest: error.digest,
      retryCount,
    });
    
    // TODO: Integrate with error tracking service (e.g., Sentry)
    // if (envConfig.isProduction) {
    //   Sentry.captureException(error, {
    //     tags: { component: 'dashboard-error-boundary' },
    //     extra: { digest: error.digest, retryCount },
    //   });
    // }
  }, [error, retryCount]);
  
  const errorDetails = parseErrorDetails(error);
  const errorCategory = getErrorCategory(error);
  const maxRetries = 3;
  
  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      logger.warn("Max retry attempts reached", { retryCount });
      return;
    }
    
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
    
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    try {
      reset();
    } catch (retryError) {
      logger.error("Error during retry", retryError);
    } finally {
      setIsRetrying(false);
    }
  };
  
  const getErrorIcon = () => {
    switch (errorCategory) {
      case 'auth':
        return <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden="true" />;
      case 'network':
        return <WifiOff className="h-8 w-8 text-destructive" aria-hidden="true" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />;
    }
  };
  
  const getErrorTitle = () => {
    if (errorDetails.isAuthError) {
      return "Authentication Required";
    }
    
    switch (errorCategory) {
      case 'network':
        return "Connection Error";
      case 'server':
        return "Server Error";
      default:
        return "Something went wrong";
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur">
        <div className="flex flex-col items-center gap-6 text-center">
          <span 
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
              errorCategory === 'auth' && "bg-orange-500/10",
              errorCategory === 'network' && "bg-blue-500/10",
              !['auth', 'network'].includes(errorCategory) && "bg-destructive/10"
            )}
            role="img"
            aria-label="Error"
          >
            {getErrorIcon()}
          </span>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {getErrorTitle()}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {errorDetails.userMessage}
            </p>
            
            {errorDetails.technicalMessage && envConfig.isDevelopment && (
              <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3 text-left">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Technical Details:</p>
                <p className="text-xs text-muted-foreground/80 font-mono">
                  {errorDetails.technicalMessage}
                </p>
              </div>
            )}
            
            {envConfig.isDevelopment && error.stack && (
              <details className="mt-4 rounded-lg border border-border bg-muted/50 p-3 text-left">
                <summary className="text-xs font-semibold text-muted-foreground cursor-pointer">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-muted-foreground/70 font-mono overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
            
            {error.digest && (
              <p className="text-xs text-muted-foreground/80 font-mono">
                Error ID: {error.digest}
              </p>
            )}
            
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground/70">
                Retry attempt: {retryCount} / {maxRetries}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
            {errorDetails.isAuthError ? (
              <Button asChild className="gap-2" disabled={isRetrying}>
                <Link href="/">
                  <ShieldAlert className="h-4 w-4" aria-hidden />
                  Sign in again
                </Link>
              </Button>
            ) : (
              <Button 
                onClick={handleRetry} 
                variant="default" 
                className="gap-2"
                disabled={isRetrying || retryCount >= maxRetries}
              >
                {isRetrying ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" aria-hidden />
                    {retryCount >= maxRetries ? "Max retries reached" : "Try again"}
                  </>
                )}
              </Button>
            )}
            
            <Button asChild variant="outline" disabled={isRetrying}>
              <Link href="/">
                <Home className="h-4 w-4" aria-hidden />
                Back to landing
              </Link>
            </Button>
          </div>
          
          {retryCount >= maxRetries && (
            <p className="text-xs text-muted-foreground/70 mt-2">
              If the problem persists, please contact support with error ID: {error.digest || 'N/A'}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
