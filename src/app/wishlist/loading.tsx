export default function WishlistLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="h-8 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="aspect-[4/5] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-5 w-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
