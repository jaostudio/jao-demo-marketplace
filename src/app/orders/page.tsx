import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { Price } from '@/components/price'
import { ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Orders | Palengkee',
  description: 'Track and manage your orders.',
  robots: { index: false, follow: false },
}

export default async function OrdersPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/signin?callbackUrl=/orders')

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      vendor: { select: { id: true, name: true, avatarUrl: true } },
      items: {
        select: {
          id: true,
          productName: true,
          quantity: true,
          priceAtPurchase: true,
        },
      },
    },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          My orders
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">
          Order history
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {orders.length === 0
            ? "You haven't placed any orders yet."
            : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
            <ShoppingBag className="h-7 w-7 text-primary-500" />
          </div>
          <h2 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            When you place an order, it will show up here with tracking and status.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderRow({
  order,
}: {
  order: Awaited<ReturnType<typeof prisma.order.findMany>>[number] & {
    vendor: { id: string; name: string; avatarUrl: string | null }
    items: { id: string; productName: string; quantity: number; priceAtPurchase: number }[]
  }
}) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="group block rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-warm-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-700 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {order.vendor.avatarUrl ? (
            <Image
              src={order.vendor.avatarUrl}
              alt={order.vendor.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {order.vendor.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs text-neutral-500">Order from</p>
            <p className="font-semibold text-neutral-800 group-hover:text-primary-600 dark:text-neutral-100 dark:group-hover:text-primary-400">
              {order.vendor.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PaymentBadge state={order.paymentState} />
          <FulfillmentBadge state={order.fulfillmentState} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <div className="text-sm">
          <p className="text-xs text-neutral-500">Order number</p>
          <p className="font-mono font-semibold text-neutral-800 dark:text-neutral-100">
            {order.orderNumber}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-xs text-neutral-500">Date</p>
          <p className="font-medium text-neutral-800 dark:text-neutral-100">
            {new Date(order.createdAt).toLocaleDateString('en-PH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-xs text-neutral-500">Items</p>
          <p className="font-medium text-neutral-800 dark:text-neutral-100">
            {order.items.reduce((s, i) => s + i.quantity, 0)} ({order.items.length}{' '}
            {order.items.length === 1 ? 'product' : 'products'})
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Total</p>
          <p className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-100">
            <Price amountCents={order.total} />
          </p>
        </div>
      </div>
    </Link>
  )
}

function PaymentBadge({ state }: { state: string }) {
  const styles: Record<string, { label: string; className: string }> = {
    PENDING_PAYMENT: {
      label: 'Awaiting payment',
      className:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    },
    PAID: {
      label: 'Paid',
      className:
        'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
    },
    REFUNDED: {
      label: 'Refunded',
      className: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    },
  }
  const s = styles[state] ?? { label: state, className: '' }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  )
}

function FulfillmentBadge({ state }: { state: string }) {
  const styles: Record<string, { label: string; className: string }> = {
    UNFULFILLED: {
      label: 'To ship',
      className:
        'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    },
    PROCESSING: {
      label: 'Processing',
      className:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    FULFILLED: {
      label: 'Delivered',
      className:
        'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
    },
    RETURNED: {
      label: 'Returned',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
  }
  const s = styles[state] ?? { label: state, className: '' }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  )
}
