'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, ArrowUpRight } from 'lucide-react'

interface Vendor {
  id: string
  name: string
  avatarUrl: string | null
  location: string | null
  bio: string | null
  listingCount: number
}

interface VendorSpotlightProps {
  vendors: Vendor[]
}

export function VendorSpotlight({ vendors }: VendorSpotlightProps) {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scrollBy(direction: 1 | -1) {
    const el = containerRef.current
    if (!el) return
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 320
    el.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
  }

  return (
    <section
      id="meet-the-makers"
      className="mx-auto max-w-7xl px-4 py-20 sm:py-24"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Meet the Makers
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
            The hands behind every piece
          </h2>
          <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Local sellers from across the Philippines. Fresh produce, pantry staples, and home essentials.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/listings"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <ScrollButton
              direction="left"
              disabled={!canScrollLeft}
              onClick={() => scrollBy(-1)}
            />
            <ScrollButton
              direction="right"
              disabled={!canScrollRight}
              onClick={() => scrollBy(1)}
            />
          </div>
        </div>
      </motion.div>

      <div
        ref={containerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {vendors.map((vendor, i) => (
          <VendorCard key={vendor.id} vendor={vendor} index={i} reduce={!!reduce} />
        ))}
      </div>

      {/* Mobile scroll indicator */}
      <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400 md:hidden">
        ← Swipe to see more makers →
      </p>
    </section>
  )
}

function VendorCard({
  vendor,
  index,
  reduce,
}: {
  vendor: Vendor
  index: number
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(index * 0.05, 0.3) }}
      className="w-[80vw] shrink-0 snap-start sm:w-[300px] md:w-[320px]"
    >
      <Link
        href="/listings"
        className="group block h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-700"
      >
        <div className="flex items-start gap-4">
          {vendor.avatarUrl ? (
            <Image
              src={`${vendor.avatarUrl}?v=3`}
              alt={vendor.name}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full border-2 border-primary-200 object-cover dark:border-primary-800"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-100 text-xl font-bold text-primary-700 dark:border-primary-800 dark:bg-primary-900/40 dark:text-primary-300">
              {vendor.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-neutral-800 dark:text-neutral-100">
              {vendor.name}
            </h3>
            {vendor.location && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                <MapPin className="h-3 w-3 text-primary-500" />
                <span className="truncate">{vendor.location}</span>
              </p>
            )}
          </div>
        </div>

        {vendor.bio && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {vendor.bio}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {vendor.listingCount} {vendor.listingCount === 1 ? 'product' : 'products'}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-transform group-hover:translate-x-0.5 dark:text-primary-400">
            Visit store
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function ScrollButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
