'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'

interface ViewedItem {
  id: string
  slug: string
  title: string
  price: number
  imageUrl: string | null
}

export function RecentlyViewed({ listings: all }: { listings: ViewedItem[] }) {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('likha_recently_viewed')
      setIds(raw ? JSON.parse(raw) : [])
    } catch { setIds([]) }
  }, [])

  const items = ids
    .map(id => all.find(l => l.id === id))
    .filter((x): x is ViewedItem => x !== undefined)
    .slice(0, 6)

  if (items.length < 3) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary-500" />
        <h2 className="font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Recently viewed
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/listings/${item.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-all hover:shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 640px) 50vw, 16vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl text-neutral-300">{item.title.charAt(0)}</div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-neutral-500 truncate">{item.title}</p>
              <p className="mt-0.5 text-sm font-bold text-neutral-800 dark:text-neutral-100">
                ₱{(item.price / 100).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
