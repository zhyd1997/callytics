"use client"

import type { FC } from "react"
import { useMemo, useState } from "react"
import dayjs from "dayjs"
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
} from "lucide-react"
import { motion } from "motion/react"

import { MEETING_DATA } from "@/constants/meetings"
import type { MeetingCollection, MeetingRecord } from "@/lib/types/meeting"
import { removeSelfMeetings } from "@/lib/utils/meetings"
import {
  createTransition,
  fadeInFromBottom,
  fadeInFromLeft,
  fadeInFromRight,
  fadeInFromTop,
} from "@/lib/constants/animations"

import { DashboardFilters } from "./DashboardFilters"
import { DurationAnalysis } from "./DurationAnalysis"
import { ExecutivePulse } from "./ExecutivePulse"
import { HostActivity } from "./HostActivity"
import { MeetingStatusChart } from "./MeetingStatusChart"
import { MeetingTimeline } from "./MeetingTimeline"
import { MeetingTimes } from "./MeetingTimes"
import { OverviewStats } from "./OverviewStats"
import { PlatformUsage } from "./PlatformUsage"
import { RecentMeetings } from "./RecentMeetings"
import {
  filterMeetings,
  getDashboardPulse,
  getEventTypeLabel,
  type DashboardFiltersState,
} from "./utils/insights"

interface DashboardAppProps {
  readonly initialMeetings?: MeetingCollection
}

const DEFAULT_FILTERS: DashboardFiltersState = {
  segment: "all",
  range: "30d",
  status: "all",
  host: "all",
  eventType: "all",
  query: "",
}

const SAVED_VIEWS = [
  {
    id: "ops-review",
    label: "Ops review",
    description: "Balanced briefing for weekly reviews",
    filters: DEFAULT_FILTERS,
  },
  {
    id: "risk-watch",
    label: "Risk watch",
    description: "Focus on unstable bookings first",
    filters: {
      ...DEFAULT_FILTERS,
      segment: "attention" as const,
      range: "30d" as const,
    },
  },
  {
    id: "capacity",
    label: "Capacity",
    description: "Upcoming meetings and host load",
    filters: {
      ...DEFAULT_FILTERS,
      segment: "upcoming" as const,
      range: "30d" as const,
      status: "accepted",
    },
  },
  {
    id: "history",
    label: "History",
    description: "Completed and recently changed work",
    filters: {
      ...DEFAULT_FILTERS,
      segment: "completed" as const,
      range: "90d" as const,
    },
  },
] as const

export const App: FC<DashboardAppProps> = ({ initialMeetings }) => {
  const meetingData = useMemo<MeetingCollection>(() => {
    return initialMeetings ?? MEETING_DATA.data
  }, [initialMeetings])

  const filteredMeetings = useMemo<MeetingRecord[]>(() => {
    return removeSelfMeetings(meetingData)
  }, [meetingData])

  const [filters, setFilters] = useState<DashboardFiltersState>(DEFAULT_FILTERS)

  const visibleMeetings = useMemo(() => {
    return filterMeetings(filteredMeetings, filters)
  }, [filteredMeetings, filters])

  const pulse = useMemo(() => {
    return getDashboardPulse(visibleMeetings)
  }, [visibleMeetings])

  const hostOptions = useMemo(() => {
    const hosts = filteredMeetings.flatMap((meeting) => meeting.hosts)
    const uniqueHosts = [...new Map(hosts.map((host) => [host.email, host])).values()]

    return [
      { label: "All hosts", value: "all" },
      ...uniqueHosts
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((host) => ({ label: host.name, value: host.email })),
    ]
  }, [filteredMeetings])

  const eventTypeOptions = useMemo(() => {
    const eventTypes = [
      ...new Set(filteredMeetings.map((meeting) => getEventTypeLabel(meeting))),
    ]

    return [
      { label: "All event types", value: "all" },
      ...eventTypes
        .sort((a, b) => a.localeCompare(b))
        .map((eventType) => ({ label: eventType, value: eventType })),
    ]
  }, [filteredMeetings])

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(filteredMeetings.map((meeting) => meeting.status))]

    return [
      { label: "All statuses", value: "all" },
      ...statuses
        .sort((a, b) => a.localeCompare(b))
        .map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
        })),
    ]
  }, [filteredMeetings])

  const rangeLabel = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    all: "All time",
  }[filters.range]

  const atRiskMeetings = useMemo(() => {
    return visibleMeetings
      .filter((meeting) => {
        return (
          meeting.status === "cancelled" ||
          meeting.status === "pending" ||
          meeting.status === "unconfirmed" ||
          meeting.status === "rejected" ||
          Boolean(meeting.reschedulingReason)
        )
      })
      .slice(0, 4)
  }, [visibleMeetings])

  const upcomingMeetings = useMemo(() => {
    return visibleMeetings
      .filter((meeting) => dayjs(meeting.start).isAfter(dayjs()))
      .sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf())
      .slice(0, 4)
  }, [visibleMeetings])

  const actionItems = [
    pulse.atRiskCount > 0
      ? `${pulse.atRiskCount} bookings need manual review in the current slice.`
      : "No immediate booking risk detected in the current slice.",
    pulse.busiestHost
      ? `${pulse.busiestHost[0]} is carrying the highest meeting load right now.`
      : "Host load will appear when more synced bookings are available.",
    pulse.hottestSlot
      ? `${pulse.hottestSlot[0]} remains the busiest booking window in this range.`
      : "Time-slot concentration has not emerged in this slice yet.",
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-90" />
      <div className="grid-fade pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute right-[-14%] top-20 h-[400px] w-[400px] rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute left-[-8%] top-52 h-[340px] w-[340px] rounded-full bg-accent/14 blur-3xl" />
      <div className="relative shell-container py-10 sm:py-14">
        <motion.div
          variants={fadeInFromTop}
          initial="initial"
          animate="animate"
          transition={createTransition()}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Live Briefing
            </div>
            <div className="h-px flex-1 bg-border/40" />
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              {dayjs().format("MMMM D, YYYY")}
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div className="max-w-4xl">
              <h1 className="display-title text-5xl text-foreground sm:text-6xl lg:text-7xl">
                Intelligence that reads like a briefing.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground/90">
                Focus operations reviews on signal instead of cleanup. We surface
                risk, host load, and timing concentration in a sequence that
                is easier to scan and explain.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-[32px] border border-border/50 bg-card/40 p-6 backdrop-blur-md">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/5 blur-3xl transition-all group-hover:bg-accent/10" />
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">
                Executive Overview
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/40 bg-background/40 p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">Date Range</p>
                  <p className="mt-1 text-xl font-serif tracking-tight text-foreground">{rangeLabel}</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-background/40 p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">Acceptance</p>
                  <p className="mt-1 text-xl font-serif tracking-tight text-foreground">{pulse.acceptanceRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[280px_1fr]">
          <motion.aside
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.1)}
            className="space-y-8"
          >
            <div className="sticky top-28 space-y-8">
              <DashboardFilters
                filters={filters}
                onFiltersChange={setFilters}
                hostOptions={hostOptions}
                eventTypeOptions={eventTypeOptions}
                statusOptions={statusOptions}
                savedViews={SAVED_VIEWS}
              />

              <div className="rounded-[32px] border border-border/50 bg-card/30 p-6 backdrop-blur-md">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">Triage Status</p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">At-risk</span>
                    <span className={`font-serif text-lg ${pulse.atRiskCount > 0 ? 'text-accent' : 'text-foreground'}`}>
                      {pulse.atRiskCount}
                    </span>
                  </div>
                  <div className="h-px bg-border/40" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hosts</span>
                    <span className="font-serif text-lg text-foreground">{hostOptions.length - 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="space-y-10">
            <motion.div
              variants={fadeInFromBottom}
              initial="initial"
              animate="animate"
              transition={createTransition(0.15)}
            >
              <ExecutivePulse
                data={visibleMeetings}
                onFocusAttention={() =>
                  setFilters((current) => ({ ...current, segment: "attention" }))
                }
              />
            </motion.div>

            <motion.div
              variants={fadeInFromBottom}
              initial="initial"
              animate="animate"
              transition={createTransition(0.2)}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="panel group rounded-[32px] p-7 transition-all hover:bg-card/90">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">Narrative</p>
                    <h2 className="mt-2 text-2xl font-serif tracking-tight text-foreground">Active analysis</h2>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/50 bg-background/50 p-4 transition-colors group-hover:border-border/80">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-accent">Risk watch</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {pulse.atRiskCount > 0
                        ? `${pulse.atRiskCount} bookings need operator attention right now.`
                        : "No unstable bookings are currently surfaced."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/50 p-4 transition-colors group-hover:border-border/80">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary">Capacity</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {pulse.busiestHost
                        ? `${pulse.busiestHost[0]} is carrying the peak meeting load.`
                        : "Host distribution is within normal operating range."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="panel group rounded-[32px] p-7 transition-all hover:bg-card/90">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">Actions</p>
                    <h2 className="mt-2 text-2xl font-serif tracking-tight text-foreground">Recommended</h2>
                  </div>
                  <div className="rounded-2xl bg-accent/10 p-2 text-accent">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  {actionItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-1">
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInFromBottom}
              initial="initial"
              animate="animate"
              transition={createTransition(0.25)}
            >
              <OverviewStats data={visibleMeetings} />
            </motion.div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                variants={fadeInFromLeft}
                initial="initial"
                animate="animate"
                transition={createTransition(0.3)}
              >
                <RecentMeetings data={visibleMeetings} />
              </motion.div>
              <motion.div
                variants={fadeInFromRight}
                initial="initial"
                animate="animate"
                transition={createTransition(0.35)}
              >
                <MeetingTimes data={visibleMeetings} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <motion.aside
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.23)}
            className="panel rounded-[32px] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Triage rail
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  What needs attention first
                </h2>
              </div>
              <AlertTriangle className="h-5 w-5 text-accent" />
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-foreground">At-risk bookings</p>
                <div className="mt-3 space-y-3">
                  {atRiskMeetings.length > 0 ? (
                    atRiskMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="rounded-[24px] border border-border/70 bg-background/70 p-4"
                      >
                        <p className="line-clamp-1 text-sm font-medium text-foreground">
                          {meeting.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {meeting.reschedulingReason ? "Rescheduled" : meeting.status}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {dayjs(meeting.start).format("MMM D, h:mm A")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                      No unstable bookings in this view.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Recommended actions</p>
                <div className="mt-3 space-y-3">
                  {actionItems.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-[24px] border border-border/70 bg-background/70 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.section
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.26)}
            className="panel rounded-[32px] p-6"
          >
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Action workspace
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Guided review for the current slice
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Use this workspace to move through the current period in the
                  right order: immediate risk, upcoming work, then broader
                  patterns.
                </p>
              </div>

              <div className="rounded-[24px] border border-border/70 bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground">Current briefing</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {pulse.atRiskCount > 0
                    ? `Start with the ${pulse.atRiskCount} unstable bookings, then confirm whether ${pulse.busiestHost?.[0] ?? "the lead host"} needs capacity relief.`
                    : `Current booking flow looks stable. Use the upcoming queue to check concentration around ${pulse.hottestSlot?.[0] ?? "peak demand windows"}.`}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[28px] border border-border/70 bg-background/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">Next meetings</p>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 space-y-3">
                  {upcomingMeetings.length > 0 ? (
                    upcomingMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="rounded-[20px] border border-border/70 bg-card/70 p-4"
                      >
                        <p className="line-clamp-1 text-sm font-medium text-foreground">
                          {meeting.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dayjs(meeting.start).format("MMM D, h:mm A")}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {meeting.hosts[0]?.name ?? "Unknown host"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-border/70 bg-card/60 p-4 text-sm text-muted-foreground">
                      No upcoming meetings in the current slice.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-border/70 bg-background/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">Focus metrics</p>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-border/70 bg-card/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Acceptance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {pulse.acceptanceRate}%
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-border/70 bg-card/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Cancellation
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {pulse.cancellationRate}%
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-border/70 bg-card/70 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Dominant event type
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {pulse.topEventType?.[0] ?? "General"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.25)}
          className="mb-8"
        >
          <OverviewStats data={visibleMeetings} />
        </motion.div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.3)}
          className="mb-8"
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <RecentMeetings data={visibleMeetings} />
            <MeetingTimes data={visibleMeetings} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.35)}
          >
            <MeetingStatusChart data={visibleMeetings} />
          </motion.div>

          <motion.div
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.4)}
          >
            <DurationAnalysis data={visibleMeetings} />
          </motion.div>
        </div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.45)}
          className="mb-8"
        >
          <MeetingTimeline data={visibleMeetings} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.5)}
          >
            <PlatformUsage data={visibleMeetings} />
          </motion.div>

          <motion.div
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.55)}
          >
            <HostActivity data={visibleMeetings} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
