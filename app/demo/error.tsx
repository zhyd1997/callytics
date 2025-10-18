"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function DemoError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard rendering failed", error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10")}>
            <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden />
          </span>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Something went wrong while loading your dashboard
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {error.message || "Please try again. If the issue continues, our team would love to hear from you."}
            </p>
            {error.digest ? (
              <p className="text-xs text-muted-foreground/80">Error reference: {error.digest}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <RefreshCcw className="h-4 w-4" aria-hidden />
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/public">Back to landing</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
