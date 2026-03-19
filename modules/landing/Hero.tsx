"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarRange, Layers3, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signIn } from "@/lib/auth/sign-in"

const PROOF_POINTS = [
  "Spot cancellation spikes before the weekly ops review.",
  "See which host and event type actually carry the load.",
  "Bring export-ready talking points into stakeholder syncs.",
]

const KPI_CARDS = [
  {
    label: "Accepted bookings",
    value: "74%",
    detail: "+8 pts vs. prior period",
  },
  {
    label: "Meetings at risk",
    value: "06",
    detail: "Pending, cancelled, or recently rescheduled",
  },
  {
    label: "Peak booking slot",
    value: "2 PM",
    detail: "Tuesday and Thursday dominate demand",
  },
]

export function Hero() {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

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
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.16),_transparent_70%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_72%)]" />
        <div className="absolute right-[-10%] top-24 h-80 w-80 rounded-full bg-[conic-gradient(from_140deg,_rgba(76,154,255,0.24),_transparent_55%)] blur-3xl" />
        <div className="absolute left-[-5%] bottom-[-12%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_bottom,_rgba(12,74,110,0.16),_transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.32),transparent_85%)]" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground lg:mx-0">
              <Sparkles className="h-3.5 w-3.5" />
              Cal.com analytics, without a custom backend
            </div>

            <h1 className="mt-6 text-balance font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Know which{" "}
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
              bookings need attention before your team asks.
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Callytics turns Cal.com activity into an operator-friendly review
              surface. Track booking stability, host pressure, and event-type
              momentum in a presentation layer built for weekly decisions, not
              just pretty charts.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
              {showConnectCta ? (
                <>
                  <Button
                    size="lg"
                    className="min-w-[220px] rounded-full text-base font-semibold"
                    disabled={isConnecting}
                    onClick={handleCalOAuth}
                  >
                    {isConnecting ? "Connecting..." : "Connect with Cal.com"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[220px] rounded-full border-border/70 bg-transparent text-base text-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                    asChild
                  >
                    <Link href="/demo">Explore the demo</Link>
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  className="min-w-[220px] rounded-full text-base font-semibold"
                  asChild
                >
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
              {PROOF_POINTS.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-sm leading-6 text-foreground">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                OAuth-secured Cal.com access
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <CalendarRange className="h-4 w-4 text-accent" />
                Built for weekly ops reviews
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Layers3 className="h-4 w-4 text-accent" />
                KPI exports and stakeholder-ready views
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-primary overflow-hidden rounded-[32px] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/70">
                    Weekly pulse
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    Review the signal before the review meeting.
                  </h2>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                  Live preview
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {KPI_CARDS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                      {item.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-white/12 bg-white/6 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Operator checklist</p>
                    <p className="mt-1 text-sm text-white/70">
                      What changed, who owns it, and where demand is clustering.
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-white/70" />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm">Cancellation rate rose for onboarding bookings</p>
                      <span className="rounded-full bg-white/12 px-2 py-1 text-xs">Needs follow-up</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm">Tuesday 2 PM remains the strongest slot</p>
                      <span className="rounded-full bg-white/12 px-2 py-1 text-xs">Trend holding</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm">Sarah Wilson now carries the highest host load</p>
                      <span className="rounded-full bg-white/12 px-2 py-1 text-xs">Capacity watch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface-secondary rounded-[28px] p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Why teams switch
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  Less spreadsheet cleanup, more confident decisions.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Replace stitched-together exports with one review surface that
                  already understands booking context.
                </p>
              </div>
              <div className="surface-secondary rounded-[28px] p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  What ships
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  Filters, pulse summaries, and grouped meeting queues.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Enough fidelity for operators now, with room for more advanced
                  analytics later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
