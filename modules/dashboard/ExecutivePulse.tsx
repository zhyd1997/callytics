"use client"

import dayjs from "dayjs"
import { AlertTriangle, ArrowRight, Clock3, Sparkles, TrendingUp, Users } from "lucide-react"

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
    <section className="surface-primary relative overflow-hidden rounded-[40px] p-8 sm:p-10 lg:p-12">
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(255,190,104,0.15),_transparent_70%)] blur-[100px]" />
      <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(109,140,255,0.1),_transparent_70%)] blur-[100px]" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/90 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Weekly Briefing
          </div>
          <h2 className="mt-8 max-w-2xl font-serif text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl tracking-tight">
            Decisions, not just reporting.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {actionLabel}. Acceptance is at <span className="text-white font-medium">{pulse.acceptanceRate}%</span>.
            We recommend steering operations toward host load and unstable bookings first.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="h-14 rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-2xl shadow-accent/20 hover:bg-accent/90"
              onClick={onFocusAttention}
            >
              Review at-risk meetings
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 backdrop-blur-md">
              Sync complete: {dayjs().format("MMM D, h:mm A")}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <div className="flex items-center gap-3 text-white/60">
              <Users className="h-4 w-4" />
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em]">Top Host</span>
            </div>
            <p className="mt-4 font-serif text-2xl text-white">
              {pulse.busiestHost?.[0] ?? "Analysis pending"}
            </p>
            <p className="mt-1 text-sm text-white/50 italic">
              {pulse.busiestHost ? `${pulse.busiestHost[1]} active bookings` : "Waiting for more sync history"}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <div className="flex items-center gap-3 text-white/60">
              <Clock3 className="h-4 w-4" />
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em]">Peak Window</span>
            </div>
            <p className="mt-4 font-serif text-2xl text-white">
              {pulse.hottestSlot?.[0] ?? "Establishing..."}
            </p>
            <p className="mt-1 text-sm text-white/50 italic">
              {pulse.hottestSlot ? "Concentration identified" : "Time patterns emerging"}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <div className="flex items-center gap-3 text-white/60">
              {pulse.atRiskCount > 0 ? (
                <AlertTriangle className="h-4 w-4 text-accent" />
              ) : (
                <TrendingUp className="h-4 w-4 text-primary" />
              )}
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em]">Health Score</span>
            </div>
            <p className="mt-4 font-serif text-2xl text-white">
              {pulse.atRiskCount > 0 ? "Attention Required" : "Stable Flow"}
            </p>
            <p className="mt-1 text-sm text-white/50 italic">
              {pulse.atRiskCount > 0
                ? `${pulse.atRiskCount} unstable records in scope`
                : "No significant friction detected"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
