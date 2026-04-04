"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarRange, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signIn } from "@/lib/auth/sign-in"

const REVIEW_NOTES = [
  "Cancellation drift is concentrated in onboarding and intro calls.",
  "Tuesday afternoon still carries the heaviest scheduling demand.",
  "Host load is widening instead of staying balanced week over week.",
] as const

const PULSE_METRICS = [
  { label: "Meetings reviewed", value: "1.4k", detail: "Synced and grouped automatically" },
  { label: "Time to first insight", value: "< 3 min", detail: "From login to operator signal" },
  { label: "Weekly review prep", value: "-61%", detail: "Less spreadsheet assembly" },
] as const

export function Hero() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { data: session, isPending, error } = authClient.useSession()

  const handleCalOAuth = async () => {
    try {
      setIsConnecting(true)

      const { error: signInError } = await signIn()

      if (signInError) {
        throw signInError
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
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Mist layers – like morning fog over West Lake */}
      <div className="pointer-events-none absolute inset-0">
        <div className="noise-overlay absolute inset-0 opacity-80" />
        <div className="grid-fade absolute inset-0 opacity-40" />
        <div className="absolute -left-[10%] top-20 h-64 w-64 rounded-full bg-accent/8 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -right-[8%] top-8 h-72 w-72 rounded-full bg-primary/6 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="shell-container relative py-10 sm:py-16 lg:py-24">
        {/* Mobile: stacked. Desktop: two columns */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="section-kicker">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Designed for the weekly ops room
            </div>

            <h1 className="display-title mt-5 text-4xl text-foreground sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Turn your
              <span className="mx-2 inline-flex h-10 w-24 rotate-[-1.5deg] items-center justify-center overflow-hidden rounded-xl border border-accent/20 bg-accent/5 p-0.5 align-middle shadow-lg backdrop-blur-sm sm:mx-3 sm:h-14 sm:w-32 sm:rounded-2xl md:mx-4 md:h-16 md:w-40 lg:h-20 lg:w-44 xl:h-24 xl:w-52 xl:rounded-[20px]">
                <Image
                  src="/platforms/cal-logo-light.jpeg"
                  alt="Cal.com logo"
                  width={144}
                  height={64}
                  className="h-full w-full rounded-lg object-cover sm:rounded-xl dark:hidden"
                  priority
                />
                <Image
                  src="/platforms/cal-logo-dark.jpeg"
                  alt="Cal.com logo"
                  width={144}
                  height={64}
                  className="hidden h-full w-full rounded-lg object-cover sm:rounded-xl dark:block"
                  priority
                />
              </span>
              booking stream into a control room.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground/90 sm:mt-8 sm:text-lg lg:text-xl">
              Callytics is an operator-grade analytics layer for Cal.com teams.
              Instead of dumping raw booking volume into generic charts, it
              highlights stability, pressure, and the shifts worth discussing.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
              {showConnectCta ? (
                <>
                  <Button
                    size="lg"
                    className="h-12 rounded-full px-6 text-sm font-semibold shadow-lg shadow-primary/15 sm:h-14 sm:px-8 sm:text-base"
                    disabled={isConnecting}
                    onClick={handleCalOAuth}
                  >
                    {isConnecting ? "Connecting..." : "Connect Cal.com"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 rounded-full border-border/50 bg-background/50 px-6 text-sm font-medium backdrop-blur-sm hover:bg-card sm:h-14 sm:px-8 sm:text-base"
                  >
                    <Link href="/demo">Explore the demo</Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild className="h-12 rounded-full px-6 text-sm font-semibold shadow-lg shadow-primary/15 sm:h-14 sm:px-8 sm:text-base">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-12">
              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/35 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                OAuth-secured
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/35 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 backdrop-blur-sm">
                <CalendarRange className="h-3.5 w-3.5 text-primary" />
                Zero-config
              </div>
            </div>

            {/* Pulse metrics – stacked on mobile, 3-col on sm+ */}
            <div className="mt-8 grid gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
              {PULSE_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 * index }}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/35 p-5 backdrop-blur-md transition-all hover:border-border/60 hover:bg-card/50 sm:rounded-3xl sm:p-6"
                >
                  <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-accent/5 blur-2xl transition-all group-hover:bg-accent/10" />
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-serif text-3xl tracking-tighter text-foreground sm:mt-4 sm:text-4xl">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70 sm:mt-3">
                    {metric.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column – executive preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="surface-primary rounded-2xl p-5 sm:rounded-[34px] sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Executive pulse
                  </p>
                  <h2 className="mt-2 max-w-sm text-xl font-semibold leading-tight sm:mt-3 sm:text-2xl lg:text-3xl">
                    One briefing surface for capacity, timing, and booking risk.
                  </h2>
                </div>
                <span className="self-start rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white/70">
                  Live preview
                </span>
              </div>

              <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
                {[
                  { label: "Accepted", value: "74%", change: "+8 pts" },
                  { label: "At risk", value: "06", change: "next 14 days" },
                  { label: "Peak slot", value: "2 PM", change: "Tue + Thu" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/8 bg-white/5 p-3 sm:rounded-2xl sm:p-4"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-white/50 sm:text-xs">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl">{item.value}</p>
                    <p className="mt-1 text-xs text-white/60 sm:text-sm">{item.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-white/8 bg-black/10 p-4 sm:mt-6 sm:rounded-2xl sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">This week&apos;s review notes</p>
                    <p className="mt-1 text-xs text-white/55 sm:text-sm">
                      Pull forward the points that need discussion.
                    </p>
                  </div>
                  <div className="self-start rounded-full bg-white/8 px-3 py-1 text-xs text-white/70">
                    Auto grouped
                  </div>
                </div>

                <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                  {REVIEW_NOTES.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-xs leading-relaxed text-white/75 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="panel rounded-2xl p-4 sm:rounded-[28px] sm:p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Why it feels different
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground sm:mt-3 sm:text-xl">
                  Editorial structure instead of dashboard clutter.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The interface is organized like a briefing: pulse first, controls second,
                  detail third.
                </p>
              </div>
              <div className="panel rounded-2xl p-4 sm:rounded-[28px] sm:p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  What ships today
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground sm:mt-3 sm:text-xl">
                  Filters, charts, meeting queues, and better narrative framing.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Enough detail for operators now, without burying them in optional chrome.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
