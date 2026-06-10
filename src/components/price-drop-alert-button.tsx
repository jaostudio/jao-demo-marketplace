'use client'

import { toast } from 'sonner'
import { Bell } from 'lucide-react'

export function PriceDropAlertButton({ listingId: _listingId }: { listingId: string }) {
  return (
    <button
      onClick={() =>
        toast.success('We\u2019ll notify you if the price drops!', {
          description: 'You\u2019ll get an email alert when this item goes on sale.',
        })
      }
      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      <Bell className="h-3.5 w-3.5" />
      Notify me
    </button>
  )
}
