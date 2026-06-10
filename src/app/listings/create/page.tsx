import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CreateListingForm } from '@/components/vendor/create-listing-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Listing | Palengkee',
  description: 'Create a new product listing.',
  robots: { index: false, follow: false },
}

export default async function CreateListingPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') redirect('/auth/signin')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { slug: true, name: true },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Vendor Dashboard
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Create Listing
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Fill in the details below to add a new product to your store.
        </p>
      </div>
      <CreateListingForm categories={categories} />
    </div>
  )
}
