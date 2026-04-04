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
      "Group meetings by attention level, momentum, and recent change so users don't have to invent the workflow themselves.",
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
    <section id="insights" className="py-12 sm:py-16 lg:py-24">
      <div className="shell-container">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          <div className="max-w-lg">
            <div className="section-kicker">Interface principles</div>
            <h2 className="display-title mt-4 text-3xl leading-tight text-foreground sm:mt-5 sm:text-4xl lg:text-5xl">
              A calmer dashboard with sharper hierarchy.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg">
              The redesign leans into an editorial control-room aesthetic:
              stronger typography, restrained density, richer surfaces, and a
              clearer path from signal to action.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="panel group rounded-2xl p-5 transition-transform hover:-translate-y-0.5 sm:rounded-[28px] sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/12 bg-primary/6 text-primary transition-colors group-hover:border-accent/25 group-hover:bg-accent/8 group-hover:text-accent sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground sm:mt-5 sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3">
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
