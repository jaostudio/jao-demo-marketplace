'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrencyCode } from '@/lib/currency'

interface CurrencyState {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'PHP',
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'likha-currency' },
  ),
)
