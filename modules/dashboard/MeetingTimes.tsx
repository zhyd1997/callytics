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
    return "bg-foreground/75"
  }

  if (ratio >= 0.6) {
    return "bg-foreground/60"
  }

  if (ratio >= 0.35) {
    return "bg-foreground/45"
  }

  return "bg-foreground/28"
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
          <div className="rounded-2xl border border-border/70 bg-card p-3 text-foreground">
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
          className="rounded-[26px] border border-border/70 bg-background/75 p-5"
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
            <div className="rounded-2xl border border-border/70 bg-muted/60 px-3 py-2 text-right">
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
          className="rounded-[26px] border border-border/70 bg-background/75 p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-foreground/70" />
            <p className="text-sm font-medium text-foreground">24-hour rhythm</p>
          </div>
          <div className="grid grid-cols-12 gap-2 sm:grid-cols-24">
            {hourlyCells.map((cell) => (
              <div key={cell.hour} className="space-y-2">
                <div
                  className={`h-20 rounded-2xl border border-white/6 transition-transform duration-300 hover:-translate-y-0.5 ${cell.intensityClassName}`}
                  title={`${cell.label}: ${cell.count} bookings`}
                />
                <div className="text-center">
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {dayjs().hour(cell.hour).format("ha")}
                  </p>
                  <p className="mt-1 text-[0.72rem] text-muted-foreground">{cell.count}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={fadeInFromBottom}
            initial="initial"
            animate="animate"
            transition={createTransition(0.16)}
            className="rounded-[26px] border border-border/70 bg-background/75 p-5"
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
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${slot.percentage}%` }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      className="h-full rounded-full bg-foreground/70"
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
            className="rounded-[26px] border border-border/70 bg-background/75 p-5"
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
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.45 }}
                        className="h-full rounded-full bg-foreground/55"
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
