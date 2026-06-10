'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const role = form.get('role') as string

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        role,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Registration failed')
      setPending(false)
      return
    }

    router.push('/auth/signin')
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-bold tracking-tight text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
          <input id="name" name="name" required className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required minLength={8} className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">I want to...</label>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer rounded-xl border border-neutral-200 p-3 text-center has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50 dark:border-neutral-800 dark:has-[:checked]:border-neutral-100 dark:has-[:checked]:bg-neutral-900">
              <input type="radio" name="role" value="BUYER" defaultChecked className="sr-only" />
              <span className="text-sm font-medium">Buy</span>
            </label>
            <label className="flex-1 cursor-pointer rounded-xl border border-neutral-200 p-3 text-center has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50 dark:border-neutral-800 dark:has-[:checked]:border-neutral-100 dark:has-[:checked]:bg-neutral-900">
              <input type="radio" name="role" value="VENDOR" className="sr-only" />
              <span className="text-sm font-medium">Sell</span>
            </label>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={pending} className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900">
          {pending ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/auth/signin" className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">
          Sign in
        </Link>
      </p>
    </div>
  )
}
