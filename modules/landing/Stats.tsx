"use client"

import { motion } from "motion/react"

export function Stats() {
  const stats = [
    { label: "Review latency", value: "-62%", description: "less time spent assembling weekly booking reports" },
    { label: "Time-to-insight", value: "<5m", description: "from login to actionable pulse" },
    { label: "Operator coverage", value: "1 view", description: "for host load, status drift, and timing patterns" },
    { label: "Export readiness", value: "100%", description: "presentation-friendly metrics without cleanup" },
  ]

  return (
    <section className="border-b border-border bg-card/35">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Built for weekly review rituals
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            The first screen should answer what changed, what is risky, and who owns it.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="surface-secondary flex flex-col rounded-[28px] p-6 text-left"
            >
              <div className="text-3xl font-semibold text-foreground sm:text-4xl">{stat.value}</div>
              <div className="mt-3 text-sm font-medium text-foreground">{stat.label}</div>
              <div className="mt-2 text-sm leading-6 text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
