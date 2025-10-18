"use client"

import type { FormEvent } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
    setEmail("")
  }

  return (
    <section id="waitlist" className="border-t border-border bg-card/30 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-accent/20 bg-card shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold sm:text-3xl">Join the Waitlist</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Be among the first to experience Callytics. Get early access and exclusive launch benefits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-4 py-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10"
                      >
                        <CheckCircle2 className="h-8 w-8 text-accent" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">You're on the list!</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          We'll notify you when Callytics is ready for early access.
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                        Add another email
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1"
                          disabled={loading}
                        />
                        <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                          {loading ? "Joining..." : "Join Waitlist"}
                        </Button>
                      </div>
                      <p className="text-center text-xs text-muted-foreground">
                        No spam, ever. Unsubscribe at any time.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8 text-center"
                >
                  {[
                    { value: "Free", label: "Early access" },
                    { value: "24/7", label: "Support" },
                    { value: "∞", label: "Insights" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="text-xl font-bold text-foreground sm:text-2xl">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
