export default function MessageThreadLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="flex items-center gap-3">
        <div className="h-5 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`rounded-2xl p-4 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} bg-neutral-200 dark:bg-neutral-800`}>
              <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
              <div className="mt-3 h-2 w-16 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
