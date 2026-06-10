import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { MetricsCards } from '@/components/vendor/metrics-cards'

const RevenueChart = dynamic(() => import('@/components/vendor/revenue-chart').then(m => m.RevenueChart))

export const metadata: Metadata = {
  title: 'Dashboard | Palengkee',
  description: 'Manage your listings, orders, and store performance.',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [listingsCount, ordersCount, revenueAgg, avgRating, recentOrders, lowStockListings] = await Promise.all([
    prisma.listing.count({ where: { vendorId: user.id } }),
    prisma.order.count({ where: { vendorId: user.id } }),
    prisma.order.aggregate({
      where: { vendorId: user.id, paymentState: 'PAID' },
      _sum: { total: true },
    }),
    prisma.review.aggregate({
      where: { listing: { vendorId: user.id } },
      _avg: { rating: true },
    }),
    prisma.order.findMany({
      where: { vendorId: user.id, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.listing.findMany({
      where: { vendorId: user.id, stock: { lte: 3, gt: 0 } },
      select: { id: true, title: true, stock: true, slug: true },
      orderBy: { stock: 'asc' },
    }),
  ])

  const totalRevenue = revenueAgg._sum.total ?? 0
  const averageRating = avgRating._avg.rating ?? 0

  const revenueByDate = new Map<string, number>()
  for (const order of recentOrders) {
    const dateKey = order.createdAt.toISOString().slice(0, 10)
    revenueByDate.set(dateKey, (revenueByDate.get(dateKey) ?? 0) + order.total)
  }

  const chartData: { date: string; revenue: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    chartData.push({ date: key, revenue: revenueByDate.get(key) ?? 0 })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Vendor Dashboard
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
            Welcome back, {user.name?.split(' ')[0] ?? 'Vendor'}
          </h1>
        </div>
        <Link
          href="/dashboard/listings"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white shadow-warm-sm transition-colors hover:bg-primary-600"
        >
          Add listing
        </Link>
      </div>

      {/* Low-stock alert */}
      {lowStockListings.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Low stock alert{lowStockListings.length > 1 ? 's' : ''}
          </p>
          <ul className="mt-2 space-y-1">
            {lowStockListings.map((l) => (
              <li key={l.id} className="text-sm text-amber-700 dark:text-amber-400">
                <Link href={`/dashboard/listings/${l.id}/edit`} className="underline underline-offset-2 hover:no-underline">
                  {l.title}
                </Link>
                <span className="text-amber-600 dark:text-amber-500"> - {l.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <MetricsCards
        totalRevenue={totalRevenue}
        totalOrders={ordersCount}
        totalListings={listingsCount}
        averageRating={averageRating}
      />

      <div className="mt-8">
        <RevenueChart data={chartData} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-4">
        <Link
          href="/dashboard/listings"
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p className="text-sm font-medium text-neutral-500">Manage Listings</p>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            View, edit, or submit your products for review.
          </p>
        </Link>
        <Link
          href="/dashboard/orders"
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p className="text-sm font-medium text-neutral-500">Incoming Orders</p>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            Update fulfillment status and manage orders.
          </p>
        </Link>
        <Link
          href="/dashboard/bookings"
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p className="text-sm font-medium text-neutral-500">Bookings</p>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            Manage service requests from buyers.
          </p>
        </Link>
        <Link
          href="/dashboard/profile"
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p className="text-sm font-medium text-neutral-500">Store Profile</p>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            Edit your bio, avatar, location, and social links.
          </p>
        </Link>
      </div>
    </div>
  )
}
