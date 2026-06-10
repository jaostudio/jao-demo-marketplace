'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const router = useRouter()
  const locale = useLocale()

  function toggle() {
    const next = locale === 'en' ? 'tl' : 'en'
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{locale === 'en' ? 'TL' : 'EN'}</span>
    </button>
  )
}
