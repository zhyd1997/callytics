"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CalendarClock, Layers3, ShieldCheck, Sparkles, Users } from "lucide-react"
import { motion } from "motion/react"

export function Features() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Connect",
      description: "Authenticate with Cal.com through OAuth and keep access scoped to the signed-in workspace.",
    },
    {
      icon: Layers3,
      title: "Triage",
      description: "Group meetings by attention level so operators can review risk, upcoming work, and recent changes separately.",
    },
    {
      icon: BarChart3,
      title: "Explain",
      description: "Translate raw booking activity into decision-oriented metrics the team can use in planning and stakeholder updates.",
    },
    {
      icon: CalendarClock,
      title: "Control Time",
      description: "See when demand clusters so teams can rebalance scheduling windows before bottlenecks appear.",
    },
    {
      icon: Users,
      title: "Watch Host Load",
      description: "Identify which hosts carry the calendar and where uneven distribution starts to hurt response quality.",
    },
    {
      icon: Sparkles,
      title: "Tell the Story",
      description: "Use one polished review surface instead of stitching together screenshots and spreadsheet pivots.",
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
            A clearer flow from raw bookings to weekly decisions
          </h2>
          <p className="mt-3 text-pretty text-base text-muted-foreground sm:mt-4 sm:text-lg">
            The product should guide users from connection to action, not leave them inside an undifferentiated grid of metrics.
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
                <Card className="surface-secondary h-full transition-colors hover:bg-card">
                  <CardHeader>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10"
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
