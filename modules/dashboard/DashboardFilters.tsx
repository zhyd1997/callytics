"use client"

import { Search, SlidersHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type {
  DashboardFiltersState,
  DashboardRange,
  DashboardSegment,
} from "./utils/insights"

interface FilterOption {
  readonly label: string
  readonly value: string
}

interface DashboardFiltersProps {
  readonly filters: DashboardFiltersState
  readonly onFiltersChange: (next: DashboardFiltersState) => void
  readonly hostOptions: readonly FilterOption[]
  readonly eventTypeOptions: readonly FilterOption[]
  readonly statusOptions: readonly FilterOption[]
  readonly savedViews: readonly {
    id: string
    label: string
    description: string
    filters: DashboardFiltersState
  }[]
}

const SEGMENTS: readonly { label: string; value: DashboardSegment }[] = [
  { label: "All activity", value: "all" },
  { label: "Needs attention", value: "attention" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
]

const RANGES: readonly { label: string; value: DashboardRange }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "All time", value: "all" },
]

const selectClassName =
  "h-10 rounded-xl border border-border/70 bg-background/80 px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"

export const DashboardFilters = ({
  filters,
  onFiltersChange,
  hostOptions,
  eventTypeOptions,
  statusOptions,
  savedViews,
}: DashboardFiltersProps) => {
  return (
    <section className="surface-secondary grid gap-4 rounded-[28px] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Control room
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Tune the dashboard by timeframe, host, event type, and workflow state.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RANGES.map((range) => (
            <Button
              key={range.value}
              variant={filters.range === range.value ? "default" : "outline"}
              size="sm"
              className={
                filters.range === range.value
                  ? "rounded-full"
                  : "rounded-full border-border/70 bg-background/70"
              }
              onClick={() => onFiltersChange({ ...filters, range: range.value })}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {savedViews.map((view) => {
          const isActive =
            JSON.stringify(filters) === JSON.stringify(view.filters)

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onFiltersChange(view.filters)}
              className={`rounded-[24px] border p-4 text-left transition ${
                isActive
                  ? "border-primary/50 bg-primary/10 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  : "border-border/70 bg-background/70 hover:border-border hover:bg-card/80"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{view.label}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {view.description}
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {SEGMENTS.map((segment) => (
          <button
            key={segment.value}
            type="button"
            onClick={() => onFiltersChange({ ...filters, segment: segment.value })}
            className={`rounded-full border px-3 py-2 text-sm transition ${
              filters.segment === segment.value
                ? "border-primary/60 bg-primary/12 text-foreground shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                : "border-border/70 bg-background/70 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {segment.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(event) =>
              onFiltersChange({ ...filters, query: event.target.value })
            }
            placeholder="Search titles, hosts, attendees..."
            className="h-10 rounded-xl border-border/70 bg-background/80 pl-9"
          />
        </label>

        <select
          className={selectClassName}
          value={filters.host}
          onChange={(event) =>
            onFiltersChange({ ...filters, host: event.target.value })
          }
        >
          {hostOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClassName}
          value={filters.eventType}
          onChange={(event) =>
            onFiltersChange({ ...filters, eventType: event.target.value })
          }
        >
          {eventTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClassName}
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({ ...filters, status: event.target.value })
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Active filters:</span>
        <Badge variant="outline" className="rounded-full border-border/70 bg-background/70">
          {filters.range === "all" ? "all time" : filters.range}
        </Badge>
        {filters.segment !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/70 bg-background/70">
            {filters.segment}
          </Badge>
        ) : null}
        {filters.host !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/70 bg-background/70">
            host scoped
          </Badge>
        ) : null}
        {filters.eventType !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/70 bg-background/70">
            event type scoped
          </Badge>
        ) : null}
        {filters.status !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/70 bg-background/70">
            status scoped
          </Badge>
        ) : null}
      </div>
    </section>
  )
}
