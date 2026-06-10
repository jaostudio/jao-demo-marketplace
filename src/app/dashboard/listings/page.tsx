import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ListingActions } from '@/components/vendor/listing-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Listings | Palengkee',
  description: 'Manage your product listings.',
  robots: { index: false, follow: false },
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    DRAFT: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    ARCHIVED: 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default async function DashboardListingsPage() {
  const user = await getSessionUser()
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const listings = await prisma.listing.findMany({
    where: { vendorId: user.id, status: { not: 'ARCHIVED' } },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const archivedCount = await prisma.listing.count({
    where: { vendorId: user.id, status: 'ARCHIVED' },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Vendor Dashboard
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {listings.length} active{archivedCount > 0 ? `, ${archivedCount} archived` : ''}
          </p>
        </div>
        <Link
          href="/listings/create"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white shadow-warm-sm transition-colors hover:bg-primary-600"
        >
          Add listing
        </Link>
      </div>
      <div className="space-y-3">
        {listings.map((l) => (
          <div key={l.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/listings/${l.slug}`}
                    className="font-semibold text-neutral-800 hover:text-primary-600 dark:text-neutral-100 dark:hover:text-primary-400"
                  >
                    {l.title}
                  </Link>
                  <StatusBadge status={l.status} />
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {l.category.name} &middot; ₱{(l.price / 100).toLocaleString()}
                </p>
              </div>
              <ListingActions listingId={l.id} />
            </div>
          </div>
        ))}
        {listings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <p className="font-serif text-xl font-semibold text-neutral-700 dark:text-neutral-300">
              No listings yet
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Create your first listing to start selling on Palengkee.
            </p>
            <Link
              href="/listings/create"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Create listing
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
