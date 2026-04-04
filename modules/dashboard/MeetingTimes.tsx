"use client"

import dayjs from "dayjs"
import { Activity, Clock3 } from "lucide-react"
import { motion } from "motion/react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createTransition, fadeInFromBottom } from "@/lib/constants/animations"
import type { MeetingRecord } from "@/lib/types/meeting"

import { WidgetEmptyState } from "./WidgetEmptyState"

interface MeetingTimesProps {
  readonly data: readonly MeetingRecord[]
}

interface TimeSlotRow {
  readonly label: string
  readonly count: number
  readonly percentage: number
}

interface HourCell {
  readonly hour: number
  readonly label: string
  readonly count: number
  readonly intensityClassName: string
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  label: dayjs().hour(hour).minute(0).format("h A"),
}))

const getIntensityClassName = (count: number, maxCount: number) => {
  if (maxCount === 0 || count === 0) {
    return "bg-border/40"
  }

  const ratio = count / maxCount

  if (ratio >= 0.85) {
    return "bg-accent"
  }

  if (ratio >= 0.6) {
    return "bg-primary"
  }

  if (ratio >= 0.35) {
    return "bg-primary/60"
  }

  return "bg-primary/28"
}

export function MeetingTimes({ data }: MeetingTimesProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-tertiary h-full">
        <CardHeader>
          <CardTitle>Meeting Rhythm</CardTitle>
          <CardDescription>Start-time patterns appear once bookings are visible.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <WidgetEmptyState
            title="No timing pattern yet"
            description="Update the dashboard filters to inspect when meetings cluster across the day."
          />
        </CardContent>
      </Card>
    )
  }

  const slotCounts = data.reduce<Record<string, number>>((acc, meeting) => {
    const slotLabel = dayjs(meeting.start).format("h:mm A")
    acc[slotLabel] = (acc[slotLabel] || 0) + 1
    return acc
  }, {})

  const hourCounts = data.reduce<Record<number, number>>((acc, meeting) => {
    const hour = dayjs(meeting.start).hour()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {})

  const totalMeetings = data.length
  const slotRows: TimeSlotRow[] = Object.entries(slotCounts)
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / totalMeetings) * 100),
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }

      return dayjs(`2000-01-01 ${a.label}`).valueOf() - dayjs(`2000-01-01 ${b.label}`).valueOf()
    })
    .slice(0, 5)

  const maxHourCount = Math.max(...Object.values(hourCounts), 0)
  const hourlyCells: HourCell[] = HOUR_LABELS.map(({ hour, label }) => ({
    hour,
    label,
    count: hourCounts[hour] || 0,
    intensityClassName: getIntensityClassName(hourCounts[hour] || 0, maxHourCount),
  }))

  const peakSlot = slotRows[0]
  const earlyWindowCount = hourlyCells
    .filter((cell) => cell.hour >= 6 && cell.hour < 12)
    .reduce((total, cell) => total + cell.count, 0)
  const coreWindowCount = hourlyCells
    .filter((cell) => cell.hour >= 12 && cell.hour < 18)
    .reduce((total, cell) => total + cell.count, 0)
  const lateWindowCount = hourlyCells
    .filter((cell) => cell.hour >= 18 || cell.hour < 6)
    .reduce((total, cell) => total + cell.count, 0)

  const windows = [
    {
      label: "Early",
      range: "6 AM - 12 PM",
      count: earlyWindowCount,
    },
    {
      label: "Core",
      range: "12 PM - 6 PM",
      count: coreWindowCount,
    },
    {
      label: "Late",
      range: "6 PM - 6 AM",
      count: lateWindowCount,
    },
  ]

  const strongestWindow = [...windows].sort((a, b) => b.count - a.count)[0]

  return (
    <Card className="surface-tertiary h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Meeting Rhythm</CardTitle>
            <CardDescription>
              Exact start-time clusters reveal where scheduling pressure actually builds.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-primary/14 bg-primary/8 p-3 text-primary">
            <Clock3 className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition()}
          className="rounded-xl border border-border/50 bg-background/70 p-4 sm:rounded-2xl sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Peak slot
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {peakSlot?.label ?? "N/A"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {peakSlot
                  ? `${peakSlot.count} bookings start at this exact time in the current slice.`
                  : "No repeated start times are visible yet."}
              </p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-accent/12 px-3 py-2 text-right">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Strongest window
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {strongestWindow?.label ?? "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                {strongestWindow?.range ?? "No dominant window"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.08)}
          className="rounded-xl border border-border/50 bg-background/70 p-4 sm:rounded-2xl sm:p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">24-hour rhythm</p>
          </div>
          <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-12 sm:gap-2 lg:grid-cols-24">
            {hourlyCells.map((cell) => (
              <div key={cell.hour} className="space-y-1 sm:space-y-2">
                <div
                  className={`h-12 rounded-lg border border-white/4 transition-transform duration-300 hover:-translate-y-0.5 sm:h-16 lg:h-20 sm:rounded-xl lg:rounded-2xl ${cell.intensityClassName}`}
                  title={`${cell.label}: ${cell.count} bookings`}
                />
                <div className="text-center">
                  <p className="text-[0.5rem] font-medium uppercase text-muted-foreground sm:text-[0.58rem] sm:tracking-[0.14em] lg:text-[0.64rem]">
                    {dayjs().hour(cell.hour).format("ha")}
                  </p>
                  <p className="text-[0.55rem] text-muted-foreground sm:mt-0.5 sm:text-[0.65rem] lg:text-[0.72rem]">{cell.count}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={fadeInFromBottom}
            initial="initial"
            animate="animate"
            transition={createTransition(0.16)}
            className="rounded-xl border border-border/50 bg-background/70 p-4 sm:rounded-2xl sm:p-5"
          >
            <p className="text-sm font-medium text-foreground">Top repeated start times</p>
            <div className="mt-4 space-y-3">
              {slotRows.map((slot, index) => (
                <div key={slot.label} className="rounded-2xl border border-border/70 bg-card/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{slot.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {slot.count} bookings in the current slice
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">{slot.percentage}%</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${slot.percentage}%` }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInFromBottom}
            initial="initial"
            animate="animate"
            transition={createTransition(0.22)}
            className="rounded-xl border border-border/50 bg-background/70 p-4 sm:rounded-2xl sm:p-5"
          >
            <p className="text-sm font-medium text-foreground">Window balance</p>
            <div className="mt-4 space-y-3">
              {windows.map((window) => {
                const percentage =
                  totalMeetings > 0 ? Math.round((window.count / totalMeetings) * 100) : 0

                return (
                  <div
                    key={window.label}
                    className="rounded-2xl border border-border/70 bg-card/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{window.label}</p>
                        <p className="text-sm text-muted-foreground">{window.range}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{window.count}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent/12">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.45 }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
