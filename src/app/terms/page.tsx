import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Palengkee',
  description: 'Palengkee terms of service and conditions for buyers and vendors.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">Terms of Service</h1>
      <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        This is a demo marketplace project intended for portfolio and demonstration purposes only.
        No real transactions, payments, or binding agreements are made through this site.
      </p>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        All product listings, orders, and user data are simulated and should not be treated as real commercial activity.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
      >
        Back to home
      </Link>
    </div>
  )
}
