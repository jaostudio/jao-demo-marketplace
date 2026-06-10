'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useDemoControl } from '@/lib/store/demo-control'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingBag, Check, Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/lib/store/cart'

interface ListingVariant {
  id: string
  label: string
  priceAdj: number
  stock: number
}

interface ListingInfo {
  id: string
  title: string
  price: number
  vendorId: string
  vendorName: string
  imageUrl: string | null
}

interface AddToCartButtonProps {
  listing: ListingInfo
  isService?: boolean
  variants?: ListingVariant[]
}

export function AddToCartButton({ listing, isService, variants = [] }: AddToCartButtonProps) {
  const reduce = useReducedMotion()
  const { data: session } = useSession()
  const { simulatedUserId } = useDemoControl()
  const isAuthenticated = !!session || !!simulatedUserId
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const [pending, setPending] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const effectivePrice = selectedVariant
    ? listing.price + (variants.find((v) => v.label === selectedVariant)?.priceAdj ?? 0)
    : listing.price

  const selectedStock = selectedVariant
    ? variants.find((v) => v.label === selectedVariant)?.stock ?? 0
    : null

  const outOfStock = selectedVariant !== null && selectedStock === 0

  function handleAdd() {
    setPending(true)
    addItem({
      listingId: listing.id,
      vendorId: listing.vendorId,
      vendorName: listing.vendorName,
      name: selectedVariant ? `${listing.title} - ${selectedVariant}` : listing.title,
      price: effectivePrice,
      imageUrl: listing.imageUrl,
      quantity: 1,
      variantLabel: selectedVariant,
    })
    setTimeout(() => {
      setAdded(true)
      setPending(false)
      toast.success('Added to basket')
      setTimeout(() => setAdded(false), 1800)
    }, 200)
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/auth/signin?callbackUrl=/listings/${listing.id}`}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600"
      >
        <ShoppingBag className="h-5 w-5" />
        Sign in to {isService ? 'book' : 'buy'}
      </Link>
    )
  }

  if (isService) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-6 space-y-2"
      >
        <button
          onClick={() => router.push(`/booking/${listing.id}`)}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600"
        >
          <Calendar className="h-5 w-5" />
          Book this experience
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mt-6 space-y-2"
    >
      {/* Variant selector */}
      {variants.length > 0 && (
        <div className="mb-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {selectedVariant ? `Selected: ${selectedVariant}` : 'Select option'}
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const selected = selectedVariant === v.label
              const soldOut = v.stock === 0
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={soldOut}
                  onClick={() => setSelectedVariant(selected ? null : v.label)}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                    soldOut
                      ? 'cursor-not-allowed border-neutral-200 text-neutral-400 line-through dark:border-neutral-800'
                      : selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  {v.label}
                  {v.priceAdj !== 0 && (
                    <span className="ml-1 text-xs">
                      {v.priceAdj > 0 ? '+' : ''}{(v.priceAdj / 100).toFixed(0)}
                    </span>
                  )}
                  {soldOut && <span className="ml-1.5 text-xs">Sold out</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={pending || (variants.length > 0 && selectedVariant === null) || outOfStock}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Adding…
          </>
        ) : added ? (
          <>
            <Check className="h-5 w-5" />
            Added to basket
          </>
        ) : (
          <>
            {isService ? <Calendar className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
            {variants.length > 0 && selectedVariant === null
              ? 'Select an option'
              : outOfStock
                ? 'Out of stock'
                : 'Add to basket'}
          </>
        )}
      </button>
      <Link
        href="/cart"
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        View basket
      </Link>
    </motion.div>
  )
}
