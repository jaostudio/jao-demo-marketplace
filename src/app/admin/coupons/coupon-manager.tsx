'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCoupon, updateCoupon, deleteCoupon } from '@/lib/actions/admin'
import { Plus, Save, Trash2, X, Loader2 } from 'lucide-react'

interface CouponData {
  id: string
  code: string
  kind: 'percent' | 'fixed'
  value: number
  label: string
  maxUses: number
  useCount: number
  active: boolean
  expiresAt: string | null
}

export function CouponManager({ coupons: initial }: { coupons: CouponData[] }) {
  const router = useRouter()
  const [coupons, setCoupons] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<{ code: string; kind: 'percent' | 'fixed'; value: number; label: string; maxUses: number; expiresAt: string }>({ code: '', kind: 'percent', value: 10, label: '', maxUses: 0, expiresAt: '' })

  async function handleCreate() {
    setSaving(true)
    try {
      await createCoupon({ ...form, value: form.kind === 'percent' ? form.value : Math.round(form.value * 100) })
      setShowNew(false)
      setForm({ code: '', kind: 'percent', value: 10, label: '', maxUses: 0, expiresAt: '' })
      router.refresh()
    } catch {}
    setSaving(false)
  }

  async function handleUpdate(id: string) {
    setSaving(true)
    try {
      const c = coupons.find(c => c.id === id)!
      await updateCoupon(id, {
        code: c.code,
        kind: c.kind,
        value: c.kind === 'percent' ? c.value : Math.round(c.value / 100),
        label: c.label,
        maxUses: c.maxUses,
        active: c.active,
        expiresAt: c.expiresAt ?? undefined,
      })
      setEditingId(null)
      router.refresh()
    } catch {}
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return
    await deleteCoupon(id)
    setCoupons(prev => prev.filter(c => c.id !== id))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowNew(!showNew)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
      >
        <Plus className="h-4 w-4" />
        New coupon
      </button>

      {showNew && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <input placeholder="Code (e.g. SAVE20)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="col-span-2 h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
            <select value={form.kind} onChange={e => setForm(f => ({ ...f, kind: e.target.value as 'percent' | 'fixed' }))} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount off</option>
            </select>
            <input type="number" min={0} placeholder={form.kind === 'percent' ? 'e.g. 10' : 'e.g. 200'} value={form.value} onChange={e => setForm(f => ({ ...f, value: parseInt(e.target.value) || 0 }))} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
            <input placeholder="Label (e.g. 10% off)" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
            <input type="number" min={0} placeholder="Max uses (0 = unlimited)" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: parseInt(e.target.value) || 0 }))} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
            <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="col-span-2 h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving || !form.code} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-500 px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Create
            </button>
            <button onClick={() => setShowNew(false)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {coupons.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">No coupons yet.</p>
      ) : (
        <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
          {coupons.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4">
              {editingId === c.id ? (
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input defaultValue={c.code} onChange={e => { c.code = e.target.value }} className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900" />
                  <select defaultValue={c.kind} onChange={e => c.kind = e.target.value as 'percent' | 'fixed'} className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <input type="number" min={0} defaultValue={c.kind === 'percent' ? c.value : Math.round(c.value / 100)} onChange={e => c.value = c.kind === 'percent' ? parseInt(e.target.value) || 0 : Math.round(parseFloat(e.target.value) * 100)} className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900" />
                  <input defaultValue={c.label} onChange={e => c.label = e.target.value} className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900" />
                  <input type="number" min={0} defaultValue={c.maxUses} onChange={e => c.maxUses = parseInt(e.target.value) || 0} className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900" />
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" defaultChecked={c.active} onChange={e => c.active = e.target.checked} className="rounded" />
                    Active
                  </label>
                  <div className="col-span-3 flex gap-2 mt-1">
                    <button onClick={() => handleUpdate(c.id)} disabled={saving} className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary-500 px-3 text-xs font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
                      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                      {c.code}
                    </span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{c.label}</span>
                    <span className="text-xs text-neutral-500">
                      {c.kind === 'percent' ? `${c.value}% off` : `₱${(c.value / 100).toFixed(0)} off`}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {c.useCount}/{c.maxUses || '∞'} used
                    </span>
                    {c.expiresAt && (
                      <span className="text-xs text-neutral-400">expires {new Date(c.expiresAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingId(c.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
