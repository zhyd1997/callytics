import { cn } from "@/lib/utils"

const baseSkeleton = "animate-pulse rounded-lg bg-muted/80 dark:bg-muted/40"

const Skeleton = ({ className }: { className: string }) => {
  return <div className={cn(baseSkeleton, className)} />
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <section className="flex flex-col gap-8 rounded-2xl border border-border bg-card/30 p-8 shadow-sm backdrop-blur">
          <Skeleton className="mx-auto h-8 w-32 rounded-full" />
          <div className="flex flex-col items-center gap-6 text-center">
            <Skeleton className="h-12 w-3/4 sm:h-14 lg:h-16" />
            <Skeleton className="h-20 w-full max-w-3xl sm:h-16" />
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-xl border border-border bg-card/30 p-6 shadow-sm">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-3/4 rounded-full" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/30 p-6 shadow-sm">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="h-72 w-full" />
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/30 p-6 shadow-sm">
            <Skeleton className="h-5 w-32 rounded-full" />
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
