"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Calendar } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "motion/react"
import Link from "next/link";

export function Hero() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist")
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="fixed right-4 top-4 z-10 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
        <ModeToggle />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:mb-8 sm:px-4 sm:py-2 sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            <span className="text-muted-foreground">Now accepting early access signups</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance text-4xl font-bold tracking-tight text-accent sm:text-5xl lg:text-7xl"
          >
            Analytics for Cal.com, simplified
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl"
          >
            Lightweight analytics dashboard providing visual insights into bookings, event types, and workspace
            performance. Make data-driven decisions with beautiful, actionable reports.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
          >
            <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={scrollToWaitlist}>
              <TrendingUp className="h-4 w-4" />
              Join Waitlist
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground sm:mt-16 sm:flex-row sm:gap-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4 text-accent" />
              <span>Real-time insights</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-accent" />
              <span>Event tracking</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>Performance metrics</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
