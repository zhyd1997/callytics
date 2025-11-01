"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signIn } from "@/lib/auth/sign-in"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

export function Hero() {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  const { data: session, isPending, error } = authClient.useSession()

  const handleCalOAuth = async () => {
    try {
      setIsConnecting(true)

      const { error } = await signIn()

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

  const showConnectCta = !session || isPending || !!error

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex items-center justify-center">
            <h2 className="font-serif text-6xl font-bold tracking-wider md:text-8xl">
              <span className="bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-transparent">
                Cal
              </span>
              <span className="text-foreground">lytics</span>
            </h2>
          </div>

          <div className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-[gradient-flow_4s_ease_infinite]">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Purpose-built for Cal.com teams
            </span>
          </div>

          <h1 className="mb-6 text-balance font-sans text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            Analytics for{" "}
            <span className="relative inline-flex h-10 w-24 rotate-[-3deg] shrink-0 items-center justify-center md:h-16 md:w-32">
              <Image
                src="/platforms/cal-logo-light.jpeg"
                alt="Cal.com"
                fill
                sizes="(min-width: 768px) 8rem, 6rem"
                className="object-cover dark:hidden"
                priority
              />
              <Image
                src="/platforms/cal-logo-dark.jpeg"
                alt="Cal.com"
                fill
                sizes="(min-width: 768px) 8rem, 6rem"
                className="hidden object-cover dark:block"
                priority
              />
            </span>{" "}
            simplified
          </h1>

          <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Instantly surface the metrics that matter for your{" "}
            <span className="bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text font-semibold text-transparent">
              Cal.com
            </span>{" "}
            bookings. Track meetings, analyze conversion rates, and optimize every scheduling workflow with a polished, Cal.com-inspired experience.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {showConnectCta ? (
              <>
                <Button
                  size="lg"
                  className="min-w-[200px] text-base font-semibold hover:cursor-pointer"
                  disabled={isConnecting}
                  onClick={handleCalOAuth}
                >
                  {isConnecting ? "Connecting..." : "Connect with Cal.com"}
                </Button>
                <Button size="lg" variant="outline" className="min-w-[200px] text-base bg-transparent" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] text-base border-primary/50 bg-primary/5 text-primary transition-transform hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/25 hover:text-foreground"
                asChild
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Launching Oct 31st</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
