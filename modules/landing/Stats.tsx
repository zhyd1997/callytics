"use client"

import { motion } from "motion/react"

const OUTCOMES = [
  {
    title: "Signal-first review flow",
    value: "03",
    detail: "Top priorities surfaced before the team opens raw meeting lists.",
  },
  {
    title: "Booking stability snapshot",
    value: "74%",
    detail: "Accepted bookings benchmarked against cancellations and pending drift.",
  },
  {
    title: "Host capacity visibility",
    value: "1 view",
    detail: "See who carries the workload and where uneven scheduling starts to show.",
  },
  {
    title: "Stakeholder-ready language",
    value: "0",
    detail: "Extra spreadsheet cleanup steps needed before weekly reporting.",
  },
] as const

export function Stats() {
  return (
    <section id="product" className="border-b border-border/60 py-16 sm:py-20">
      <div className="shell-container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-xl">
            <div className="section-kicker">What the first screen should answer</div>
            <h2 className="display-title mt-5 text-4xl leading-tight text-foreground sm:text-5xl">
              What changed, what needs attention, and who owns the response.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            The product experience is designed around meeting operations, not raw
            database fields. The opening view makes weekly review preparation feel
            like reading a sharp briefing instead of rummaging through exports.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {OUTCOMES.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="panel rounded-[30px] p-6"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {item.title}
              </p>
              <p className="mt-4 font-serif text-5xl tracking-[-0.05em] text-foreground">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
