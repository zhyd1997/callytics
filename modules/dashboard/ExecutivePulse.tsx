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
    <section className="surface-primary relative overflow-hidden rounded-2xl p-5 sm:rounded-[40px] sm:p-8 lg:p-10 xl:p-12">
      {/* Mist-like glow orbs */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(120,180,130,0.12),_transparent_70%)] blur-[80px] sm:h-96 sm:w-96 sm:blur-[100px]" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(80,140,110,0.08),_transparent_70%)] blur-[80px] sm:h-96 sm:w-96 sm:blur-[100px]" />

      <div className="relative z-10 grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Weekly Briefing
          </div>
          <h2 className="mt-5 max-w-2xl font-serif text-2xl leading-[1.12] text-white sm:mt-8 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            Decisions, not just reporting.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-6 sm:text-base lg:text-lg">
            {actionLabel}. Acceptance is at <span className="text-white font-medium">{pulse.acceptanceRate}%</span>.
            We recommend steering operations toward host load and unstable bookings first.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground shadow-xl shadow-accent/15 hover:bg-accent/90 sm:h-14 sm:px-8 sm:text-base"
              onClick={onFocusAttention}
            >
              Review at-risk meetings
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="rounded-full border border-white/8 bg-white/4 px-4 py-2.5 text-xs font-medium text-white/70 backdrop-blur-md sm:px-5 sm:py-3 sm:text-sm">
              Sync complete: {dayjs().format("MMM D, h:mm A")}
            </div>
          </div>
        </div>

        {/* Metric cards – horizontal scroll on mobile, stacked on lg */}
        <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-1">
          <div className="group relative min-w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-md transition-all hover:bg-white/8 sm:min-w-0 sm:rounded-[32px] sm:p-6">
            <div className="flex items-center gap-2.5 text-white/50">
              <Users className="h-4 w-4" />
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] sm:text-[0.62rem]">Top Host</span>
            </div>
            <p className="mt-3 font-serif text-xl text-white sm:mt-4 sm:text-2xl">
              {pulse.busiestHost?.[0] ?? "Analysis pending"}
            </p>
            <p className="mt-1 text-xs text-white/40 italic sm:text-sm">
              {pulse.busiestHost ? `${pulse.busiestHost[1]} active bookings` : "Waiting for more sync history"}
            </p>
          </div>

          <div className="group relative min-w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-md transition-all hover:bg-white/8 sm:min-w-0 sm:rounded-[32px] sm:p-6">
            <div className="flex items-center gap-2.5 text-white/50">
              <Clock3 className="h-4 w-4" />
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] sm:text-[0.62rem]">Peak Window</span>
            </div>
            <p className="mt-3 font-serif text-xl text-white sm:mt-4 sm:text-2xl">
              {pulse.hottestSlot?.[0] ?? "Establishing..."}
            </p>
            <p className="mt-1 text-xs text-white/40 italic sm:text-sm">
              {pulse.hottestSlot ? "Concentration identified" : "Time patterns emerging"}
            </p>
          </div>

          <div className="group relative min-w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-md transition-all hover:bg-white/8 sm:min-w-0 sm:rounded-[32px] sm:p-6">
            <div className="flex items-center gap-2.5 text-white/50">
              {pulse.atRiskCount > 0 ? (
                <AlertTriangle className="h-4 w-4 text-accent" />
              ) : (
                <TrendingUp className="h-4 w-4 text-primary" />
              )}
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] sm:text-[0.62rem]">Health Score</span>
            </div>
            <p className="mt-3 font-serif text-xl text-white sm:mt-4 sm:text-2xl">
              {pulse.atRiskCount > 0 ? "Attention Required" : "Stable Flow"}
            </p>
            <p className="mt-1 text-xs text-white/40 italic sm:text-sm">
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
