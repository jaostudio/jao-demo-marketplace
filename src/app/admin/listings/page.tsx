import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ModerateActions } from './moderate-actions'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Manage Listings | Palengkee Admin',
  description: 'Review and manage all marketplace listings.',
  robots: { index: false, follow: false },
}

export default async function AdminListingsPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const listings = await prisma.listing.findMany({
    where: { status: { in: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DRAFT'] } },
    include: { vendor: { select: { name: true } }, category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Moderate Listings</h1>
      <div className="mt-8 space-y-4">
        {listings.map((l) => (
          <div key={l.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-neutral-500">
                  {l.category.name} - ${(l.price / 100).toFixed(2)} - by {l.vendor.name}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                l.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                l.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                l.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
              }`}>
                {l.status.replace(/_/g, ' ')}
              </span>
            </div>
            {l.status === 'PENDING_REVIEW' && (
              <ModerateActions listingId={l.id} />
            )}
          </div>
        ))}
        {listings.length === 0 && <p className="text-center text-neutral-500 py-8">No listings to moderate.</p>}
      </div>
    </div>
  )
}
