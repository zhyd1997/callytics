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
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0">
        <div className="noise-overlay absolute inset-0 opacity-90" />
        <div className="grid-fade absolute inset-0 opacity-55" />
        <div className="absolute left-[-12%] top-16 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-8%] top-10 h-80 w-80 rounded-full bg-accent/18 blur-3xl" />
      </div>

      <div className="shell-container relative py-14 sm:py-18 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" />
              Designed for the weekly ops room
            </div>

            <h1 className="display-title mt-6 text-6xl text-foreground sm:text-7xl lg:text-8xl">
              Turn your
              <span className="mx-4 inline-flex h-14 w-32 rotate-[-2deg] items-center justify-center overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-1 align-middle shadow-2xl backdrop-blur-sm sm:h-20 sm:w-44 lg:h-24 lg:w-52">
                <Image
                  src="/platforms/cal-logo-light.jpeg"
                  alt="Cal.com logo"
                  width={144}
                  height={64}
                  className="h-full w-full rounded-[14px] object-cover dark:hidden"
                  priority
                />
                <Image
                  src="/platforms/cal-logo-dark.jpeg"
                  alt="Cal.com logo"
                  width={144}
                  height={64}
                  className="hidden h-full w-full rounded-[14px] object-cover dark:block"
                  priority
                />
              </span>
              booking stream into a control room.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground/90 sm:text-xl">
              Callytics is an operator-grade analytics layer for Cal.com teams.
              Instead of dumping raw booking volume into generic charts, it
              highlights stability, pressure, and the shifts worth discussing.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              {showConnectCta ? (
                <>
                  <Button
                    size="lg"
                    className="h-14 rounded-full px-8 text-base font-semibold shadow-xl shadow-primary/20"
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
                    className="h-14 rounded-full border-border/60 bg-background/50 px-8 text-base font-medium backdrop-blur-sm hover:bg-card"
                  >
                    <Link href="/demo">Explore the demo</Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild className="h-14 rounded-full px-8 text-base font-semibold shadow-xl shadow-primary/20">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/40 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                OAuth-secured
              </div>
              <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/40 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 backdrop-blur-sm">
                <CalendarRange className="h-3.5 w-3.5 text-primary" />
                Zero-config
              </div>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {PULSE_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group relative overflow-hidden rounded-[32px] border border-border/50 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-border/80 hover:bg-card/60"
                >
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-muted-foreground/70">
                    {metric.label}
                  </p>
                  <p className="mt-4 font-serif text-4xl tracking-tighter text-foreground">
                    {metric.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80">
                    {metric.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="space-y-4"
          >
            <div className="surface-primary rounded-[34px] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/65">
                    Executive pulse
                  </p>
                  <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
                    One briefing surface for capacity, timing, and booking risk.
                  </h2>
                </div>
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/80">
                  Live preview
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Accepted", value: "74%", change: "+8 pts" },
                  { label: "At risk", value: "06", change: "next 14 days" },
                  { label: "Peak slot", value: "2 PM", change: "Tue + Thu" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[26px] border border-white/12 bg-white/7 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      {item.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-sm text-white/70">{item.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[30px] border border-white/12 bg-black/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">This week&apos;s review notes</p>
                    <p className="mt-1 text-sm text-white/68">
                      Pull forward the points that need discussion, not just observation.
                    </p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    Auto grouped
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {REVIEW_NOTES.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/82"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel rounded-[28px] p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Why it feels different
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">
                  Editorial structure instead of dashboard clutter.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The interface is organized like a briefing: pulse first, controls second,
                  detail third.
                </p>
              </div>
              <div className="panel rounded-[28px] p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  What ships today
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">
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
