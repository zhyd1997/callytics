"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, Users, Zap, TrendingUp, PieChart } from "lucide-react"
import { motion } from "motion/react"

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Booking Analytics",
      description: "Track booking trends, conversion rates, and popular time slots with beautiful visualizations.",
    },
    {
      icon: Calendar,
      title: "Event Type Insights",
      description: "Understand which event types perform best and optimize your scheduling strategy.",
    },
    {
      icon: Users,
      title: "Workspace Performance",
      description: "Monitor team productivity and individual performance across your entire workspace.",
    },
    {
      icon: TrendingUp,
      title: "Growth Metrics",
      description: "Track your growth over time with detailed reports and forecasting capabilities.",
    },
    {
      icon: PieChart,
      title: "Custom Reports",
      description: "Create custom dashboards tailored to your specific business needs and KPIs.",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Automatic synchronization with Cal.com ensures your data is always up-to-date.",
    },
  ]

  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Everything you need to understand your bookings
          </h2>
          <p className="mt-3 text-pretty text-base text-muted-foreground sm:mt-4 sm:text-lg">
            Powerful analytics features designed specifically for Cal.com users who want deeper insights.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-border bg-card/50 transition-colors hover:bg-card">
                  <CardHeader>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10"
                    >
                      <Icon className="h-6 w-6 text-accent" />
                    </motion.div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-muted-foreground sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
