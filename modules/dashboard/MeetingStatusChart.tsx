"use client"

import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react"
import { motion } from "motion/react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MeetingRecord } from "@/lib/types/meeting"

import { WidgetEmptyState } from "./WidgetEmptyState"

interface MeetingStatusChartProps {
  readonly data: readonly MeetingRecord[]
}

const STABLE_STATUSES = new Set(["accepted", "completed", "past"])
const ATTENTION_STATUSES = new Set(["cancelled", "pending", "rejected", "unconfirmed"])

const STATUS_META: Record<
  string,
  {
    readonly label: string
    readonly tone: string
    readonly track: string
    readonly icon: typeof CheckCircle2
  }
> = {
  accepted: {
    label: "Accepted",
    tone: "bg-chart-5",
    track: "bg-chart-5/12",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    tone: "bg-accent",
    track: "bg-accent/16",
    icon: CheckCircle2,
  },
  past: {
    label: "Past",
    tone: "bg-accent",
    track: "bg-accent/16",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-rose-500",
    track: "bg-rose-500/12",
    icon: XCircle,
  },
  pending: {
    label: "Pending",
    tone: "bg-chart-2",
    track: "bg-chart-2/12",
    icon: Clock3,
  },
  rejected: {
    label: "Rejected",
    tone: "bg-chart-4",
    track: "bg-chart-4/12",
    icon: AlertTriangle,
  },
  unconfirmed: {
    label: "Unconfirmed",
    tone: "bg-slate-500",
    track: "bg-slate-500/12",
    icon: AlertTriangle,
  },
}

const getStatusMeta = (status: string) => {
  return (
    STATUS_META[status] ?? {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      tone: "bg-primary",
      track: "bg-primary/12",
      icon: Clock3,
    }
  )
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
            description="Once bookings match the current filters, status pressure and workflow stability will appear here."
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
      count,
      percentage: Math.round((count / data.length) * 100),
      meta: getStatusMeta(status),
    }))
    .sort((a, b) => {
      const aAttention = ATTENTION_STATUSES.has(a.status) ? 1 : 0
      const bAttention = ATTENTION_STATUSES.has(b.status) ? 1 : 0

      if (bAttention !== aAttention) {
        return bAttention - aAttention
      }

      return b.count - a.count
    })

  const stableCount = rows
    .filter((row) => STABLE_STATUSES.has(row.status))
    .reduce((total, row) => total + row.count, 0)
  const attentionCount = rows
    .filter((row) => ATTENTION_STATUSES.has(row.status))
    .reduce((total, row) => total + row.count, 0)
  const otherCount = Math.max(data.length - stableCount - attentionCount, 0)

  const stableShare = Math.round((stableCount / data.length) * 100)
  const attentionShare = Math.round((attentionCount / data.length) * 100)
  const otherShare = Math.max(100 - stableShare - attentionShare, 0)

  const dominantAttentionStatus = rows.find((row) => ATTENTION_STATUSES.has(row.status))

  return (
    <Card className="surface-tertiary h-full">
      <CardHeader>
        <CardTitle>Status Pressure</CardTitle>
        <CardDescription>
          Split the current slice into stable work, active risk, and leftover states before drilling into details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-border/50 bg-background/70 p-4 sm:rounded-2xl sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Workflow pressure
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{attentionShare}%</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {dominantAttentionStatus
                  ? `${dominantAttentionStatus.meta.label} is the largest unstable state in the current slice.`
                  : "The visible workload is mostly stable right now."}
              </p>
            </div>
            <div className="grid gap-2 text-right">
              <div className="rounded-2xl border border-rose-500/18 bg-rose-500/8 px-3 py-2">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  At risk
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{attentionCount}</p>
              </div>
              <div className="rounded-2xl border border-chart-5/18 bg-chart-5/8 px-3 py-2">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Stable
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{stableCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-border/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${attentionShare}%` }}
              transition={{ duration: 0.45 }}
              className="h-full bg-rose-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stableShare}%` }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="h-full -mt-3 bg-chart-5"
              style={{ marginLeft: `${attentionShare}%` }}
            />
            {otherShare > 0 ? (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${otherShare}%` }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="h-full -mt-3 bg-slate-400/70"
                style={{ marginLeft: `${attentionShare + stableShare}%` }}
              />
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-rose-500/14 bg-rose-500/6 p-3">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                At risk
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">{attentionShare}%</p>
              <p className="text-sm text-muted-foreground">{attentionCount} bookings</p>
            </div>
            <div className="rounded-2xl border border-chart-5/14 bg-chart-5/6 p-3">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Stable
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">{stableShare}%</p>
              <p className="text-sm text-muted-foreground">{stableCount} bookings</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-3">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Other
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">{otherShare}%</p>
              <p className="text-sm text-muted-foreground">{otherCount} bookings</p>
            </div>
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
                transition={{ duration: 0.25, delay: index * 0.06 }}
                className="rounded-2xl border border-border/70 bg-background/75 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`rounded-xl p-2 ${row.meta.track}`}>
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{row.meta.label}</p>
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
                    transition={{ duration: 0.45, delay: index * 0.06 }}
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
