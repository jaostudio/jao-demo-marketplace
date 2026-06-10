'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { changeUserRole } from '@/lib/actions/admin'
import { Loader2 } from 'lucide-react'

interface UserRoleManagerProps {
  userId: string
  currentRole: string
  isSelf: boolean
}

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  VENDOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  BUYER: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
}

export function UserRoleManager({ userId, currentRole, isSelf }: UserRoleManagerProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as 'BUYER' | 'VENDOR' | 'ADMIN'
    if (newRole === currentRole) return
    setPending(true)
    setError('')
    try {
      await changeUserRole(userId, newRole)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      e.target.value = currentRole
    }
    setPending(false)
  }

  return (
    <div className="flex items-center gap-2">
      {isSelf ? (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[currentRole] ?? ''}`}>
          {currentRole} (you)
        </span>
      ) : (
        <div className="flex items-center gap-1.5">
          <select
            defaultValue={currentRole}
            onChange={handleRoleChange}
            disabled={pending}
            className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <option value="BUYER">BUYER</option>
            <option value="VENDOR">VENDOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {pending && <Loader2 className="h-3 w-3 animate-spin text-neutral-400" />}
        </div>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
