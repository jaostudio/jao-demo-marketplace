'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { archiveListing } from '@/lib/actions/orders'
import { Pencil, Archive, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function ListingActions({ listingId }: { listingId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleArchive() {
    if (!confirm('Archive this listing? It will be hidden from the marketplace.')) return
    setPending(true)
    try {
      await archiveListing(listingId)
      router.refresh()
    } catch {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/listings/${listingId}/edit`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </Link>
      <button
        onClick={handleArchive}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Archive className="h-3 w-3" />}
        Archive
      </button>
    </div>
  )
}
