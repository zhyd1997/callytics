import dayjs from "dayjs"

import type { MeetingRecord } from "@/lib/types/meeting"

export type DashboardSegment = "all" | "attention" | "upcoming" | "completed"
export type DashboardRange = "7d" | "30d" | "90d" | "all"

export interface DashboardFiltersState {
  readonly segment: DashboardSegment
  readonly range: DashboardRange
  readonly status: string
  readonly host: string
  readonly eventType: string
  readonly query: string
}

const ATTENTION_STATUSES = new Set([
  "cancelled",
  "pending",
  "rejected",
  "unconfirmed",
])

const COMPLETED_STATUSES = new Set(["completed", "past"])

export const getEventTypeLabel = (meeting: MeetingRecord) => {
  if (meeting.eventType?.slug) {
    return meeting.eventType.slug.replace(/-/g, " ")
  }

  if (meeting.title) {
    return meeting.title
  }

  return "General"
}

export const getMeetingMoment = (meeting: MeetingRecord) => {
  if (meeting.status === "accepted" && dayjs(meeting.start).isAfter(dayjs())) {
    return "upcoming"
  }

  if (ATTENTION_STATUSES.has(meeting.status) || Boolean(meeting.reschedulingReason)) {
    return "attention"
  }

  if (COMPLETED_STATUSES.has(meeting.status) || dayjs(meeting.end).isBefore(dayjs())) {
    return "completed"
  }

  return "active"
}

export const filterMeetings = (
  meetings: readonly MeetingRecord[],
  filters: DashboardFiltersState
) => {
  const now = dayjs()
  const minDate =
    filters.range === "all"
      ? null
      : now.subtract(Number.parseInt(filters.range, 10), "day")

  const query = filters.query.trim().toLowerCase()

  return meetings.filter((meeting) => {
    const matchesRange = minDate ? dayjs(meeting.start).isAfter(minDate) : true
    const matchesSegment =
      filters.segment === "all"
        ? true
        : filters.segment === "upcoming"
          ? getMeetingMoment(meeting) === "upcoming"
          : filters.segment === "attention"
            ? getMeetingMoment(meeting) === "attention"
            : getMeetingMoment(meeting) === "completed"

    const matchesStatus =
      filters.status === "all" ? true : meeting.status === filters.status
    const matchesHost =
      filters.host === "all"
        ? true
        : meeting.hosts.some((host) => host.email === filters.host)
    const eventTypeLabel = getEventTypeLabel(meeting)
    const matchesEventType =
      filters.eventType === "all"
        ? true
        : eventTypeLabel.toLowerCase() === filters.eventType.toLowerCase()

    const matchesQuery =
      query.length === 0
        ? true
        : [
            meeting.title,
            meeting.description,
            eventTypeLabel,
            ...meeting.hosts.map((host) => host.name),
            ...meeting.attendees.map((attendee) => attendee.name),
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)

    return (
      matchesRange &&
      matchesSegment &&
      matchesStatus &&
      matchesHost &&
      matchesEventType &&
      matchesQuery
    )
  })
}

export const getDashboardPulse = (meetings: readonly MeetingRecord[]) => {
  const atRisk = meetings.filter((meeting) => {
    return ATTENTION_STATUSES.has(meeting.status) || Boolean(meeting.reschedulingReason)
  })

  const cancelled = meetings.filter((meeting) => meeting.status === "cancelled")
  const accepted = meetings.filter((meeting) => meeting.status === "accepted")

  const hostCounts = new Map<string, number>()
  const slotCounts = new Map<string, number>()
  const eventTypeCounts = new Map<string, number>()

  meetings.forEach((meeting) => {
    meeting.hosts.forEach((host) => {
      hostCounts.set(host.name, (hostCounts.get(host.name) ?? 0) + 1)
    })

    const startTime = dayjs(meeting.start).format("h:mm A")
    slotCounts.set(startTime, (slotCounts.get(startTime) ?? 0) + 1)

    const eventType = getEventTypeLabel(meeting)
    eventTypeCounts.set(eventType, (eventTypeCounts.get(eventType) ?? 0) + 1)
  })

  const busiestHost = [...hostCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const hottestSlot = [...slotCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const topEventType = [...eventTypeCounts.entries()].sort((a, b) => b[1] - a[1])[0]

  const cancellationRate =
    meetings.length > 0 ? Math.round((cancelled.length / meetings.length) * 100) : 0
  const acceptanceRate =
    meetings.length > 0 ? Math.round((accepted.length / meetings.length) * 100) : 0

  return {
    totalMeetings: meetings.length,
    atRiskCount: atRisk.length,
    cancellationRate,
    acceptanceRate,
    busiestHost,
    hottestSlot,
    topEventType,
  }
}
