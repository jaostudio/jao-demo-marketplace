import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Palengkee',
  description: 'Palengkee privacy policy explaining how we handle your data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">Privacy Policy</h1>
      <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        This is a demo marketplace project. No real user data is collected, stored, or shared.
        Any data entered on this site is used solely for demonstration purposes and stored locally in the demo database.
      </p>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        For questions about this demo, please contact the project owner.
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
