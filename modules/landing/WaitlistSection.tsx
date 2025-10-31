"use client"

import type { ChangeEvent } from "react"

import { useState, useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { joinWaitlist } from "@/app/(marketing)/waitlist/actions"
import type { WaitlistState } from "@/lib/schemas/waitlist";

const initialState: WaitlistState = { message: '' }

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [isManuallyReset, setIsManuallyReset] = useState(false)
  const [state, formAction, isPending] = useActionState(joinWaitlist, initialState)
  const prevMessageRef = useRef<string>('')

  // Derive submitted state from form action result, but allow manual reset
  const submitted = state.message === "Success" && !isManuallyReset

  // Reset email on success (only once per success) using a cleanup function to avoid cascading renders
  useEffect(() => {
    if (state.message === "Success" && prevMessageRef.current !== state.message) {
      prevMessageRef.current = state.message
      // Schedule state updates asynchronously to avoid cascading renders
      const resetTimer = setTimeout(() => setIsManuallyReset(false), 0)
      const emailTimer = setTimeout(() => setEmail(""), 0)
      return () => {
        clearTimeout(resetTimer)
        clearTimeout(emailTimer)
      }
    }
  }, [state.message])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleReset = () => {
    setIsManuallyReset(true)
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
                        <h3 className="text-xl font-semibold text-foreground">You&apos;re on the list!</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          We&apos;ll notify you when Callytics is ready for early access.
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleReset} className="mt-4">
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
                      action={formAction}
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={email}
                          onChange={handleChange}
                          required
                          className="flex-1"
                          disabled={isPending}
                        />
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isPending}
                          className="w-full sm:w-auto"
                          aria-busy={isPending}
                        >
                          {isPending ? "Joining..." : "Join Waitlist"}
                        </Button>
                      </div>
                      {state.message && state.message !== "Success" ? (
                        <p aria-live="polite" className="text-sm text-destructive">
                          {state.message}
                        </p>
                      ) : null}
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
