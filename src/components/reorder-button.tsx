'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cart'
import { toast } from 'sonner'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ReorderButtonProps {
  items: { listingId: string; productName: string; priceAtPurchase: number; quantity: number; vendorId: string; vendorName: string }[]
}

export function ReorderButton({ items }: ReorderButtonProps) {
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)
  const [pending, setPending] = useState(false)

  function handleReorder() {
    setPending(true)
    for (const item of items) {
      addItem({
        listingId: item.listingId,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        name: item.productName,
        price: item.priceAtPurchase,
        imageUrl: null,
        quantity: item.quantity,
      })
    }
    toast.success('Added to your basket!')
    setTimeout(() => {
      router.push('/cart')
    }, 500)
  }

  return (
    <button
      onClick={handleReorder}
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingBag className="h-4 w-4" />
      )}
      {pending ? 'Adding…' : 'Reorder'}
    </button>
  )
}
