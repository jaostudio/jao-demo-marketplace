export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 h-4 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-1 h-8 w-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 h-48 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
