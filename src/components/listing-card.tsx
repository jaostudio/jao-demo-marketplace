'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { WishlistButton } from './wishlist-button'
import { Price } from '@/components/price'
import { useCountdown } from '@/lib/use-countdown'

export interface ListingCardData {
  id: string
  slug: string
  title: string
  price: number
  imageUrl: string | null
  category: { name: string; slug: string }
  vendor: { name: string; avatarUrl?: string | null }
  isService?: boolean
  isWished: boolean
  isFlashSale?: boolean
  flashSalePrice?: number | null
  flashSaleEnds?: string | null
}

interface ListingCardProps {
  listing: ListingCardData
  priority?: boolean
}

export function ListingCard({ listing, priority = false }: ListingCardProps) {
  const reduce = useReducedMotion()
  const imageUrl = listing.imageUrl || null
  const { remaining, expired } = useCountdown(listing.flashSaleEnds ?? null)
  const hasFlashSale = listing.isFlashSale && listing.flashSalePrice && !expired

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative"
    >
      <Link
        href={`/listings/${listing.slug}`}
        className="block rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {imageUrl ? (
            <motion.div
              className="relative h-full w-full"
              whileHover={reduce ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Image
                src={imageUrl}
                alt={listing.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-neutral-300 dark:text-neutral-700">
              {listing.title.charAt(0)}
            </div>
          )}

          {/* Top-left badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {hasFlashSale && (
              <div className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-warm-sm backdrop-blur">
                <Zap className="h-3 w-3" />
                {remaining ? `${remaining.days > 0 ? `${remaining.days}d ` : ''}${remaining.hours.toString().padStart(2, '0')}:${remaining.minutes.toString().padStart(2, '0')}:${remaining.seconds.toString().padStart(2, '0')}` : 'Sale'}
              </div>
            )}
            {listing.isService && (
              <div className="inline-flex items-center gap-1 rounded-full bg-accent-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-warm-sm backdrop-blur">
                <Sparkles className="h-3 w-3" />
                Service
              </div>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {listing.category.name}
          </div>

          {/* Top-right: wishlist */}
          <div className="absolute right-3 top-3">
            <WishlistButton
              listingId={listing.id}
              isWished={listing.isWished}
              size="sm"
              variant="overlay"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="line-clamp-2 font-semibold text-neutral-800 transition-colors group-hover:text-primary-600 dark:text-neutral-100 dark:group-hover:text-primary-400">
            {listing.title}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
            <span>by</span>
            {listing.vendor.avatarUrl ? (
              <Image
                src={listing.vendor.avatarUrl}
                alt="" role="presentation"
                width={16}
                height={16}
                className="h-4 w-4 rounded-full object-cover"
              />
            ) : null}
            <span className="truncate font-medium text-neutral-700 dark:text-neutral-300">
              {listing.vendor.name}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
              <Price amountCents={hasFlashSale ? listing.flashSalePrice! : listing.price} />
            </p>
            {hasFlashSale && (
              <p className="text-xs text-neutral-500 line-through dark:text-neutral-400">
                <Price amountCents={listing.price} />
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
