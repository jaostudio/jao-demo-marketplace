'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Loader2, Check, Lock, Clock } from 'lucide-react'
import { createBooking } from '@/lib/actions/booking'

interface BookingFormProps {
  listing: { id: string; title: string; price: number; bookingDuration: number | null }
  userId: string | null
}

export function BookingForm({ listing, userId }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!userId) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <Lock className="mx-auto h-8 w-8 text-neutral-400" />
        <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Sign in to book this experience</p>
        <Link
          href={`/auth/signin?callbackUrl=/booking/${listing.id}`}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) { setError('Pick a date to continue'); return }
    setPending(true)
    setError('')
    try {
      await createBooking(listing.id, date, message || undefined)
      setDone(true)
      setTimeout(() => router.push('/orders'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oops, something went wrong')
      setPending(false)
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20">
        <Check className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
        <p className="mt-3 text-sm font-semibold text-green-800 dark:text-green-200">Booking confirmed!</p>
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">Redirecting to your orders…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Select a date</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="mt-3 block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
        {listing.bookingDuration && (
          <p className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
            <Clock className="h-3 w-3" />
            Duration: ~{listing.bookingDuration} minutes
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Special requests (optional)</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Any preferences or questions for the maker…"
          className="mt-3 block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calendar className="h-5 w-5" />}
        {pending ? 'Booking…' : `Book experience`}
      </button>
    </form>
  )
}
