'use client'

import { useState } from 'react'
import { saveSiteSettings } from '@/lib/actions/admin'
import { Loader2, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ tagline: 'Fresh from your community', contactEmail: 'hello@palengkee.ph', defaultShippingFee: '150', aboutText: 'Palengkee connects you with local vendors across the Philippines. Every purchase supports local livelihoods and brings fresh goods to your door.' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await saveSiteSettings({ ...form, defaultShippingFee: parseInt(form.defaultShippingFee) || 0 })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">Site Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Configure site-wide options (demo - values are not persisted to DB)</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tagline</label>
          <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Contact email</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Default shipping fee (₱)</label>
          <input type="number" min={0} value={form.defaultShippingFee} onChange={e => setForm(f => ({ ...f, defaultShippingFee: e.target.value }))} className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">About page text</label>
          <textarea rows={5} value={form.aboutText} onChange={e => setForm(f => ({ ...f, aboutText: e.target.value }))} className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}
