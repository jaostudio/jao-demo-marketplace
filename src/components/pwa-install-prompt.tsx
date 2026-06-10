'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  async function handleInstall() {
    if (!deferredPrompt) return
    ;(deferredPrompt as any).prompt()
    const result = await (deferredPrompt as any).userChoice
    setShow(false)
    setDeferredPrompt(null)
  }

  return (
    <button
      onClick={handleInstall}
      aria-label="Install Palengkee"
      className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
    >
      <Download className="h-5 w-5" />
    </button>
  )
}
