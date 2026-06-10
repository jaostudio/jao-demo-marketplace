export default function AdminUsersLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-8 w-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
