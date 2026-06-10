'use client'

import { Info } from 'lucide-react'

export function DemoBanner({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="bg-primary-500 text-white text-center text-xs font-medium py-2 px-4">
      <span className="inline-flex items-center gap-1.5">
        <Info className="h-3 w-3" />
        Demo Mode - No real charges. Use test card <span className="font-mono">4242 4242 4242 4242</span>.
      </span>
    </div>
  )
}
