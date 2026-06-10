'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleUserSuspend } from '@/lib/actions/admin'
import { Loader2 } from 'lucide-react'

export function UserSuspendToggle({ userId, suspended, isSelf }: { userId: string; suspended: boolean; isSelf: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleToggle() {
    setPending(true)
    try {
      await toggleUserSuspend(userId, !suspended)
      router.refresh()
    } catch {}
    setPending(false)
  }

  if (isSelf) return null

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        suspended
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
      }`}
    >
      {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : suspended ? 'Unsuspend' : 'Suspend'}
    </button>
  )
}
