export default function ListingsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <div className="h-4 w-48 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-3 h-10 w-64 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-12 flex-1 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-12 w-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-12 w-24 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 overflow-hidden dark:border-neutral-800">
            <div className="aspect-square animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-5 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
