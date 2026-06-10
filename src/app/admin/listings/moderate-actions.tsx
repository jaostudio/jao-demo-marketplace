'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { moderateListing } from '@/lib/actions/orders'

export function ModerateActions({ listingId }: { listingId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handle(action: 'approve' | 'reject') {
    setPending(true)
    try {
      await moderateListing(listingId, action)
      router.refresh()
    } catch {
      setPending(false)
    }
  }

  return (
    <div className="mt-3 flex gap-3">
      <button
        onClick={() => handle('approve')}
        disabled={pending}
        className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handle('reject')}
        disabled={pending}
        className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
