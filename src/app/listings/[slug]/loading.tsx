export default function ListingDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="aspect-square animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 w-1/3 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  )
}
