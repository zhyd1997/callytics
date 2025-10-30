"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client";
import { signIn } from "@/lib/auth/sign-in";
import { BarChart3, TrendingUp, Calendar } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function Hero() {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  const { data: session, isPending, error } = authClient.useSession();

  const handleCalOAuth = async () => {
    try {
      setIsConnecting(true)

      const { data, error } = await signIn()
      
      if (error) {
        throw error
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong!")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
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
            {!session || isPending || error ? (
              <>
                <Button disabled={isConnecting} size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCalOAuth}>
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Connect with Cal.com</span>
                  <span className="sm:hidden">Cal.com</span>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </>
            ) : (
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
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
