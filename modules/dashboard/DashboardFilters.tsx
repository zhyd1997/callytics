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
  "h-10 w-full rounded-xl border border-border/50 bg-background/70 px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"

export const DashboardFilters = ({
  filters,
  onFiltersChange,
  hostOptions,
  eventTypeOptions,
  statusOptions,
  savedViews,
}: DashboardFiltersProps) => {
  return (
    <section className="surface-secondary grid gap-3 rounded-2xl p-4 sm:gap-4 sm:rounded-[28px] sm:p-5">
      <div className="flex flex-col gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <SlidersHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Control room
          </div>
          <p className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
            Tune the dashboard by timeframe, host, event type, and workflow state.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {RANGES.map((range) => (
            <Button
              key={range.value}
              variant={filters.range === range.value ? "default" : "outline"}
              size="sm"
              className={
                filters.range === range.value
                  ? "h-8 rounded-full text-xs sm:text-sm"
                  : "h-8 rounded-full border-border/50 bg-background/60 text-xs sm:text-sm"
              }
              onClick={() => onFiltersChange({ ...filters, range: range.value })}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Saved views – 2-col grid on mobile, 4-col on lg */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {savedViews.map((view) => {
          const isActive =
            JSON.stringify(filters) === JSON.stringify(view.filters)

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onFiltersChange(view.filters)}
              className={`rounded-xl border p-3 text-left transition sm:rounded-[24px] sm:p-4 ${
                isActive
                  ? "border-primary/40 bg-primary/8 shadow-sm"
                  : "border-border/50 bg-background/60 hover:border-border hover:bg-card/70"
              }`}
            >
              <p className="text-xs font-medium text-foreground sm:text-sm">{view.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2 sm:mt-1 sm:text-sm sm:leading-6">
                {view.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Segments */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {SEGMENTS.map((segment) => (
          <button
            key={segment.value}
            type="button"
            onClick={() => onFiltersChange({ ...filters, segment: segment.value })}
            className={`rounded-full border px-2.5 py-1.5 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
              filters.segment === segment.value
                ? "border-primary/50 bg-primary/10 text-foreground shadow-sm"
                : "border-border/50 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {/* Search + dropdowns: stacked on mobile */}
      <div className="grid gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-1">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(event) =>
              onFiltersChange({ ...filters, query: event.target.value })
            }
            placeholder="Search titles, hosts..."
            className="h-10 rounded-xl border-border/50 bg-background/70 pl-9 text-sm"
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

      {/* Active filter badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:gap-2">
        <span>Active:</span>
        <Badge variant="outline" className="rounded-full border-border/50 bg-background/60 text-[0.65rem]">
          {filters.range === "all" ? "all time" : filters.range}
        </Badge>
        {filters.segment !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/50 bg-background/60 text-[0.65rem]">
            {filters.segment}
          </Badge>
        ) : null}
        {filters.host !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/50 bg-background/60 text-[0.65rem]">
            host scoped
          </Badge>
        ) : null}
        {filters.eventType !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/50 bg-background/60 text-[0.65rem]">
            event type scoped
          </Badge>
        ) : null}
        {filters.status !== "all" ? (
          <Badge variant="outline" className="rounded-full border-border/50 bg-background/60 text-[0.65rem]">
            status scoped
          </Badge>
        ) : null}
      </div>
    </section>
  )
}
