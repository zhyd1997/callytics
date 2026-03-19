import { Inbox } from "lucide-react"

interface WidgetEmptyStateProps {
  readonly title: string
  readonly description: string
}

export const WidgetEmptyState = ({
  title,
  description,
}: WidgetEmptyStateProps) => {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/70 px-6 py-10 text-center">
      <div className="mb-4 rounded-full border border-border/70 bg-secondary/80 p-3 text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
