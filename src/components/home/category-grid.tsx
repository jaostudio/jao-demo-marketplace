'use client'

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface CategoryTile {
  id: string
  name: string
  slug: string
  coverUrl: string | null
  listingCount?: number
}

interface CategoryGridProps {
  categories: CategoryTile[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const reduce = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const tileVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'visible'}
        viewport={{ once: true, margin: '-100px' }}
        variants={reduce ? undefined : containerVariants}
      >
        <motion.div
          variants={reduce ? undefined : tileVariants}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Shop by Category
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
              Everything you need, fresh daily
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
          >
            All categories
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={reduce ? undefined : tileVariants}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function CategoryCard({ category }: { category: CategoryTile }) {
  return (
    <Link
      href={`/listings?category=${category.slug}`}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-800 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
    >
      <span>{category.name}</span>
      {category.listingCount !== undefined && (
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {category.listingCount}
        </span>
      )}
    </Link>
  )
}
