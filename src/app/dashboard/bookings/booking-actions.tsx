'use client'

import { useTransition } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { updateBookingStatus } from '@/lib/actions/booking'
import { useRouter } from 'next/navigation'

export function BookingActions({ bookingId, status }: { bookingId: string; status: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  if (status !== 'PENDING') return <span className="text-xs text-neutral-400"> - </span>

  const handleConfirm = () => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, 'CONFIRMED')
      router.refresh()
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, 'CANCELLED')
      router.refresh()
    })
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={handleConfirm}
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 transition-colors hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
        title="Confirm booking"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        onClick={handleCancel}
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        title="Cancel booking"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
