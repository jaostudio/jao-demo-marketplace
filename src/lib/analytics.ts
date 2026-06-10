'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { emit } from '@jaostudio/core/events'

export function usePageViewAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    emit.pageview(pathname)
  }, [pathname])
}

export function trackClick(label: string, href?: string) {
  emit.actionClicked(label, href)
}
