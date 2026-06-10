'use client'

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
    >
      <option value="newest">Newest first</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
  )
}
