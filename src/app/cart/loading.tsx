export default function CartLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
              <div className="h-5 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <div className="h-14 w-14 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-3 w-1/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="space-y-3">
            <div className="h-5 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
