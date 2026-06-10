import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Clock, Truck, Home, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { Price } from '@/components/price'
import { CancelOrderButton } from './cancel-order-button'
import { ReorderButton } from '@/components/reorder-button'
import { OrderActions } from '@/components/order-actions'
import { MessageMakerButton } from '@/components/message-maker-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Details | Palengkee',
  description: 'View order details and status.',
  robots: { index: false, follow: false },
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { id } = await params
  const { success } = await searchParams
  const user = await getSessionUser()
  if (!user) redirect(`/auth/signin?callbackUrl=/orders/${id}`)

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      vendor: { select: { id: true, name: true, avatarUrl: true, location: true } },
    },
  })
  if (!order) notFound()
  if (order.buyerId !== user.id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          This order is not yours
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          You can only view your own orders.
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white"
        >
          Back to my orders
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      {success === '1' && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-800 dark:bg-accent-900/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-accent-900 dark:text-accent-100">
              Order placed successfully
            </p>
            <p className="text-sm text-accent-800 dark:text-accent-200">
              We&apos;ve sent a confirmation to your email. Track progress below.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Order details
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleString('en-PH', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Total</p>
          <p className="font-serif text-3xl font-bold text-primary-600 dark:text-primary-400">
            <Price amountCents={order.total} />
          </p>
        </div>
      </div>

      {/* Fulfillment Timeline */}
      <FulfillmentTimeline
        paymentState={order.paymentState}
        fulfillmentState={order.fulfillmentState}
      />

      {/* Vendor card */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
        <div className="flex items-center gap-3">
          {order.vendor.avatarUrl ? (
            <Image
              src={order.vendor.avatarUrl}
              alt={order.vendor.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {order.vendor.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs text-neutral-500">Sold by</p>
            <Link
              href={`/vendors/${order.vendor.id}`}
              className="font-semibold text-neutral-800 hover:underline dark:text-neutral-100"
            >
              {order.vendor.name}
            </Link>
            {order.vendor.location && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-neutral-500">
                <MapPin className="h-3 w-3" />
                <span>{order.vendor.location}</span>
              </p>
            )}
          </div>
        </div>
        <MessageMakerButton />
      </div>

      {/* Two-column grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
          <h2 className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-100">
            Items in this order
          </h2>
          <ul className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-base font-bold text-neutral-400 dark:bg-neutral-800">
                  {item.productName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-neutral-800 dark:text-neutral-100">
                    {item.productName}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    <Price amountCents={item.priceAtPurchase} /> × {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
                  <Price amountCents={item.priceAtPurchase * item.quantity} />
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary + actions */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-100">
              Summary
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Payment</dt>
                <dd>
                  <PaymentBadge state={order.paymentState} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Fulfillment</dt>
                <dd>
                  <FulfillmentBadge state={order.fulfillmentState} />
                </dd>
              </div>
            </dl>
          </div>

          {order.address && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-100">
                Shipping to
              </h2>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                {order.name}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{order.address}</p>
            </div>
          )}

          {order.paymentState === 'PENDING_PAYMENT' && (
            <CancelOrderButton orderId={order.id} />
          )}

          <OrderActions
            orderNumber={order.orderNumber}
            orderDate={order.createdAt.toISOString()}
            total={order.total}
            name={order.name}
            address={order.address}
            email={order.email}
            paymentState={order.paymentState}
            fulfillmentState={order.fulfillmentState}
            items={order.items.map(i => ({ productName: i.productName, quantity: i.quantity, priceAtPurchase: i.priceAtPurchase }))}
            vendorName={order.vendor.name}
          />

          <ReorderButton
            items={order.items.map((item) => ({
              listingId: item.listingId,
              productName: item.productName,
              priceAtPurchase: item.priceAtPurchase,
              quantity: item.quantity,
              vendorId: order.vendor.id,
              vendorName: order.vendor.name,
            }))}
          />

          <Link
            href="/listings"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}

function FulfillmentTimeline({
  paymentState,
  fulfillmentState,
}: {
  paymentState: string
  fulfillmentState: string
}) {
  const steps = [
    {
      key: 'placed',
      label: 'Order placed',
      icon: Check,
      done: true,
    },
    {
      key: 'paid',
      label: 'Payment confirmed',
      icon: Clock,
      done: paymentState === 'PAID' || paymentState === 'REFUNDED',
    },
    {
      key: 'shipped',
      label: 'Shipped',
      icon: Truck,
      done: ['FULFILLED', 'RETURNED'].includes(fulfillmentState),
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: Home,
      done: fulfillmentState === 'FULFILLED',
    },
  ]

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <h2 className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-100">
        Order progress
      </h2>
      <ol className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <li key={s.key} className="relative">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-12 sm:w-12 ${
                    s.done
                      ? 'bg-primary-500 text-white shadow-warm-sm'
                      : 'border-2 border-neutral-200 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900'
                  }`}
                >
                  {s.done ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
                <p
                  className={`mt-2 text-center text-[10px] font-semibold sm:text-xs ${
                    s.done ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-400'
                  }`}
                >
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-5 sm:top-6 -z-0 h-0.5 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] ${
                    s.done ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function PaymentBadge({ state }: { state: string }) {
  const styles: Record<string, { label: string; className: string }> = {
    PENDING_PAYMENT: {
      label: 'Awaiting payment',
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    },
    PAID: {
      label: 'Paid',
      className: 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
    },
    REFUNDED: {
      label: 'Refunded',
      className: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    },
  }
  const s = styles[state] ?? { label: state, className: '' }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  )
}

function FulfillmentBadge({ state }: { state: string }) {
  const styles: Record<string, { label: string; className: string }> = {
    UNFULFILLED: { label: 'To ship', className: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' },
    PROCESSING: { label: 'Processing', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    FULFILLED: { label: 'Delivered', className: 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300' },
    RETURNED: { label: 'Returned', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  }
  const s = styles[state] ?? { label: state, className: '' }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  )
}
