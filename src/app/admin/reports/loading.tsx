export default function AdminReportsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-8 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="h-5 w-36 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 h-64 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="h-5 w-36 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 h-64 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  )
}
