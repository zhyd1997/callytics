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
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/80 via-background to-background pb-24 md:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="holiday-lights absolute inset-0" />
        <div className="holiday-snowfall absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(circle_at_25%_10%,_rgba(220,38,38,0.12),_transparent_45%),_radial-gradient(circle_at_75%_20%,_rgba(16,185,129,0.14),_transparent_50%),_radial-gradient(circle_at_50%_45%,_rgba(234,179,8,0.18),_transparent_50%)] dark:bg-[radial-gradient(circle_at_25%_10%,_rgba(248,113,113,0.16),_transparent_50%),_radial-gradient(circle_at_75%_20%,_rgba(52,211,153,0.16),_transparent_55%),_radial-gradient(circle_at_50%_45%,_rgba(250,204,21,0.2),_transparent_55%)]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_120deg,_rgba(220,38,38,0.28),_transparent_55%)] blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 pt-24 md:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[3fr_2fr]">
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-sm lg:mx-0">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Holiday release • limited run
            </div>
            <h1 className="text-balance font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Holiday-ready clarity for every{" "}
              <span className="relative inline-flex h-10 w-24 rotate-[-1deg] shrink-0 items-center justify-center md:h-16 md:w-32">
                <Image
                  src="/platforms/cal-logo-light.jpeg"
                  alt="Cal.com logo"
                  fill
                  sizes="(min-width: 768px) 8rem, 6rem"
                  className="object-cover dark:hidden"
                  priority
                />
                <Image
                  src="/platforms/cal-logo-dark.jpeg"
                  alt="Cal.com logo"
                  fill
                  sizes="(min-width: 768px) 8rem, 6rem"
                  className="hidden object-cover dark:block"
                  priority
                />
              </span>{" "}
              booking
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Celebrate the busiest season with a Cal.com dashboard wrapped in evergreen gradients and warm berry accents. Keep tabs on pipeline health, showcase revenue signals, and end the quarter with a little sparkle.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
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
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[200px] text-base border-border/70 bg-transparent text-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                    asChild
                  >
                    <Link href="/demo">View Demo</Link>
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] text-base border-primary/50 bg-primary/5 text-primary transition-transform hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/15 hover:text-foreground"
                  asChild
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>

            <ul className="mt-10 flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:items-start sm:text-left">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  ★
                </span>
                OAuth-secured Cal.com access
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  ★
                </span>
                Ready for revenue and ops reviews
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  ★
                </span>
                Exportable KPIs on demand
              </li>
            </ul>
          </div>

          <div className="mx-auto w-full max-w-md rounded-3xl border border-border/70 bg-card/80 p-8 text-left shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Holiday snapshot</p>
            <dl className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">7 day bookings</dt>
                <dd className="mt-2 text-3xl font-semibold text-foreground">284</dd>
                <dd className="text-xs font-medium text-accent">+18.4% vs last week</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Avg. conversion</dt>
                <dd className="mt-2 text-3xl font-semibold text-foreground">42%</dd>
                <dd className="text-xs font-medium text-muted-foreground">Across 6 event types</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Host coverage</dt>
                <dd className="mt-3 flex items-baseline gap-3 text-2xl font-semibold text-foreground">
                  11 hosts active
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-foreground">98% SLA</span>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Booking velocity</dt>
                <dd className="mt-3 flex items-end gap-3">
                  <div className="flex flex-1 items-end gap-1">
                    <span className="h-6 w-2 rounded-full bg-accent/60" />
                    <span className="h-8 w-2 rounded-full bg-accent/70" />
                    <span className="h-10 w-2 rounded-full bg-accent" />
                    <span className="h-7 w-2 rounded-full bg-accent/70" />
                    <span className="h-9 w-2 rounded-full bg-accent/80" />
                    <span className="h-11 w-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Weekly trend</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
