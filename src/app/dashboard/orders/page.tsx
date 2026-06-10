import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FulfillmentActions } from '@/components/vendor/fulfillment-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orders | Palengkee',
  description: 'View and manage your orders.',
  robots: { index: false, follow: false },
}

function FulfillmentBadge({ state }: { state: string }) {
  const styles: Record<string, string> = {
    UNFULFILLED: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    PROCESSING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    FULFILLED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    RETURNED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[state] ?? ''}`}>
      {state.charAt(0) + state.slice(1).toLowerCase()}
    </span>
  )
}

export default async function DashboardOrdersPage() {
  const user = await getSessionUser()
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const orders = await prisma.order.findMany({
    where: { vendorId: user.id },
    include: { items: true, buyer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Vendor Dashboard
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Orders Received
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} to fulfill
        </p>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-mono text-sm font-semibold text-neutral-800 hover:text-primary-600 dark:text-neutral-100 dark:hover:text-primary-400"
                  >
                    {order.orderNumber}
                  </Link>
                  <FulfillmentBadge state={order.fulfillmentState} />
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {order.buyer.name} &middot; {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-neutral-800 dark:text-neutral-100">
                    ₱{(order.total / 100).toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 capitalize dark:text-neutral-400">{order.paymentState.toLowerCase().replace(/_/g, ' ')}</p>
                </div>
                <FulfillmentActions
                  orderId={order.id}
                  fulfillmentState={order.fulfillmentState}
                  orderNumber={order.orderNumber}
                  buyerName={order.buyer.name}
                  items={order.items.map((i) => ({ name: i.productName, quantity: i.quantity }))}
                />
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <p className="font-serif text-xl font-semibold text-neutral-700 dark:text-neutral-300">
              No orders yet
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              When customers place orders, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
