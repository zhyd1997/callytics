"use client"

import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react"
import { motion } from "motion/react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MeetingRecord } from "@/lib/types/meeting"

import { WidgetEmptyState } from "./WidgetEmptyState"

interface MeetingStatusChartProps {
  readonly data: readonly MeetingRecord[]
}

const STATUS_META: Record<
  string,
  {
    readonly tone: string
    readonly track: string
    readonly icon: typeof CheckCircle2
  }
> = {
  accepted: {
    tone: "bg-chart-5",
    track: "bg-chart-5/12",
    icon: CheckCircle2,
  },
  completed: {
    tone: "bg-accent",
    track: "bg-accent/16",
    icon: CheckCircle2,
  },
  cancelled: {
    tone: "bg-rose-500",
    track: "bg-rose-500/12",
    icon: XCircle,
  },
  pending: {
    tone: "bg-chart-2",
    track: "bg-chart-2/12",
    icon: Clock3,
  },
  rejected: {
    tone: "bg-chart-4",
    track: "bg-chart-4/12",
    icon: AlertTriangle,
  },
  unconfirmed: {
    tone: "bg-slate-500",
    track: "bg-slate-500/12",
    icon: AlertTriangle,
  },
}

export function MeetingStatusChart({ data }: MeetingStatusChartProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-tertiary">
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
          <CardDescription>No meeting statuses to compare in the current view.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <WidgetEmptyState
            title="Nothing to compare yet"
            description="Once bookings match the current filters, status share and workflow stability will appear here."
          />
        </CardContent>
      </Card>
    )
  }

  const statusCounts = data.reduce<Record<string, number>>((acc, meeting) => {
    acc[meeting.status] = (acc[meeting.status] || 0) + 1
    return acc
  }, {})

  const rows = Object.entries(statusCounts)
    .map(([status, count]) => ({
      status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: Math.round((count / data.length) * 100),
      meta: STATUS_META[status] ?? {
        tone: "bg-[color:var(--color-chart-3)]",
        track: "bg-[color:color-mix(in_oklab,var(--color-chart-3)_12%,transparent)]",
        icon: Clock3,
      },
    }))
    .sort((a, b) => b.count - a.count)

  const stableShare = rows
    .filter((row) => row.status === "accepted" || row.status === "completed")
    .reduce((total, row) => total + row.percentage, 0)

  return (
    <Card className="surface-tertiary h-full">
      <CardHeader>
        <CardTitle>Status Breakdown</CardTitle>
        <CardDescription>
          A ranked view is easier to scan than a pie when you are checking workflow stability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-2xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Stable share
              </p>
              <p className="mt-2 text-2xl font-semibold">{stableShare}%</p>
            </div>
            <p className="max-w-xs text-right text-sm leading-6 text-muted-foreground">
              Accepted and completed meetings currently make up most of the visible workload.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => {
            const Icon = row.meta.icon

            return (
              <motion.div
                key={row.status}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.08 }}
                className="rounded-2xl border border-border/70 bg-background/75 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`rounded-xl p-2 ${row.meta.track}`}>
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{row.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {row.count} meetings in the current slice
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">{row.percentage}%</p>
                </div>

                <div className={`mt-4 h-2 overflow-hidden rounded-full ${row.meta.track}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.percentage}%` }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className={`h-full rounded-full ${row.meta.tone}`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
