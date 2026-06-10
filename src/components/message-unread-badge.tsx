'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { getUnreadMessageCount } from '@/lib/actions/messages'

export function MessageUnreadBadge() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    getUnreadMessageCount().then(setUnread).catch(() => setUnread(0))
    const interval = setInterval(() => {
      getUnreadMessageCount().then(setUnread).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link
      href="/messages"
      aria-label="Messages"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
    >
      <MessageSquare className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-warm-sm">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}
