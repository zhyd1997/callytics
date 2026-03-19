"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Users,
} from "lucide-react"
import { motion } from "motion/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import type { MeetingRecord } from "@/lib/types/meeting"
import { formatRelativeDate, formatTime, isFutureDate } from "@/lib/utils/date"

import { MeetingDetails } from "./MeetingDetails"
import { WidgetEmptyState } from "./WidgetEmptyState"
import { getMeetingMoment } from "./utils/insights"

interface RecentMeetingsProps {
  readonly data: readonly MeetingRecord[]
}

const getBadgeProps = (status: string) => {
  switch (status) {
    case "accepted":
      return {
        variant: "outline" as const,
        className:
          "shrink-0 rounded-full border-chart-5/30 bg-chart-5/12 text-chart-5",
      }
    case "cancelled":
      return {
        variant: "outline" as const,
        className:
          "shrink-0 rounded-full border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
      }
    case "pending":
    case "unconfirmed":
      return {
        variant: "outline" as const,
        className:
          "shrink-0 rounded-full border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      }
    case "completed":
      return {
        variant: "outline" as const,
        className:
          "shrink-0 rounded-full border-accent/30 bg-accent/14 text-accent-foreground",
      }
    default:
      return {
        variant: "outline" as const,
        className:
          "shrink-0 rounded-full border-border/70 bg-secondary/70 text-muted-foreground",
      }
  }
}

const getSections = (data: readonly MeetingRecord[]) => {
  const validMeetings = data.filter((meeting) => {
    return !(meeting.status === "completed" && isFutureDate(meeting.start))
  })

  const sorted = [...validMeetings].sort((a, b) => {
    const aTimestamp = dayjs(a.updatedAt ?? a.start).valueOf()
    const bTimestamp = dayjs(b.updatedAt ?? b.start).valueOf()
    return bTimestamp - aTimestamp
  })

  return [
    {
      title: "Needs Attention",
      description: "Unstable bookings, cancellations, and schedule changes that need follow-up.",
      icon: AlertTriangle,
      data: sorted.filter((meeting) => getMeetingMoment(meeting) === "attention").slice(0, 3),
    },
    {
      title: "Upcoming",
      description: "Accepted meetings coming up soon.",
      icon: Calendar,
      data: sorted.filter((meeting) => getMeetingMoment(meeting) === "upcoming").slice(0, 3),
    },
    {
      title: "Recently Changed",
      description: "The latest booking changes across the visible slice.",
      icon: Clock,
      data: sorted
        .filter((meeting) => getMeetingMoment(meeting) !== "attention")
        .slice(0, 4),
    },
  ]
}

export function RecentMeetings({ data }: RecentMeetingsProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const sections = getSections(data)

  const copyPrimaryAttendee = async (meeting: MeetingRecord) => {
    const attendee = meeting.attendees[0]?.email

    if (!attendee) {
      toast.error("No attendee email available for this meeting.")
      return
    }

    try {
      await navigator.clipboard.writeText(attendee)
      toast.success("Primary attendee email copied.")
    } catch (error) {
      console.error("Failed to copy attendee email", error)
      toast.error("Could not copy attendee email.")
    }
  }

  return (
    <>
      <Card className="surface-secondary h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Meetings
              </CardTitle>
              <CardDescription>
                Grouped into the buckets operators usually review first.
              </CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full border-border/70 bg-background/70">
              {data.length} visible
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {data.length === 0 ? (
            <WidgetEmptyState
              title="No meetings in this slice"
              description="Broaden the filters to repopulate the triage queues."
            />
          ) : (
            sections.map((section, index) => {
              const Icon = section.icon

              if (section.data.length === 0) {
                return (
                  <div
                    key={section.title}
                    className="rounded-2xl border border-dashed border-border/80 bg-background/60 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-border/70 bg-secondary/70 p-2 text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      No meetings currently fall into this bucket.
                    </p>
                  </div>
                )
              }

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.08 }}
                  className="rounded-3xl border border-border/80 bg-background/65 p-4"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-xl border border-border/70 bg-secondary/70 p-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section.data.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedMeeting(meeting)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                setSelectedMeeting(meeting)
                              }
                            }}
                            className="min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="mb-2 flex items-start gap-2">
                              <h3 className="line-clamp-2 text-sm font-medium sm:text-base">
                                {meeting.title}
                              </h3>
                              <Badge {...getBadgeProps(meeting.status)}>
                                {meeting.reschedulingReason ? "rescheduled" : meeting.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatRelativeDate(meeting.start)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(meeting.start)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meeting.hosts[0]?.name ?? "Unknown host"}
                              </span>
                            </div>

                            {meeting.reschedulingReason || meeting.cancellationReason ? (
                              <p className="mt-2 line-clamp-2 text-xs italic text-muted-foreground">
                                {meeting.reschedulingReason
                                  ? `Rescheduled: ${meeting.reschedulingReason}`
                                  : `Cancelled: ${meeting.cancellationReason}`}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {meeting.meetingUrl ? (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-full border-border/70 bg-background/70"
                              >
                                <a
                                  href={meeting.meetingUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Open
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-muted-foreground"
                              onClick={() => copyPrimaryAttendee(meeting)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Copy attendee
                            </Button>
                            <button
                              type="button"
                              onClick={() => setSelectedMeeting(meeting)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                            >
                              Details
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })
          )}
        </CardContent>
      </Card>

      {isMobile ? (
        <Drawer open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Meeting Details</DrawerTitle>
            </DrawerHeader>
            <div className="max-h-[80vh] overflow-y-auto px-4 pb-8">
              {selectedMeeting ? <MeetingDetails meeting={selectedMeeting} /> : null}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Meeting Details</DialogTitle>
            </DialogHeader>
            {selectedMeeting ? <MeetingDetails meeting={selectedMeeting} /> : null}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
