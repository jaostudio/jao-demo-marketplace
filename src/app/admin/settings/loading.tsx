export default function AdminSettingsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="h-8 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
            <div className="h-5 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 space-y-3">
              <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
