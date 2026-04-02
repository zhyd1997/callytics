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
    <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="h-full"
        >
          <Card className="surface-secondary relative h-full overflow-hidden border-border/40 transition-all hover:border-border/80">
            <CardContent className="relative z-[1] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">
                    {stat.eyebrow}
                  </p>
                  <p className="mt-4 font-serif text-4xl text-foreground">
                    <AnimatedNumber
                      value={stat.numericValue}
                      decimals={stat.decimals}
                      duration={1.5}
                    />
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="mt-4 h-px w-8 bg-border/60" />
                  <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground/60">
                    {stat.detail}
                  </p>
                </div>
                <div className={`rounded-2xl p-2.5 ${stat.iconBg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
