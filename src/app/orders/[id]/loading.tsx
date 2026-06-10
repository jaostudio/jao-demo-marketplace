export default function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="h-6 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-1/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
