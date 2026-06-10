import { getSessionUser } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditListingForm } from '@/components/vendor/edit-listing-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Listing | Palengkee',
  description: 'Edit your product listing.',
  robots: { index: false, follow: false },
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') redirect('/auth/signin')

  const { id } = await params

  const [listing, categories] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, select: { url: true } },
        category: { select: { slug: true } },
        variants: { orderBy: { label: 'asc' }, select: { label: true, priceAdj: true, stock: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { slug: true, name: true },
    }),
  ])

  if (!listing || listing.vendorId !== user.id) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Vendor Dashboard
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Edit Listing
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Updating &ldquo;{listing.title}&rdquo; will resubmit it for review.
        </p>
      </div>
      <EditListingForm
        listingId={listing.id}
        initialTitle={listing.title}
        initialDescription={listing.description}
        initialPrice={listing.price}
        initialStock={listing.stock}
        initialIsService={listing.isService}
        initialCategorySlug={listing.category.slug}
        initialImages={listing.images.map((img) => img.url)}
        initialVariants={listing.variants.map((v) => ({ label: v.label, priceAdj: v.priceAdj, stock: v.stock }))}
        categories={categories}
      />
    </div>
  )
}
