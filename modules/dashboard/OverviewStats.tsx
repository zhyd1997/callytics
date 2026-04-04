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
      title: "In Scope",
      numericValue: pulse.totalMeetings,
      suffix: "",
      decimals: 0,
      icon: Target,
      eyebrow: "Volume",
      iconColor: "text-primary",
      iconBg: "bg-primary/5",
      detail: `${thisWeekMeetings} this week`,
    },
    {
      title: "At-Risk",
      numericValue: pulse.atRiskCount,
      suffix: "",
      decimals: 0,
      icon: AlertTriangle,
      eyebrow: "Review",
      iconColor: "text-accent",
      iconBg: "bg-accent/5",
      detail: "Unstable bookings",
    },
    {
      title: "Acceptance",
      numericValue: pulse.acceptanceRate,
      suffix: "%",
      decimals: 1,
      icon: Clock3,
      eyebrow: "Conversion",
      iconColor: "text-primary",
      iconBg: "bg-primary/5",
      detail: `${pulse.cancellationRate}% cancel rate`,
    },
    {
      title: "Reach",
      numericValue: participantSet.size,
      suffix: "",
      decimals: 0,
      icon: Users,
      eyebrow: "Network",
      iconColor: "text-primary",
      iconBg: "bg-primary/5",
      detail: `${totalHours.toFixed(0)}h booked`,
    },
  ]

  return (
    <div className="grid auto-rows-fr gap-3 grid-cols-2 sm:gap-4 md:gap-5 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="h-full"
        >
          <Card className="surface-secondary relative h-full overflow-hidden border-border/35 transition-all hover:border-border/60">
            <CardContent className="relative z-[1] p-4 sm:p-5 lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 sm:text-[0.62rem]">
                    {stat.eyebrow}
                  </p>
                  <p className="mt-2 font-serif text-2xl text-foreground sm:mt-3 sm:text-3xl lg:mt-4 lg:text-4xl">
                    <AnimatedNumber
                      value={stat.numericValue}
                      decimals={stat.decimals}
                      duration={1.5}
                    />
                    {stat.suffix}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
                    {stat.title}
                  </p>
                  <div className="mt-2 h-px w-6 bg-border/50 sm:mt-3 sm:w-8" />
                  <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground/50 sm:mt-3 sm:text-[0.65rem]">
                    {stat.detail}
                  </p>
                </div>
                <div className={`rounded-xl p-2 sm:rounded-2xl sm:p-2.5 ${stat.iconBg}`}>
                  <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
