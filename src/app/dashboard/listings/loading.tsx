export default function DashboardListingsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-36 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="aspect-[4/3] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
