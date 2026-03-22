"use client"

import { BarChart3, CalendarClock, Layers3, ShieldCheck, Sparkles, Users } from "lucide-react"
import { motion } from "motion/react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure connection",
    description:
      "Authenticate once with Cal.com OAuth and keep the data access scoped to the signed-in workspace.",
  },
  {
    icon: Layers3,
    title: "Opinionated triage",
    description:
      "Group meetings by attention level, momentum, and recent change so users don’t have to invent the workflow themselves.",
  },
  {
    icon: BarChart3,
    title: "Better explanations",
    description:
      "Translate raw bookings into metrics leaders can discuss in planning, revenue, or operations reviews.",
  },
  {
    icon: CalendarClock,
    title: "Timing intelligence",
    description:
      "See which windows cluster demand so teams can fix bottlenecks before they become a scheduling habit.",
  },
  {
    icon: Users,
    title: "Host workload clarity",
    description:
      "Expose uneven distribution quickly, especially when one host quietly becomes the default fallback.",
  },
  {
    icon: Sparkles,
    title: "Presentation-ready UX",
    description:
      "Use a product that already feels composed enough for screenshots, demos, and stakeholder updates.",
  },
] as const

export function Features() {
  return (
    <section id="insights" className="py-16 sm:py-22 lg:py-28">
      <div className="shell-container">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="max-w-lg">
            <div className="section-kicker">Interface principles</div>
            <h2 className="display-title mt-5 text-4xl leading-tight text-foreground sm:text-5xl">
              A calmer dashboard with sharper hierarchy.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              The redesign leans into an editorial control-room aesthetic:
              stronger typography, restrained density, richer surfaces, and a
              clearer path from signal to action.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.42, delay: index * 0.06 }}
                  className="panel group rounded-[28px] p-6 transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/14 bg-primary/8 text-primary transition-colors group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
