import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
        <ShoppingBasket className="h-8 w-8" strokeWidth={2.25} />
      </div>
      <h1 className="mt-6 font-serif text-5xl font-bold text-neutral-800 dark:text-neutral-100">
        404
      </h1>
      <p className="mt-2 text-lg text-neutral-500">
        We looked everywhere, even under the bilao.
      </p>
      <p className="mt-1 text-sm text-neutral-400">
        This page seems to have wandered off. Head back to the market?
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary-500 px-8 text-sm font-semibold text-white shadow-warm-sm transition-colors hover:bg-primary-600"
      >
        Back to home
      </Link>
    </div>
  )
}
