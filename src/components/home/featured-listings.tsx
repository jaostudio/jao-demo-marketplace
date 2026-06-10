'use client'

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ListingCard, ListingCardData } from '@/components/listing-card'

interface FeaturedListingsProps {
  listings: ListingCardData[]
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  const reduce = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  }
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="bg-neutral-100/50 py-20 dark:bg-neutral-900/50 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'visible'}
          viewport={{ once: true, margin: '-100px' }}
          variants={reduce ? undefined : containerVariants}
        >
          <motion.div
            variants={reduce ? undefined : headerVariants}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Hand-picked
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
                Featured products
              </h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
                A curated selection from our vendors - products we especially love this week.
              </p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : containerVariants}
            className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {listings.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                priority={i < 4}
              />
            ))}
          </motion.div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/listings"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
