"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signIn } from "@/lib/auth/sign-in"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export function Hero() {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  const { data: session, isPending, error } = authClient.useSession()

  const handleCalOAuth = async () => {
    try {
      setIsConnecting(true)

      const { error } = await signIn()

      if (error) {
        throw error
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong!")
    } finally {
      setIsConnecting(false)
    }
  }

  const showConnectCta = !session || isPending || !!error

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex items-center justify-center">
            <h2 className="relative font-serif text-6xl font-bold tracking-wider md:text-8xl">
              <span className="bg-gradient-to-r from-primary via-orange-600 to-primary bg-clip-text text-transparent [text-shadow:0_0_30px_rgba(249,115,22,0.5)]">
                Cal
              </span>
              <span className="text-foreground">lytics</span>
              <span className="absolute -right-8 -top-4 text-4xl md:-right-12 md:-top-6 md:text-6xl animate-[candle-flicker_3s_ease-in-out_infinite]">
                🎃
              </span>
              <span className="absolute -left-6 top-0 text-2xl md:-left-10 md:text-4xl animate-bounce [animation-duration:2s]">
                🦇
              </span>
            </h2>
          </div>

          <div className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-[gradient-flow_4s_ease_infinite]">
            <span className="flex items-center gap-2">
              <span className="text-base animate-[float_3s_ease-in-out_infinite]">👻</span>
              Now Live on Halloween
            </span>
          </div>

          <h1 className="mb-6 text-balance font-sans text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            Analytics for Cal.com Users
          </h1>

          <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Launching this Halloween with powerful insights for your Cal.com bookings. Track meetings, analyze
            conversion rates, and optimize your scheduling workflow with spooky precision.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {showConnectCta ? (
              <>
                <Button
                  size="lg"
                  className="min-w-[200px] text-base font-semibold"
                  disabled={isConnecting}
                  onClick={handleCalOAuth}
                >
                  {isConnecting ? "Connecting..." : "Connect with Cal.com"}
                </Button>
                <Button size="lg" variant="outline" className="min-w-[200px] text-base bg-transparent" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] text-base border-primary/50 bg-primary/5 text-primary transition-transform hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/25 hover:text-foreground"
                asChild
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Launching Oct 31st</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
