"use client"

import type { FC } from "react"
import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { ArrowUpRight, CalendarDays, Clock3, Filter, Users } from "lucide-react"
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

  const focusCards = [
    {
      label: "Visible meetings",
      value: visibleMeetings.length.toString(),
      detail: `${filteredMeetings.length} total synced records`,
      icon: CalendarDays,
    },
    {
      label: "At-risk bookings",
      value: pulse.atRiskCount.toString().padStart(2, "0"),
      detail: "Needs attention in the next 14 days",
      icon: Filter,
    },
    {
      label: "Busiest host",
      value: pulse.busiestHost?.[0] ?? "Unassigned",
      detail: pulse.busiestHost ? `${pulse.busiestHost[1]} meetings in range` : "No host activity yet",
      icon: Users,
    },
    {
      label: "Peak slot",
      value: pulse.hottestSlot?.[0] ?? "N/A",
      detail: pulse.hottestSlot ? `${pulse.hottestSlot[1]} bookings clustered` : "Waiting for enough data",
      icon: Clock3,
    },
  ] as const

  const rangeLabel = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    all: "All time",
  }[filters.range]

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
          className="mb-8"
        >
          <div className="section-kicker mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            Operator workspace
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
            <div className="max-w-4xl">
              <h1 className="display-title text-4xl leading-[0.94] text-foreground sm:text-5xl lg:text-6xl">
                Meeting intelligence that reads like a briefing, not a backlog.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                Focus operations reviews on signal instead of cleanup. The
                dashboard surfaces risk, host load, timing concentration, and
                recent movement in a sequence that is easier to scan and easier
                to explain.
              </p>
            </div>

            <div className="panel rounded-[30px] p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Current view
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Date range</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{rangeLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last refreshed</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {dayjs().format("MMM D, YYYY")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top event type</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {pulse.topEventType?.[0] ?? getEventTypeLabel(filteredMeetings[0] ?? visibleMeetings[0])}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Acceptance rate</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {pulse.acceptanceRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.05)}
          className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {focusCards.map((card) => {
            const Icon = card.icon

            return (
              <div key={card.label} className="panel rounded-[28px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {card.label}
                  </p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/14 bg-primary/8 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.detail}
                </p>
              </div>
            )
          })}
        </motion.div>

        <div className="mb-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            variants={fadeInFromBottom}
            initial="initial"
            animate="animate"
            transition={createTransition(0.1)}
            className="min-w-0"
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
            transition={createTransition(0.15)}
            className="panel rounded-[32px] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Active narrative
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  What deserves discussion right now
                </h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-[24px] border border-border/70 bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground">Risk concentration</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {pulse.atRiskCount > 0
                    ? `${pulse.atRiskCount} bookings in the upcoming window need operator attention.`
                    : "No at-risk bookings are currently surfaced in the selected range."}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground">Capacity watch</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {pulse.busiestHost
                    ? `${pulse.busiestHost[0]} is carrying the heaviest load in the current slice.`
                    : "Host distribution will appear here once more meetings are available."}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground">Demand pattern</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {pulse.hottestSlot
                    ? `${pulse.hottestSlot[0]} is the strongest booking window in this view.`
                    : "Time-slot concentration will appear once enough bookings are synced."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.2)}
          className="mb-8"
        >
          <DashboardFilters
            filters={filters}
            onFiltersChange={setFilters}
            hostOptions={hostOptions}
            eventTypeOptions={eventTypeOptions}
            statusOptions={statusOptions}
          />
        </motion.div>

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
