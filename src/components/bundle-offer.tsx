'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cart'
import { toast } from 'sonner'
import { Gift, Loader2 } from 'lucide-react'

interface BundleListing {
  id: string
  title: string
  slug: string
  price: number
  isFlashSale: boolean
  flashSalePrice: number | null
  flashSaleEnds: Date | null
  images: { url: string }[]
  vendor: { name: string }
}

interface BundleItemData {
  listing: BundleListing
}

interface BundleData {
  id: string
  title: string
  description: string
  discountPct: number
  items: BundleItemData[]
}

export function BundleOffer({ bundle, currentListingId }: { bundle: BundleData; currentListingId: string }) {
  const [pending, setPending] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const router = useRouter()

  const otherItems = bundle.items.filter((i) => i.listing.id !== currentListingId)

  async function addAllToCart() {
    if (pending) return
    setPending(true)
    for (const item of bundle.items) {
      addItem({
        listingId: item.listing.id,
        vendorId: '',
        vendorName: item.listing.vendor.name,
        name: item.listing.title,
        price: item.listing.price,
        imageUrl: item.listing.images[0]?.url ?? null,
        quantity: 1,
      })
    }
    toast.success(`${bundle.title} added to cart! You save ${bundle.discountPct}%`)
    router.refresh()
    setPending(false)
  }

  const totalOriginal = bundle.items.reduce((s, i) => s + i.listing.price, 0)
  const totalDiscounted = Math.round(totalOriginal * (1 - bundle.discountPct / 100))

  return (
    <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-5 dark:border-primary-900/50 dark:bg-primary-950/20">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-serif font-bold text-neutral-800 dark:text-neutral-100">
          Frequently bought together
        </h3>
      </div>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{bundle.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {bundle.items.map((item) => (
          <Link
            key={item.listing.id}
            href={`/listings/${item.listing.slug}`}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
          >
            {item.listing.images[0]?.url ? (
              <Image
                src={item.listing.images[0].url}
                alt={item.listing.title}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-lg font-bold text-neutral-400">
                {item.listing.title.charAt(0)}
              </div>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1 pt-4">
              <span className="text-[10px] font-semibold text-white truncate block">{item.listing.title}</span>
            </span>
          </Link>
        ))}
        <div className="flex flex-col items-start gap-1">
          <p className="text-xs text-neutral-500 line-through">₱{(totalOriginal / 100).toLocaleString()}</p>
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ₱{(totalDiscounted / 100).toLocaleString()}
          </p>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Save {bundle.discountPct}%
          </span>
        </div>
      </div>

      <button
        onClick={addAllToCart}
        disabled={pending}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary-500 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Add bundle to cart
      </button>
    </div>
  )
}
