"use client"

import dayjs from "dayjs"
import { AlertTriangle, ArrowRight, Clock3, Sparkles, TrendingUp, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { MeetingRecord } from "@/lib/types/meeting"

import { getDashboardPulse } from "./utils/insights"

interface ExecutivePulseProps {
  readonly data: readonly MeetingRecord[]
  readonly onFocusAttention: () => void
}

export const ExecutivePulse = ({
  data,
  onFocusAttention,
}: ExecutivePulseProps) => {
  const pulse = getDashboardPulse(data)

  const actionLabel =
    pulse.atRiskCount > 0
      ? `${pulse.atRiskCount} meetings need attention in the current view`
      : "No immediate booking risk detected"

  return (
    <section className="surface-primary relative overflow-hidden rounded-[32px] p-6 sm:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(15,15,15,0.12),_transparent_70%)] blur-3xl" />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            Weekly pulse
          </div>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Keep the dashboard oriented around decisions, not just reporting.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/74 sm:text-base">
            {actionLabel}. Acceptance is at {pulse.acceptanceRate}% and cancellation is at{" "}
            {pulse.cancellationRate}%, so the page should steer operators toward host load,
            timing friction, and unstable bookings first.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full"
              onClick={onFocusAttention}
            >
              Review at-risk meetings
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white hover:bg-white/10">
              Updated {dayjs().format("MMM D")}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-white/70">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em]">Top host</span>
            </div>
            <p className="mt-3 text-xl font-semibold text-white">
              {pulse.busiestHost?.[0] ?? "Not enough data"}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {pulse.busiestHost ? `${pulse.busiestHost[1]} meetings in scope` : "Waiting for more meeting history"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-white/70">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em]">Peak slot</span>
            </div>
            <p className="mt-3 text-xl font-semibold text-white">
              {pulse.hottestSlot?.[0] ?? "Not enough data"}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {pulse.hottestSlot ? `${pulse.hottestSlot[1]} bookings start here` : "No time concentration yet"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-white/70">
              {pulse.atRiskCount > 0 ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <span className="text-xs uppercase tracking-[0.2em]">Action signal</span>
            </div>
            <p className="mt-3 text-xl font-semibold text-white">
              {pulse.topEventType?.[0] ?? "General mix"}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {pulse.atRiskCount > 0
                ? `${pulse.atRiskCount} unstable bookings across the current view`
                : "Current booking mix looks stable"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
