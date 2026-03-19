"use client"

import type { FC } from "react"
import { useMemo, useState } from "react"
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.16),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_70%)]" />
      <div className="pointer-events-none absolute right-[-18%] top-32 h-[420px] w-[420px] rounded-full bg-[conic-gradient(from_140deg,_rgba(14,165,233,0.28),_transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-12%] bottom-[-20%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_bottom,_rgba(12,74,110,0.18),_transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_85%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:pt-16">
        <motion.div
          variants={fadeInFromTop}
          initial="initial"
          animate="animate"
          transition={createTransition()}
          className="mb-8 max-w-4xl text-center sm:text-left"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            Cal.com overview
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Meeting intelligence that drives action
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Focus your operations reviews on signal, not noise. Surface booking
            risk, host load, and time-slot concentration in a dashboard that
            feels native to Cal.com while behaving like an operator control
            room.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.05)}
          className="mb-8"
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
          transition={createTransition(0.1)}
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
          transition={createTransition(0.15)}
          className="mb-8"
        >
          <OverviewStats data={visibleMeetings} />
        </motion.div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.2)}
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
            transition={createTransition(0.25)}
          >
            <MeetingStatusChart data={visibleMeetings} />
          </motion.div>

          <motion.div
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.3)}
          >
            <DurationAnalysis data={visibleMeetings} />
          </motion.div>
        </div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.35)}
          className="mb-8"
        >
          <MeetingTimeline data={visibleMeetings} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.4)}
          >
            <PlatformUsage data={visibleMeetings} />
          </motion.div>

          <motion.div
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.45)}
          >
            <HostActivity data={visibleMeetings} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
