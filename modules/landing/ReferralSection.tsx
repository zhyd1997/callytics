import { ExternalLink, Github, Orbit, Workflow, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"

const CAL_REASONS = [
  {
    icon: Orbit,
    title: "Flexible scheduling stack",
    description: "Cal.com handles the booking layer cleanly so Callytics can stay focused on analytics.",
  },
  {
    icon: Workflow,
    title: "Open-source leverage",
    description: "The ecosystem is transparent, extensible, and well suited to teams that want control.",
  },
  {
    icon: Zap,
    title: "Operator-friendly workflows",
    description: "Strong event types, routing, and platform integrations create better downstream analytics.",
  },
] as const

export const ReferralSection = () => {
  return (
    <section id="platform" className="pb-12 sm:pb-16 lg:pb-24">
      <div className="shell-container">
        <div className="surface-primary rounded-2xl p-5 sm:rounded-[36px] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8">
            <div className="max-w-xl">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/50">
                Built on Cal.com
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                Production-ready on top of Cal.com.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/65 sm:mt-4 sm:text-base">
                Callytics is built to plug directly into Cal.com for teams that
                already need sharper operational visibility. The scheduling
                system stays where it belongs, and the analytics layer stays
                focused on signal, narrative, and action.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full bg-white text-slate-950 hover:bg-white/92 sm:h-auto"
              >
                <a
                  href="https://cal.link/refer-cal-com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try Cal.com
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-white/14 bg-white/6 text-white hover:bg-white/10 hover:text-white sm:h-auto"
              >
                <a
                  href="https://github.com/calcom/cal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  Explore source
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:mt-8 md:grid-cols-3">
            {CAL_REASONS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-white/8 bg-white/5 p-4 sm:rounded-[28px] sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white sm:h-11 sm:w-11 sm:rounded-2xl">
                  <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-white sm:mt-4 sm:text-lg">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/60 sm:mt-2">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
