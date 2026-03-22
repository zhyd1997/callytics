"use client"

import dayjs from "dayjs"
import { motion } from "motion/react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MeetingRecord } from "@/lib/types/meeting"

import { WidgetEmptyState } from "./WidgetEmptyState"

interface MeetingTimelineProps {
  readonly data: readonly MeetingRecord[]
}

interface TrendRow {
  readonly week: string
  readonly accepted: number
  readonly atRisk: number
  readonly completed: number
  readonly total: number
  readonly sortKey: string
}

interface TooltipPropsType {
  active?: boolean
  payload?: Array<{ color: string; dataKey: string; value: number; name: string; payload: TrendRow }>
  label?: string
}

const AT_RISK_STATUSES = new Set(["cancelled", "pending", "rejected", "unconfirmed"])

const CustomTooltip = ({ active, payload, label }: TooltipPropsType) => {
  if (!active || !payload?.length) {
    return null
  }

  const row = payload[0]?.payload

  if (!row) {
    return null
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/92 p-4 shadow-[0_10px_36px_rgba(76,154,255,0.16)] backdrop-blur">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <p>
          <span className="text-chart-5">●</span> Accepted: {row.accepted}
        </p>
        <p>
          <span className="text-rose-500">●</span> At risk: {row.atRisk}
        </p>
        <p>
          <span className="text-accent">●</span> Completed: {row.completed}
        </p>
        <p>
          <span className="text-primary">●</span> Total: {row.total}
        </p>
      </div>
    </div>
  )
}

export function MeetingTimeline({ data }: MeetingTimelineProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-tertiary">
        <CardHeader>
          <CardTitle>Meeting Flow</CardTitle>
          <CardDescription>No weekly activity is visible in the current slice.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <WidgetEmptyState
            title="Timeline unavailable"
            description="Bring more meetings into scope to see accepted flow and unstable pressure change over time."
          />
        </CardContent>
      </Card>
    )
  }

  const weeklyData = data.reduce<Record<string, TrendRow>>((acc, meeting) => {
    const start = dayjs(meeting.start)
    const weekStart = start.startOf("week")
    const key = weekStart.format("YYYY-MM-DD")

    if (!acc[key]) {
      acc[key] = {
        week: `${weekStart.format("MMM D")} - ${weekStart.add(6, "day").format("MMM D")}`,
        accepted: 0,
        atRisk: 0,
        completed: 0,
        total: 0,
        sortKey: key,
      }
    }

    acc[key].total += 1

    if (meeting.status === "accepted") {
      acc[key].accepted += 1
    }

    if (AT_RISK_STATUSES.has(meeting.status) || Boolean(meeting.reschedulingReason)) {
      acc[key].atRisk += 1
    }

    if (meeting.status === "completed" || meeting.status === "past") {
      acc[key].completed += 1
    }

    return acc
  }, {})

  const timelineData = Object.values(weeklyData)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(-8)

  const acceptedTotal = timelineData.reduce((sum, row) => sum + row.accepted, 0)
  const atRiskTotal = timelineData.reduce((sum, row) => sum + row.atRisk, 0)
  const completedTotal = timelineData.reduce((sum, row) => sum + row.completed, 0)
  const averageVolume =
    timelineData.length > 0
      ? timelineData.reduce((sum, row) => sum + row.total, 0) / timelineData.length
      : 0
  const firstRow = timelineData[0]
  const lastRow = timelineData[timelineData.length - 1]
  const trendDelta = lastRow && firstRow ? lastRow.total - firstRow.total : 0
  const peakRiskWeek = [...timelineData].sort((a, b) => b.atRisk - a.atRisk)[0]

  return (
    <Card className="surface-tertiary">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Meeting Flow</CardTitle>
            <CardDescription>
              Weekly flow separates healthy booking volume from instability so drift shows up earlier.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/14 bg-primary/8 px-3 py-1.5">
            <TrendingUp className={`h-4 w-4 ${trendDelta >= 0 ? "text-primary" : "text-rose-500"}`} />
            <span className={`text-sm font-medium ${trendDelta >= 0 ? "text-primary" : "text-rose-500"}`}>
              {trendDelta >= 0 ? "+" : ""}
              {trendDelta} volume
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-[320px] w-full rounded-[28px] border border-border/70 bg-background/75 p-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="acceptedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-5)" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="var(--color-chart-5)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="accepted"
                name="Accepted"
                stroke="var(--color-chart-5)"
                strokeWidth={2.5}
                fill="url(#acceptedFill)"
              />
              <Area
                type="monotone"
                dataKey="atRisk"
                name="At risk"
                stroke="#f87171"
                strokeWidth={2.5}
                fill="url(#riskFill)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                fill="url(#completedFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.06 }}
            className="rounded-2xl border border-chart-5/18 bg-chart-5/7 p-4"
          >
            <p className="text-sm text-muted-foreground">Accepted flow</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{acceptedTotal}</p>
            <p className="mt-1 text-sm text-muted-foreground">Across the visible weekly range</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.12 }}
            className="rounded-2xl border border-rose-500/18 bg-rose-500/7 p-4"
          >
            <p className="text-sm text-muted-foreground">At-risk flow</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{atRiskTotal}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {peakRiskWeek ? `Peak pressure: ${peakRiskWeek.week}` : "No unstable spike"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.18 }}
            className="rounded-2xl border border-accent/18 bg-accent/8 p-4"
          >
            <p className="text-sm text-muted-foreground">Completed flow</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{completedTotal}</p>
            <p className="mt-1 text-sm text-muted-foreground">Closed work in this time window</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.24 }}
            className="rounded-2xl border border-primary/14 bg-primary/7 p-4"
          >
            <p className="text-sm text-muted-foreground">Average weekly volume</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{averageVolume.toFixed(1)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Meetings per visible week</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
