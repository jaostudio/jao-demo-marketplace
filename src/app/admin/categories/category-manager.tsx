'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'
import { Loader2, Plus, Pencil, Trash2, X, Check } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  coverUrl: string | null
  _count: { listings: number }
}

export function CategoryManager({ categories: initial }: { categories: Category[] }) {
  const router = useRouter()
  const [categories] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      await createCategory(new FormData(e.currentTarget))
      setShowCreate(false)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    }
    setPending(false)
  }

  async function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      await updateCategory(id, new FormData(e.currentTarget))
      setEditingId(null)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    }
    setPending(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Listings in it must be reassigned first.')) return
    setPending(true)
    setError('')
    try {
      await deleteCategory(id)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    }
    setPending(false)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-800 dark:text-neutral-100">New Category</h2>
            <button type="button" onClick={() => setShowCreate(false)} className="text-neutral-400 hover:text-neutral-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="name" placeholder="Name *" required className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
            <input name="icon" placeholder="Icon emoji (e.g. 🧵)" className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
            <input name="coverUrl" placeholder="Cover image URL" className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
          </div>
          <button type="submit" disabled={pending} className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create
          </button>
        </form>
      )}

      {/* Category list */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            {editingId === cat.id ? (
              <form onSubmit={(e) => handleUpdate(cat.id, e)} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <input name="name" defaultValue={cat.name} required className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
                  <input name="icon" defaultValue={cat.icon ?? ''} placeholder="Icon emoji" className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
                  <input name="coverUrl" defaultValue={cat.coverUrl ?? ''} placeholder="Cover image URL" className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-500 px-4 text-xs font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-400">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cat.icon && <span className="text-lg">{cat.icon}</span>}
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-100">{cat.name}</p>
                    <p className="text-xs text-neutral-400">{cat.slug} &middot; {cat._count.listings} listing{cat._count.listings !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingId(cat.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} disabled={pending} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-red-500 disabled:opacity-50 dark:hover:bg-neutral-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showCreate && (
        <button onClick={() => setShowCreate(true)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600">
          <Plus className="h-4 w-4" />
          Add category
        </button>
      )}
    </div>
  )
}
