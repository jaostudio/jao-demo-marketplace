'use client'

import { motion } from 'framer-motion'
import { Wallet, ShoppingBag, Package, Star } from 'lucide-react'
import { Price } from '@/components/price'

interface MetricsCardsProps {
  totalRevenue: number
  totalOrders: number
  totalListings: number
  averageRating: number
}

export function MetricsCards({
  totalRevenue,
  totalOrders,
  totalListings,
  averageRating,
}: MetricsCardsProps) {
  const cards = [
    {
      icon: <Wallet className="h-5 w-5" />,
      label: 'Total Revenue',
      value: <Price amountCents={totalRevenue} />,
      color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: 'Orders',
      value: totalOrders,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Listings',
      value: totalListings,
      color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: 'Average Rating',
      value: averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : ' - ',
      color: 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
            {card.icon}
          </div>
          <p className="mt-4 text-sm text-neutral-500">{card.label}</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
