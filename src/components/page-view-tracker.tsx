'use client'

import { usePageViewAnalytics } from '@/lib/analytics'

export function PageViewTracker() {
  usePageViewAnalytics()
  return null
}
