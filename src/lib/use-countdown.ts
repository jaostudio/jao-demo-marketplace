'use client'

import { useState, useEffect } from 'react'

export function useCountdown(target: string | null) {
  const [remaining, setRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!target) { setRemaining(null); setExpired(false); return }

    function tick() {
      if (!target) { setRemaining(null); setExpired(false); return }
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setRemaining(null); setExpired(true); return }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
      setExpired(false)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [target])

  return { remaining, expired }
}
