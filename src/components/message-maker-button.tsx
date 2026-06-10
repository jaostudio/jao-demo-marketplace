'use client'

import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export function MessageMakerButton() {
  return (
    <button
      onClick={() => toast.info('Messaging is coming soon. For now, contact the maker directly from their store page.')}
      className="hidden h-9 items-center justify-center rounded-xl border border-neutral-300 px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 sm:inline-flex dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Message maker
    </button>
  )
}
