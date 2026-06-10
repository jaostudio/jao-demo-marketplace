'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Tag,
  X,
  ArrowRight,
  Ticket,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCart, type CartGroup } from '@/lib/store/cart'
import { Price } from '@/components/price'

export default function CartPage() {
  const groups = useCart((s) => s.groups)
  const total = useCart((s) => s.total)
  const itemCount = useCart((s) => s.itemCount)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const appliedCouponCode = useCart((s) => s.couponCode)
  const setCoupon = useCart((s) => s.setCoupon)
  const cartGroups: CartGroup[] = groups()
  const cartTotal = total()
  const cartItemCount = itemCount()

  const [coupon, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [saving, setSaving] = useState<string | null>(null)

  const appliedCoupon: {
    code: string
    discount: number
    label: string
  } | null = (() => {
    if (!appliedCouponCode) return null
    const mocks: Record<string, { kind: 'percent' | 'fixed'; value: number; label: string }> = {
      PALENGKEE10: { kind: 'percent', value: 10, label: '10% off your order' },
      WELCOME: { kind: 'fixed', value: 20000, label: '₱200 off your first order' },
    }
    const c = mocks[appliedCouponCode]
    if (!c) return null
    const discount =
      c.kind === 'percent' ? Math.floor((cartTotal * c.value) / 100) : Math.min(c.value, cartTotal)
    return { code: appliedCouponCode, discount, label: `${appliedCouponCode}: ${c.label}` }
  })()

  function applyCoupon() {
    setCouponError('')
    const code = coupon.trim().toUpperCase()
    if (!code) {
      setCouponError('Enter a coupon code')
      return
    }
    const mocks: Record<string, { kind: 'percent' | 'fixed'; value: number; label: string }> = {
      PALENGKEE10: { kind: 'percent', value: 10, label: '10% off your order' },
      WELCOME: { kind: 'fixed', value: 20000, label: '₱200 off your first order' },
    }
    if (!mocks[code]) {
      setCouponError('Invalid coupon code')
      return
    }
    setCoupon(code)
    setCouponInput('')
    toast.success('Coupon applied!')
  }

  if (cartGroups.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
          <ShoppingBag className="h-9 w-9 text-primary-500" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Your basket is feeling light
        </h1>
        <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
          Let's fix that - browse the market and add something good!
        </p>
        <Link
          href="/listings"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary-500 px-7 text-sm font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600"
        >
          <span>Browse the marketplace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  const finalTotal = Math.max(0, cartTotal - (appliedCoupon?.discount ?? 0))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Basket
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">
          Your selections
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} from {cartGroups.length}{' '}
          {cartGroups.length === 1 ? 'vendor' : 'vendors'}.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: groups */}
        <div className="space-y-6">
          {cartGroups.map((group) => (
            <VendorGroup
              key={group.vendorId}
              group={group}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onSaveForLater={async (listingId) => {
                setSaving(listingId)
                // Mock - would call wishlist server action in real flow
                await new Promise((r) => setTimeout(r, 400))
                removeItem(listingId)
                setSaving(null)
              }}
              saving={saving}
            />
          ))}

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/listings"
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
              Order summary
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <dt>Subtotal</dt>
                <dd className="font-medium text-neutral-800 dark:text-neutral-200">
                  <Price amountCents={cartTotal} />
                </dd>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-accent-600 dark:text-accent-400">
                  <dt className="inline-flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{appliedCoupon.code}</span>
                  </dt>
                  <dd className="font-medium">−<Price amountCents={appliedCoupon.discount} /></dd>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold dark:border-neutral-800">
                <dt className="text-neutral-800 dark:text-neutral-100">Total</dt>
                <dd className="text-neutral-800 dark:text-neutral-100">
                  <Price amountCents={finalTotal} />
                </dd>
              </div>
            </dl>

            {/* Coupon */}
            <div className="mt-5">
              <label htmlFor="coupon" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Coupon code
              </label>
              {appliedCoupon ? (
                <div className="mt-1.5 flex items-center justify-between rounded-xl border border-accent-300 bg-accent-50 px-3 py-2 dark:border-accent-700 dark:bg-accent-900/20">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent-700 dark:text-accent-300">
                    <Ticket className="h-3.5 w-3.5" />
                    <span>{appliedCoupon.label}</span>
                  </div>
                  <button
                    onClick={() => setCoupon(null)}
                    aria-label="Remove coupon"
                    className="text-accent-700 hover:text-accent-900 dark:text-accent-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="coupon"
                      value={coupon}
                      onChange={(e) => {
                        setCouponInput(e.target.value)
                        if (couponError) setCouponError('')
                      }}
                      placeholder="PALENGKEE10"
                      className="h-10 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-700 dark:bg-neutral-950"
                    />
                    <button
                      onClick={applyCoupon}
                      className="h-10 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{couponError}</p>
                  )}
                  <p className="mt-1.5 text-[11px] text-neutral-500">
                    Try <code className="font-mono">PALENGKEE10</code> for 10% off
                  </p>
                </>
              )}
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 text-sm font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600"
            >
              <span>Continue to checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-[11px] text-neutral-500">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function VendorGroup({
  group,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
  saving,
}: {
  group: CartGroup
  onUpdateQuantity: (id: string, q: number, variantLabel?: string | null) => void
  onRemove: (id: string, variantLabel?: string | null) => void
  onSaveForLater: (id: string) => void
  saving: string | null
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
          {group.vendorName.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Sold by</p>
          <Link
            href={`/vendors/${group.vendorId}`}
            className="font-semibold text-neutral-800 hover:underline dark:text-neutral-100"
          >
            {group.vendorName}
          </Link>
        </div>
      </div>

      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        <AnimatePresence initial={false}>
          {group.items.map((item) => (
            <motion.li
              key={item.listingId}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Image */}
                <Link
                  href={`/listings/${item.listingId}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 sm:h-24 sm:w-24"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-neutral-600 dark:text-neutral-300">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/listings/${item.listingId}`}
                    className="line-clamp-2 font-semibold text-neutral-800 hover:text-primary-600 dark:text-neutral-100 dark:hover:text-primary-400"
                  >
                    {item.name}
                  </Link>
                  {item.variantLabel && (
                    <p className="mt-0.5 text-xs text-neutral-500">{item.variantLabel}</p>
                  )}
                  <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    <Price amountCents={item.price} />
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <button
                        onClick={() => onUpdateQuantity(item.listingId, item.quantity - 1, item.variantLabel)}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.listingId, item.quantity + 1, item.variantLabel)}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onSaveForLater(item.listingId)}
                      disabled={saving === item.listingId}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-accent-600 disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-accent-400"
                    >
                      <Heart className="h-3 w-3" />
                      <span>{saving === item.listingId ? 'Saving…' : 'Save for later'}</span>
                    </button>
                    <button
                      onClick={() => onRemove(item.listingId, item.variantLabel)}
                      aria-label="Remove item"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
                  <Price amountCents={item.price * item.quantity} />
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
        <span className="text-neutral-500">Vendor subtotal</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-100">
          <Price amountCents={group.subtotal} />
        </span>
      </div>
    </div>
  )
}
