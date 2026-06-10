'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setFlashSale, removeFlashSale } from '@/lib/actions/admin'
import { Loader2, Tag, X } from 'lucide-react'

interface ListingItem {
  id: string
  title: string
  price: number
  vendorName: string
  isFlashSale: boolean
  flashSalePrice: number | null
  flashSaleEnds: string | null
}

export function FlashSaleManager({ listings }: { listings: ListingItem[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ price: '', ends: '' })

  async function handleSet(listingId: string) {
    setSaving(listingId)
    try {
      await setFlashSale(listingId, {
        flashSalePrice: parseFloat(form.price),
        flashSaleEnds: form.ends,
      })
      setEditingId(null)
      setForm({ price: '', ends: '' })
      router.refresh()
    } catch {}
    setSaving(null)
  }

  async function handleRemove(listingId: string) {
    setSaving(listingId)
    await removeFlashSale(listingId)
    setSaving(null)
    router.refresh()
  }

  return (
    <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
      {listings.length === 0 ? (
        <p className="p-8 text-center text-sm text-neutral-500">No approved products available.</p>
      ) : (
        listings.map(l => (
          <div key={l.id} className="flex items-center justify-between p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {l.title}
                {l.isFlashSale && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">On sale</span>}
              </p>
              <p className="text-xs text-neutral-500">
                ₱{(l.price / 100).toFixed(2)} - {l.vendorName}
                {l.flashSalePrice && <span className="ml-2 text-amber-600">Flash: ₱{(l.flashSalePrice / 100).toFixed(2)}</span>}
                {l.flashSaleEnds && <span className="ml-2">until {new Date(l.flashSaleEnds).toLocaleDateString()}</span>}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
              {editingId === l.id ? (
                <div className="flex items-center gap-2">
                  <input type="number" step="0.01" min={0} placeholder="Sale price (₱)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="h-9 w-28 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900" />
                  <input type="date" value={form.ends} onChange={e => setForm(f => ({ ...f, ends: e.target.value }))} className="h-9 w-32 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900" />
                  <button onClick={() => handleSet(l.id)} disabled={saving === l.id || !form.price} className="inline-flex h-8 items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                    {saving === l.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Tag className="h-3 w-3" />}
                    Set
                  </button>
                  <button onClick={() => setEditingId(null)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(l.id); setForm({ price: l.flashSalePrice ? (l.flashSalePrice / 100).toFixed(2) : '', ends: l.flashSaleEnds ? l.flashSaleEnds.split('T')[0] : '' }) }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                    {l.isFlashSale ? 'Edit' : 'Set sale'}
                  </button>
                  {l.isFlashSale && (
                    <button onClick={() => handleRemove(l.id)} disabled={saving === l.id} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      {saving === l.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Remove'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
