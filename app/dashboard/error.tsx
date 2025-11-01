'use client';

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseErrorDetails } from "@/lib/utils/errorParser";

type DashboardErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
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
