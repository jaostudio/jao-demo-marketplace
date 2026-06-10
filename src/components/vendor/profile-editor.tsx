'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateVendorProfile } from '@/lib/actions/orders'
import { Loader2, Plus, X } from 'lucide-react'

interface ProfileEditorProps {
  vendor: {
    name: string
    avatarUrl: string | null
    bio: string | null
    location: string | null
    socialLinks: unknown
  }
}

export function ProfileEditor({ vendor }: ProfileEditorProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const initialLinks: Record<string, string> =
    typeof vendor.socialLinks === 'object' && vendor.socialLinks
      ? (vendor.socialLinks as Record<string, string>)
      : {}

  const [links, setLinks] = useState<{ platform: string; url: string }[]>(
    Object.keys(initialLinks).length > 0
      ? Object.entries(initialLinks).map(([platform, url]) => ({ platform, url }))
      : [{ platform: '', url: '' }],
  )

  function addLink() {
    setLinks([...links, { platform: '', url: '' }])
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index))
  }

  function updateLink(index: number, field: 'platform' | 'url', value: string) {
    const updated = [...links]
    updated[index][field] = value
    setLinks(updated)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    setSuccess(false)

    const form = new FormData(e.currentTarget)

    const socialLinks: Record<string, string> = {}
    for (const link of links) {
      if (link.platform && link.url) {
        socialLinks[link.platform] = link.url
      }
    }
    form.set('socialLinks', JSON.stringify(socialLinks))

    try {
      await updateVendorProfile(form)
      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    }
    setPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Store name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={vendor.name}
          className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Avatar URL
        </label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          defaultValue={vendor.avatarUrl ?? ''}
          placeholder="https://images.unsplash.com/..."
          className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={vendor.bio ?? ''}
          placeholder="Tell customers about your products..."
          className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={vendor.location ?? ''}
          placeholder="e.g. Cebu City, Philippines"
          className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Social links
        </label>
        <p className="mt-0.5 text-xs text-neutral-400">
          Add links to your social media profiles.
        </p>
        <div className="mt-2 space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => updateLink(i, 'platform', e.target.value)}
                placeholder="Platform (e.g. Instagram)"
                className="block w-2/5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, 'url', e.target.value)}
                placeholder="https://instagram.com/..."
                className="block flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
          >
            <Plus className="h-4 w-4" />
            Add link
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          Profile saved successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 text-sm font-semibold text-white shadow-warm-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
