import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, MessageSquare, Video } from "lucide-react"

const FEATURES = [
  {
    icon: Video,
    title: "Video Conferencing",
    description: "Seamless integration with Zoom, Google Meet, and more",
    iconClassName: "text-accent",
  },
  {
    icon: MessageSquare,
    title: "Smart Scheduling",
    description: "AI-powered availability and automatic time zone detection",
    iconClassName: "text-primary",
  },
  {
    icon: CheckCircle,
    title: "Full Customization",
    description: "Brand your booking pages and workflows completely",
    iconClassName: "text-emerald-500 dark:text-emerald-400",
  },
] as const

export const ReferralSection = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-card to-background dark:from-accent/20"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Looking for a Scheduling Solution?
        </h3>
        <p className="text-muted-foreground mb-6">
          I use and recommend Cal.com for all my scheduling needs. It&apos;s open-source, 
          privacy-focused, and incredibly flexible for any business.
        </p>
        
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, iconClassName }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card/80 p-6 text-center shadow-sm backdrop-blur">
              <Icon className={`mx-auto mb-3 h-8 w-8 ${iconClassName}`} />
              <h4 className="font-semibold text-foreground">{title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground" asChild>
            <a 
              href="https://cal.link/refer-cal-com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Try Cal.com Free
            </a>
          </Button>
          <Button variant="outline" size="lg" className="hover:text-foreground" asChild>
            <a 
              href="https://github.com/calcom/cal.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          * Using my referral link helps support my work and gets you started with Cal.com&apos;s powerful features
        </p>
      </div>
    </section>
  )
}
