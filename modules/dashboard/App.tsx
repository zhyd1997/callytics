import { Bell, ChevronDown, Clock3, Search, Sparkles } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { MeetingCollection, MeetingRecord } from "@/lib/types/meeting"

interface DashboardAppProps {
  readonly initialMeetings?: MeetingCollection
}

type InsightMetric = {
  readonly label: string
  readonly value: string
  readonly trend: string
}

const OVERVIEW_METRICS: readonly InsightMetric[] = [
  { label: "Meetings this week", value: "28", trend: "+9% vs prior week" },
  { label: "Action items open", value: "41", trend: "12 due in 48 hours" },
  { label: "Decisions captured", value: "19", trend: "+4 from last week" },
  { label: "Avg meeting duration", value: "46 min", trend: "Down 3 min" },
  { label: "Follow-ups pending", value: "13", trend: "5 blocked by dependencies" },
] as const

const recurringTopics = [
  { topic: "Pricing strategy", count: 17, share: 88 },
  { topic: "Enterprise onboarding", count: 14, share: 74 },
  { topic: "API reliability", count: 11, share: 61 },
  { topic: "Q2 staffing", count: 9, share: 48 },
] as const

const participationTrend = [62, 66, 70, 68, 74, 77, 79] as const
const energyTrend = [52, 56, 63, 61, 66, 64, 69] as const

const decisionsThisWeek = [
  "Approved pilot with Northbank for usage-based pricing",
  "Moved customer migration deadline to April 22",
  "Adopted transcript confidence threshold at 92%",
  "Consolidated weekly product + sales decision review",
] as const

const unresolvedPoints = [
  "Legal review pending for data residency request",
  "Open question on recording retention beyond 180 days",
  "Owner still missing for CRM sync failure analysis",
] as const

const activeSpeakers = [
  { name: "Nora Patel", role: "Product", share: 22 },
  { name: "Jules Carter", role: "Sales", share: 17 },
  { name: "Mina Okafor", role: "Ops", share: 15 },
  { name: "Eli Moreno", role: "Success", share: 13 },
] as const

const frequentEntities = [
  "Northbank",
  "Mercury Rail",
  "Project Lantern",
  "Workspace migration",
  "Security questionnaire",
] as const

const knowledgePatterns = [
  {
    title: "Decision velocity rises when pre-reads are circulated ≥24h before meetings",
    scope: "Seen in 12 product and GTM reviews",
  },
  {
    title: "Action item closure drops in cross-functional meetings with >9 attendees",
    scope: "Observed across Product, Sales, and Support",
  },
  {
    title: "Sentiment recovers by +14 points when follow-up owners are named during live calls",
    scope: "Pattern consistent over last 6 weeks",
  },
] as const

const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Date TBD"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

const getMeetingRows = (meetings: MeetingCollection | undefined): readonly MeetingRecord[] => {
  if (!meetings || meetings.length === 0) {
    return []
  }

  return [...meetings]
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .slice(0, 7)
}

export const App = ({ initialMeetings }: DashboardAppProps) => {
  const meetingRows = getMeetingRows(initialMeetings)

  const selectedMeeting = meetingRows[0]

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="hidden min-h-screen w-72 border-r border-zinc-300/80 bg-zinc-50/90 p-6 lg:block">
          <p className="font-serif text-2xl tracking-tight">Callytics</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Meeting intelligence</p>

          <nav className="mt-10 space-y-2 text-sm">
            {[
              "Overview",
              "Meetings",
              "Insights",
              "Decisions",
              "Knowledge",
              "Teams",
              "Reports",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left text-zinc-600 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900"
              >
                <span>{item}</span>
                {item === "Overview" ? <span className="text-zinc-400">•</span> : null}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-zinc-300/80 bg-white p-4 shadow-[0_12px_32px_rgba(24,24,27,0.06)]">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Knowledge snapshot</p>
            <p className="mt-3 font-serif text-lg leading-snug">
              3 recurring risks now linked across Product, Success, and Legal.
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-zinc-300/70 bg-zinc-100/90 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                Meridian Labs Workspace
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </button>

              <div className="relative min-w-[230px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  aria-label="Search meetings"
                  placeholder="Search transcript snippets, decisions, people..."
                  className="h-10 border-zinc-300 bg-white pl-9"
                />
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 bg-white"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-zinc-600" />
              </button>

              <Avatar className="h-10 w-10 border border-zinc-300">
                <AvatarFallback className="bg-zinc-900 text-xs font-semibold text-white">NP</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
            <section className="rounded-3xl border border-zinc-300/80 bg-white p-6 shadow-[0_14px_40px_rgba(24,24,27,0.06)] sm:p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Executive dashboard</p>
              <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                Meeting intelligence with editorial clarity.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">
                Structured insights across transcripts, notes, and recordings. Follow patterns, decisions, unresolved
                topics, and momentum without digging through raw calls.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {OVERVIEW_METRICS.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-zinc-300/80 bg-white p-4 shadow-[0_8px_22px_rgba(24,24,27,0.05)]"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{metric.label}</p>
                  <p className="mt-3 font-serif text-3xl tracking-tight">{metric.value}</p>
                  <p className="mt-2 text-xs text-zinc-500">{metric.trend}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)] xl:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-2xl">Top recurring topics</h2>
                  <Badge variant="outline" className="border-zinc-300 text-zinc-600">
                    Last 30 days
                  </Badge>
                </div>
                <div className="space-y-4">
                  {recurringTopics.map((topic) => (
                    <div key={topic.topic} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <p>{topic.topic}</p>
                        <p className="text-zinc-500">{topic.count} mentions</p>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-200">
                        <div className="h-2 rounded-full bg-zinc-800" style={{ width: `${topic.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)]">
                <h2 className="font-serif text-2xl">Decisions made this week</h2>
                <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                  {decisionsThisWeek.map((decision) => (
                    <li key={decision} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      {decision}
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-12">
              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)] xl:col-span-4">
                <h2 className="font-serif text-2xl">Unresolved discussion points</h2>
                <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                  {unresolvedPoints.map((point) => (
                    <li key={point} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)] xl:col-span-4">
                <h2 className="font-serif text-2xl">Team participation trend</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">Speaking share index</p>
                <div className="mt-5 flex h-36 items-end gap-2">
                  {participationTrend.map((value, index) => (
                    <div key={value} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-sm bg-zinc-800/90" style={{ height: `${value}%` }} />
                      <span className="text-[10px] text-zinc-500">W{index + 1}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)] xl:col-span-4">
                <h2 className="font-serif text-2xl">Sentiment / energy trend</h2>
                <div className="mt-4 space-y-3">
                  {energyTrend.map((value, index) => (
                    <div key={value} className="grid grid-cols-[40px_1fr_42px] items-center gap-3 text-xs">
                      <span className="text-zinc-500">W{index + 1}</span>
                      <div className="h-2 rounded-full bg-zinc-200">
                        <div className="h-2 rounded-full bg-zinc-700" style={{ width: `${value}%` }} />
                      </div>
                      <span className="text-right text-zinc-500">{value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)]">
                <h2 className="font-serif text-2xl">Most active speakers</h2>
                <ul className="mt-4 space-y-3">
                  {activeSpeakers.map((speaker) => (
                    <li key={speaker.name} className="rounded-xl border border-zinc-200 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{speaker.name}</p>
                        <p className="text-xs text-zinc-500">{speaker.share}%</p>
                      </div>
                      <p className="text-xs text-zinc-500">{speaker.role}</p>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)]">
                <h2 className="font-serif text-2xl">Frequently mentioned customers or projects</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {frequentEntities.map((entity) => (
                    <Badge key={entity} variant="outline" className="rounded-full border-zinc-300 bg-zinc-50 px-3 py-1 text-zinc-700">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </article>
            </section>

            <section className="overflow-hidden rounded-2xl border border-zinc-300/80 bg-white shadow-[0_8px_22px_rgba(24,24,27,0.05)]">
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="font-serif text-2xl">Meeting list</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Participants</th>
                      <th className="px-5 py-3 font-medium">Summary status</th>
                      <th className="px-5 py-3 font-medium">Action items</th>
                      <th className="px-5 py-3 font-medium">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetingRows.map((meeting) => (
                      <tr key={meeting.id} className="border-t border-zinc-200 align-top">
                        <td className="px-5 py-4">
                          <p className="font-medium text-zinc-800">{meeting.title}</p>
                        </td>
                        <td className="px-5 py-4 text-zinc-600">{formatDate(meeting.start)}</td>
                        <td className="px-5 py-4 text-zinc-600">{meeting.attendees.length + meeting.hosts.length}</td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className="border-zinc-300 bg-zinc-50 text-zinc-700">
                            {meeting.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-zinc-600">{Math.max(1, Math.round(meeting.duration / 15))}</td>
                        <td className="px-5 py-4 text-zinc-600">
                          {meeting.eventType?.slug ? `${meeting.eventType.slug}, transcript` : "meeting, transcript"}
                        </td>
                      </tr>
                    ))}
                    {meetingRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-zinc-500">
                          Connect meetings to populate this list.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-12">
              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)] xl:col-span-8">
                <h2 className="font-serif text-2xl">Meeting details</h2>
                <p className="mt-1 text-sm text-zinc-500">{selectedMeeting ? selectedMeeting.title : "No meeting selected"}</p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Summary</h3>
                      <p className="mt-2 text-sm text-zinc-700">
                        Team reviewed transcript reliability, customer onboarding blockers, and ownership for follow-up
                        actions before next steering meeting.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Key decisions</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-700">
                        <li>Ship automated insight digest every Monday.</li>
                        <li>Escalate unresolved legal topics to executive review.</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Action items</h3>
                      <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                        <li>• Mina: finalize sentiment calibration notes (Fri)</li>
                        <li>• Jules: align enterprise rollout messaging (Mon)</li>
                      </ul>
                    </section>
                  </div>

                  <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Themes</h3>
                      <p className="mt-2 text-sm text-zinc-700">Onboarding friction · Data governance · Decision ownership</p>
                    </section>
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Risks</h3>
                      <p className="mt-2 text-sm text-zinc-700">Delayed compliance response could block two enterprise renewals.</p>
                    </section>
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Follow-ups</h3>
                      <p className="mt-2 text-sm text-zinc-700">Next checkpoint set for March 31 with Product, Legal, and Sales leaders.</p>
                    </section>
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Transcript highlights</h3>
                      <p className="mt-2 text-sm text-zinc-700">
                        “We need a single owner for migration risk by end of day.”
                      </p>
                    </section>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-[0.16em] text-zinc-500">Searchable timeline</h3>
                    <Search className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="space-y-2 text-sm text-zinc-700">
                    <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> 00:08:21 — Decision framing on onboarding scope</p>
                    <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> 00:22:14 — Action item ownership clarified</p>
                    <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> 00:37:52 — Compliance risk escalated</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-[0_8px_22px_rgba(24,24,27,0.05)] xl:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl">Knowledge</h2>
                  <Sparkles className="h-4 w-4 text-zinc-500" />
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Aggregate recurring insights over time, linked by person, topic, team, and project.
                </p>

                <div className="mt-4 space-y-3">
                  {knowledgePatterns.map((pattern) => (
                    <article key={pattern.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-sm text-zinc-800">{pattern.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{pattern.scope}</p>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
