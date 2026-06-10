import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CouponManager } from './coupon-manager'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Coupons | Palengkee Admin',
  description: 'Manage discount coupons.',
  robots: { index: false, follow: false },
}

export default async function AdminCouponsPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">Coupons</h1>
        <p className="mt-1 text-sm text-neutral-500">{coupons.length} coupons - demo codes: PALENGKEE10 (10%), WELCOME (₱200)</p>
      </div>
      <CouponManager coupons={coupons.map(c => ({ id: c.id, code: c.code, kind: c.kind as 'percent' | 'fixed', value: c.value, label: c.label, maxUses: c.maxUses, useCount: c.useCount, active: c.active, expiresAt: c.expiresAt?.toISOString() ?? null }))} />
    </div>
  )
}
