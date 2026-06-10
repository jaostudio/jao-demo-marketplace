import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Products | Palengkee',
  description: 'Compare products side by side to find the best deals on Palengkee.',
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams
  const idList = ids?.split(',').filter(Boolean) ?? []

  const listings = idList.length > 0
    ? await prisma.listing.findMany({
        where: { id: { in: idList }, status: 'APPROVED' },
        include: {
          vendor: { select: { name: true, location: true } },
          category: { select: { name: true } },
          images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
          reviews: { select: { rating: true } },
        },
      })
    : []

  const fields = ['Price', 'Category', 'Vendor', 'Location', 'Rating', 'Stock'] as const
  const getValue = (l: typeof listings[0], field: typeof fields[number]): string => {
    switch (field) {
      case 'Price': return `₱${(l.price / 100).toFixed(2)}`
      case 'Category': return l.category.name
      case 'Vendor': return l.vendor.name
      case 'Location': return l.vendor.location ?? '-'
      case 'Rating': {
        const avg = l.reviews.length ? (l.reviews.reduce((s, r) => s + r.rating, 0) / l.reviews.length).toFixed(1) : '-'
        return avg === '-' ? '-' : `${avg} ⭐`
      }
      case 'Stock': return String(l.stock)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary-500" />
        <h1 className="font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Compare
        </h1>
      </div>

      {listings.length < 2 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <BarChart3 className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 font-serif text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            Select at least 2 products to compare
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Visit product pages and click &quot;Compare&quot; to add items.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex h-10 items-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-4 text-left font-medium text-neutral-500 w-32"></th>
                {listings.map(l => (
                  <th key={l.id} className="px-4 py-4 text-center min-w-[180px]">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 mb-3 mx-auto max-w-[200px]">
                      {l.images[0]?.url ? (
                        <Image src={l.images[0].url} alt={l.title} fill className="object-cover" sizes="200px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl text-neutral-300">{l.title.charAt(0)}</div>
                      )}
                    </div>
                    <Link href={`/listings/${l.slug}`} className="font-semibold text-neutral-800 hover:text-primary-600 dark:text-neutral-100 line-clamp-2">
                      {l.title}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(field => (
                <tr key={field} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3.5 font-medium text-neutral-500">{field}</td>
                  {listings.map(l => (
                    <td key={l.id} className="px-4 py-3.5 text-center text-neutral-800 dark:text-neutral-100">
                      {getValue(l, field)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
