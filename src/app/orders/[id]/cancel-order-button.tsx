'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cancelOrder } from '@/lib/actions/orders'

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleCancel() {
    setError('')
    startTransition(async () => {
      try {
        await cancelOrder(orderId)
        toast.success('Order cancelled')
        router.push('/orders')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not cancel order')
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-neutral-900 dark:text-red-300 dark:hover:bg-red-900/20"
      >
        <X className="h-4 w-4" />
        Cancel order
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm font-semibold text-red-900 dark:text-red-100">
        Cancel this order?
      </p>
      <p className="mt-1 text-xs text-red-800 dark:text-red-200">
        This can&apos;t be undone. The order will be removed.
      </p>
      {error && (
        <p className="mt-2 text-xs font-medium text-red-900 dark:text-red-100">{error}</p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleCancel}
          disabled={pending}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Cancelling…
            </>
          ) : (
            'Yes, cancel'
          )}
        </button>
        <button
          onClick={() => setOpen(false)}
          disabled={pending}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-red-200 bg-white text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-neutral-900 dark:text-red-200"
        >
          Keep order
        </button>
      </div>
    </div>
  )
}
