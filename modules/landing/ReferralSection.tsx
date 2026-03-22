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
    <section id="platform" className="pb-16 sm:pb-22 lg:pb-28">
      <div className="shell-container">
        <div className="surface-primary rounded-[36px] p-7 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/62">
                Built on Cal.com
              </p>
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-white sm:text-5xl">
                Production-ready on top of Cal.com.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/74">
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
                className="rounded-full bg-white text-slate-950 hover:bg-white/92"
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
                className="rounded-full border-white/18 bg-white/8 text-white hover:bg-white/12 hover:text-white"
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

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CAL_REASONS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/12 bg-white/8 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
