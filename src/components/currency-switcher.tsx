'use client'

import { useCurrency } from '@/lib/store/currency'
import { Globe } from 'lucide-react'

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <button
      onClick={() => setCurrency(currency === 'PHP' ? 'USD' : 'PHP')}
      aria-label="Switch currency"
      className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
    >
      <Globe className="h-4 w-4" />
      {currency}
    </button>
  )
}
