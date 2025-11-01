"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signIn } from "@/lib/auth/sign-in"
import Link from "next/link"
import Image from "next/image"
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,91,255,0.18),transparent_55%)]" />
      <div className="absolute -top-32 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.22),transparent_65%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-[-20%] h-[480px] bg-[linear-gradient(120deg,rgba(99,91,255,0.35),rgba(0,212,255,0.2),rgba(135,206,250,0.15))] opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-[140%] -translate-x-1/2 -skew-y-6 rounded-full bg-[linear-gradient(90deg,rgba(99,91,255,0.45),rgba(56,189,248,0.35),rgba(16,185,129,0.25))] blur-2xl opacity-70 animate-[ribbon-flow_14s_ease-in-out_infinite]" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex items-center justify-center">
            <h2 className="relative font-serif text-6xl font-bold tracking-wider md:text-8xl">
              <span className="bg-gradient-to-r from-primary via-sky-400 to-primary bg-clip-text text-transparent [text-shadow:0_0_32px_rgba(99,91,255,0.45)]">
                Cal
              </span>
              <span className="text-foreground">lytics</span>
              <span className="absolute inset-x-1/2 bottom-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary via-sky-400 to-primary opacity-60" />
            </h2>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary shadow-[0_0_28px_rgba(99,91,255,0.4)] animate-[stripe-glow_6s_ease-in-out_infinite]">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary via-sky-400 to-cyan-300" />
            <span>Now featuring a Stripe-inspired interface</span>
          </div>

          <h1 className="mb-6 text-balance font-sans text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            Analytics for{" "}
            <span className="relative inline-flex h-10 w-24 rotate-[-2deg] shrink-0 items-center justify-center md:h-16 md:w-32">
              <Image
                src="/platforms/cal-logo-light.jpeg"
                alt="Cal.com"
                fill
                sizes="(min-width: 768px) 8rem, 6rem"
                className="object-cover dark:hidden"
                priority
              />
              <Image
                src="/platforms/cal-logo-dark.jpeg"
                alt="Cal.com"
                fill
                sizes="(min-width: 768px) 8rem, 6rem"
                className="hidden object-cover dark:block"
                priority
              />
            </span>
            {" "}simplified
          </h1>

          <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Purpose-built dashboards that translate your
            {" "}
            <span className="bg-gradient-to-r from-primary via-sky-400 to-primary bg-clip-text font-semibold text-transparent">
              Cal.com
            </span>
            {" "}
            activity into actionable trends. Track bookings, surface conversion insights, and empower revenue discussions with a modern, Stripe-like polish.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {showConnectCta ? (
              <>
                <Button
                  size="lg"
                  className="min-w-[200px] text-base font-semibold hover:cursor-pointer bg-gradient-to-r from-primary via-sky-400 to-cyan-300 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
                  disabled={isConnecting}
                  onClick={handleCalOAuth}
                >
                  {isConnecting ? "Connecting..." : "Connect with Cal.com"}
                </Button>
                <Button size="lg" variant="outline" className="min-w-[200px] text-base bg-transparent hover:border-primary/40 hover:text-primary" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] text-base border-primary/50 bg-primary/5 text-primary transition-transform hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/20 hover:text-foreground"
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
              <span>Secure Cal.com OAuth</span>
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
              <span>Instant data sync in minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
