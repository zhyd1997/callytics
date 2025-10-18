"use client"

import { motion } from "motion/react"

export function Stats() {
  const stats = [
    { label: "Faster insights", value: "10x", description: "compared to manual tracking" },
    { label: "Time saved", value: "5hrs", description: "per week on average" },
    { label: "Data accuracy", value: "99.9%", description: "real-time sync with Cal.com" },
    { label: "Early users", value: "500+", description: "on the waitlist" },
  ]

  return (
    <section className="border-b border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</div>
              <div className="mt-1 text-xs text-muted-foreground/70">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
