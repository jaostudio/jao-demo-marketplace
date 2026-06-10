import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { BookingForm } from './booking-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Service | Palengkee',
  description: 'Schedule a service booking.',
}

export default async function BookingPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params
  const user = await getSessionUser()

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, title: true, price: true, isService: true, bookingDuration: true, vendor: { select: { name: true } } },
  })
  if (!listing || !listing.isService) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">Book a service</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">{listing.title}</h1>
      <p className="mt-1 text-sm text-neutral-500">with {listing.vendor.name}</p>
      <BookingForm listing={listing} userId={user?.id ?? null} />
    </div>
  )
}
