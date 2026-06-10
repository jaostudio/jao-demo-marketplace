import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FlashSaleManager } from './flash-sale-manager'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Flash Sales | Palengkee Admin',
  description: 'Manage flash sale events.',
  robots: { index: false, follow: false },
}

export default async function AdminFlashSalesPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const listings = await prisma.listing.findMany({
    where: { status: 'APPROVED', isService: false },
    include: { vendor: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">Flash Sales</h1>
        <p className="mt-1 text-sm text-neutral-500">Set time-limited discounts on approved products</p>
      </div>
      <FlashSaleManager listings={listings.map(l => ({ id: l.id, title: l.title, price: l.price, vendorName: l.vendor.name, isFlashSale: l.isFlashSale, flashSalePrice: l.flashSalePrice, flashSaleEnds: l.flashSaleEnds?.toISOString() ?? null }))} />
    </div>
  )
}
