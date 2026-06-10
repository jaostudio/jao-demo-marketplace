'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/store/cart'
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

const ABANDON_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes

export function AbandonedCartTracker() {
  const items = useCart((s) => s.items)
  const savedAt = useCart((s) => s.savedAt)
  const touch = useCart((s) => s.touch)
  const shown = useRef(false)

  useEffect(() => {
    if (shown.current) return
    if (items.length === 0 || !savedAt) return
    if (Date.now() - savedAt < ABANDON_THRESHOLD_MS) return

    shown.current = true
    const count = items.reduce((s, i) => s + i.quantity, 0)
    toast(
      <Link href="/cart" className="flex items-center gap-3 text-sm" onClick={() => touch()}>
        <ShoppingCart className="h-5 w-5 text-primary-500" />
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-100">
            You left {count} {count === 1 ? 'item' : 'items'} in your cart
          </p>
          <p className="text-neutral-500">Complete your order now</p>
        </div>
      </Link>,
      { duration: 8000, position: 'bottom-right' },
    )
  }, [items.length, savedAt, touch])

  return null
}
