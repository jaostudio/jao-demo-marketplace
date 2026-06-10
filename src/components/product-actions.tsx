'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BarChart3, Check, Copy, Facebook, Twitter } from 'lucide-react'

const COMPARE_KEY = 'likha_compare'

function getCompareIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(COMPARE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function setCompareIds(ids: string[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids))
}

export function CompareButton({ listingId, title }: { listingId: string; title: string }) {
  const [inCompare, setInCompare] = useState(false)

  useEffect(() => {
    const ids = getCompareIds()
    setInCompare(ids.includes(listingId))
  }, [listingId])

  function toggle() {
    let ids = getCompareIds()
    if (ids.includes(listingId)) {
      ids = ids.filter(id => id !== listingId)
      toast.success(`Removed "${title}" from compare`)
    } else {
      if (ids.length >= 4) {
        toast.error('Maximum 4 products to compare')
        return
      }
      ids.push(listingId)
      toast.success(`Added "${title}" to compare`)
    }
    setCompareIds(ids)
    setInCompare(ids.includes(listingId))
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-medium transition-colors ${
        inCompare
          ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
          : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400'
      }`}
    >
      <BarChart3 className="h-4 w-4" />
      {inCompare ? 'Added' : 'Compare'}
    </button>
  )
}

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/listings/${slug}` : ''

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <button
        onClick={copyLink}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

export function RecentlyViewedTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem('likha_recently_viewed')
      const ids: string[] = raw ? JSON.parse(raw) : []
      const filtered = ids.filter(id => id !== listingId)
      filtered.unshift(listingId)
      localStorage.setItem('likha_recently_viewed', JSON.stringify(filtered.slice(0, 12)))
    } catch {}
  }, [listingId])

  return null
}

export function CompareFloatingBar() {
  const router = useRouter()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    function update() {
      setIds(getCompareIds())
    }
    update()
    window.addEventListener('storage', update)
    return () => window.removeEventListener('storage', update)
  }, [])

  if (ids.length < 2) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-3 shadow-warm-lg dark:border-neutral-700 dark:bg-neutral-900">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {ids.length} selected
        </span>
        <button
          onClick={() => { localStorage.removeItem(COMPARE_KEY); setIds([]) }}
          className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Clear
        </button>
        <button
          onClick={() => router.push(`/compare?ids=${ids.join(',')}`)}
          className="inline-flex h-9 items-center rounded-xl bg-primary-500 px-4 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Compare
        </button>
      </div>
    </div>
  )
}
