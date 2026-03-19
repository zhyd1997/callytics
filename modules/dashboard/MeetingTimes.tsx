"use client"

import dayjs from "dayjs"
import { Clock, Coffee, Moon, Sunrise } from "lucide-react"
import { motion } from "motion/react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createTransition, fadeInFromBottom } from "@/lib/constants/animations"
import type { MeetingRecord } from "@/lib/types/meeting"

import { AnimatedNumber } from "./AnimatedNumber"
import { WidgetEmptyState } from "./WidgetEmptyState"

interface MeetingTimesProps {
  readonly data: readonly MeetingRecord[]
}

type TimeCategory = "morning" | "afternoon" | "evening" | "night"

interface TimeCategoryData {
  readonly label: string
  readonly timeRange: string
  readonly count: number
  readonly percentage: number
  readonly icon: typeof Sunrise
  readonly iconColor: string
  readonly iconBg: string
  readonly progressClassName: string
}

const getTimeCategory = (startTime: string): TimeCategory => {
  const hour = dayjs(startTime).hour()

  if (hour >= 6 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

export function MeetingTimes({ data }: MeetingTimesProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-tertiary h-full">
        <CardHeader>
          <CardTitle>Meeting Times</CardTitle>
          <CardDescription>Time-of-day concentration appears once bookings are visible.</CardDescription>
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

  const timeCategories = data.reduce((acc, meeting) => {
    const category = getTimeCategory(meeting.start)
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<TimeCategory, number>)

  const totalMeetings = data.length

  const categoryData: Record<TimeCategory, TimeCategoryData> = {
    morning: {
      label: "Morning",
      timeRange: "6AM - 12PM",
      count: timeCategories.morning || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.morning || 0) / totalMeetings) * 100) : 0,
      icon: Sunrise,
      iconColor: "text-accent-foreground",
      iconBg: "bg-accent/20 border border-accent/28",
      progressClassName: "bg-accent",
    },
    afternoon: {
      label: "Afternoon",
      timeRange: "12PM - 5PM",
      count: timeCategories.afternoon || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.afternoon || 0) / totalMeetings) * 100) : 0,
      icon: Coffee,
      iconColor: "text-chart-2",
      iconBg: "bg-chart-2/14 border border-chart-2/24",
      progressClassName: "bg-chart-2",
    },
    evening: {
      label: "Evening",
      timeRange: "5PM - 9PM",
      count: timeCategories.evening || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.evening || 0) / totalMeetings) * 100) : 0,
      icon: Moon,
      iconColor: "text-chart-3",
      iconBg: "bg-chart-3/14 border border-chart-3/24",
      progressClassName: "bg-chart-3",
    },
    night: {
      label: "Night",
      timeRange: "9PM - 6AM",
      count: timeCategories.night || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.night || 0) / totalMeetings) * 100) : 0,
      icon: Clock,
      iconColor: "text-slate-600 dark:text-slate-300",
      iconBg: "bg-slate-500/10 border border-slate-500/20",
      progressClassName: "bg-slate-500",
    },
  }

  const categories: TimeCategory[] = ["morning", "afternoon", "evening", "night"]

  return (
    <Card className="surface-tertiary h-full">
      <CardHeader>
        <CardTitle>Meeting Times</CardTitle>
        <CardDescription>
          Distribution across the day so teams can spot timing concentration quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => {
            const categoryInfo = categoryData[category]
            const Icon = categoryInfo.icon

            return (
              <motion.div
                key={category}
                variants={fadeInFromBottom}
                initial="initial"
                animate="animate"
                transition={createTransition(index * 0.1)}
                className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-3"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryInfo.iconBg}`}>
                  <Icon className={`h-5 w-5 ${categoryInfo.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{categoryInfo.label}</p>
                      <p className="text-xs text-muted-foreground">{categoryInfo.timeRange}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-sm sm:text-base">
                        <AnimatedNumber value={categoryInfo.count} duration={1.5} />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <AnimatedNumber value={categoryInfo.percentage} duration={1.5} />%
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${categoryInfo.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full rounded-full ${categoryInfo.progressClassName}`}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
