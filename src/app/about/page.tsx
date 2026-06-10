import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Palengkee',
  description: 'Learn about Palengkee — a community marketplace connecting Filipino farmers, vendors, and buyers directly.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">About Palengkee</h1>
      <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        Palengkee is a multi-vendor marketplace connecting Filipino communities with fresh produce,
        local essentials, and everyday goods - direct from vendors to your doorstep.
      </p>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        Every purchase supports local livelihoods and keeps neighborhoods thriving.
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
