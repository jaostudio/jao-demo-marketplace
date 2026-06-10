'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateConversation } from '@/lib/actions/messages'
import { MessageSquare, Loader2 } from 'lucide-react'

interface Props {
  vendorId: string
  listingId?: string
  label?: string
  className?: string
}

export function MessageVendorButton({ vendorId, listingId, label = 'Message', className = '' }: Props) {
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (pending) return
    setPending(true)
    try {
      const { id } = await getOrCreateConversation(vendorId, listingId)
      router.push(`/messages/${id}`)
    } catch {
      // ignore
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${className}`}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
      {label}
    </button>
  )
}
