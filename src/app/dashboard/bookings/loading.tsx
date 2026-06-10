export default function DashboardBookingsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-8 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
