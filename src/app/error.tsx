'use client'

import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
        <ShoppingBasket className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        Oops, something went wrong
      </h2>
      <p className="mt-2 text-sm text-neutral-500">
        {error.message || "That wasn't supposed to happen. Want to try again?"}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
