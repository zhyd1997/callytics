"use client"

import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import { AlertTriangle, Clock3, Target, Users } from "lucide-react"
import { motion } from "motion/react"

import type { MeetingRecord } from "@/lib/types/meeting"

import { Card, CardContent } from "@/components/ui/card"

import { AnimatedNumber } from "./AnimatedNumber"
import { WidgetEmptyState } from "./WidgetEmptyState"
import { getDashboardPulse } from "./utils/insights"

// Extend dayjs with comparison plugins
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

interface OverviewStatsProps {
  readonly data: readonly MeetingRecord[]
}

export function OverviewStats({ data }: OverviewStatsProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-secondary">
        <CardContent className="p-0">
          <WidgetEmptyState
            title="No meetings match this view"
            description="Adjust the timeframe or clear one of the filters to bring summary signals back into scope."
          />
        </CardContent>
      </Card>
    )
  }

  const pulse = getDashboardPulse(data)
  const totalHours = data.reduce((acc, meeting) => acc + meeting.duration, 0) / 60
  const participantSet = new Set<string>()
  data.forEach((meeting) => {
    meeting.hosts.forEach((host) => participantSet.add(host.email))
    meeting.attendees.forEach((attendee) => participantSet.add(attendee.email))
  })

  const weekStart = dayjs().startOf("week")
  const thisWeekMeetings = data.filter((meeting) => {
    const meetingDate = dayjs(meeting.start)
    return (
      meetingDate.isSameOrAfter(weekStart, "day") &&
      meetingDate.isSameOrBefore(weekStart.add(6, "day"), "day")
    )
  }).length

  const stats = [
    {
      title: "Bookings In Scope",
      numericValue: pulse.totalMeetings,
      suffix: "",
      decimals: 0,
      icon: Target,
      eyebrow: "Volume",
      iconColor: "text-primary",
      iconBg: "bg-accent/18 border border-accent/28",
      detail: `${thisWeekMeetings} this week`,
    },
    {
      title: "At-Risk Meetings",
      numericValue: pulse.atRiskCount,
      suffix: "",
      decimals: 0,
      icon: AlertTriangle,
      eyebrow: "Needs review",
      iconColor: "text-amber-700 dark:text-amber-300",
      iconBg: "bg-amber-500/12 border border-amber-500/24",
      detail:
        pulse.atRiskCount > 0
          ? "Cancelled, pending, rejected, or rescheduled bookings"
          : "No unstable bookings in the current filter scope",
    },
    {
      title: "Acceptance Rate",
      numericValue: pulse.acceptanceRate,
      suffix: "%",
      decimals: 1,
      icon: Clock3,
      eyebrow: "Conversion",
      iconColor: "text-chart-5",
      iconBg: "bg-chart-5/12 border border-chart-5/24",
      detail: `${pulse.cancellationRate}% cancellation rate`,
    },
    {
      title: "Participants Reached",
      numericValue: participantSet.size,
      suffix: "",
      decimals: 0,
      icon: Users,
      eyebrow: "Reach",
      iconColor: "text-chart-4",
      iconBg: "bg-chart-4/12 border border-chart-4/24",
      detail: `${totalHours.toFixed(1)} hours booked`,
    },
  ]

  return (
    <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="surface-secondary relative h-full overflow-hidden">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,154,255,0.08),_transparent_70%)] opacity-70" />
            <CardContent className="relative z-[1] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {stat.eyebrow}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-2xl font-semibold sm:text-3xl">
                    <AnimatedNumber
                      value={stat.numericValue}
                      decimals={stat.decimals}
                      duration={1.5}
                    />
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
