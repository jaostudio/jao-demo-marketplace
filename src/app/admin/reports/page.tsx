import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Download } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reports | Palengkee Admin',
  description: 'View marketplace analytics and reports.',
  robots: { index: false, follow: false },
}

export default async function AdminReportsPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const [orders, , , categoryStats] = await Promise.all([
    prisma.order.findMany({
      include: { vendor: { select: { name: true } }, buyer: { select: { name: true } }, items: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.listing.groupBy({ by: ['status'], _count: true }),
    prisma.category.findMany({
      select: { name: true, _count: { select: { listings: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const csvRows = [
    ['Order#', 'Date', 'Buyer', 'Vendor', 'Items', 'Total (cents)', 'Payment', 'Fulfillment', 'Status'].join(','),
    ...orders.map(o => [
      o.orderNumber,
      o.createdAt.toISOString().split('T')[0],
      `"${o.buyer.name}"`,
      `"${o.vendor.name}"`,
      o.items.length,
      o.total,
      o.paymentState,
      o.fulfillmentState,
    ].join(',')),
  ]

  const csvContent = csvRows.join('\n')
  const csvBase64 = Buffer.from(csvContent).toString('base64')
  const csvDataUri = `data:text/csv;base64,${csvBase64}`

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Admin</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">Sales Report</h1>
          <p className="mt-1 text-sm text-neutral-500">{orders.length} orders, ₱{(totalRevenue / 100).toLocaleString()} total revenue</p>
        </div>
        <a
          href={csvDataUri}
          download="likha-sales-report.csv"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-500 px-4 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </a>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500">Orders</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500">Revenue</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">₱{(totalRevenue / 100).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500">Avg order value</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {orders.length ? `₱${(totalRevenue / orders.length / 100).toLocaleString()}` : ' - '}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500">Categories with listings</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {categoryStats.filter(c => c._count.listings > 0).length}/{categoryStats.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Order</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Date</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Buyer</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Vendor</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Items</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Total</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Payment</th>
              <th className="px-4 pb-3 pt-4 font-medium text-neutral-500">Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs text-neutral-800 dark:text-neutral-100">#{o.orderNumber}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{o.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-neutral-800 dark:text-neutral-100">{o.buyer.name}</td>
                <td className="px-4 py-3 text-neutral-800 dark:text-neutral-100">{o.vendor.name}</td>
                <td className="px-4 py-3 text-neutral-500">{o.items.length}</td>
                <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-100">₱{(o.total / 100).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    o.paymentState === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    o.paymentState === 'REFUNDED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {o.paymentState.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-neutral-500">{o.fulfillmentState.replace(/_/g, ' ').toLowerCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
