'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createBooking(listingId: string, date: string, message?: string) {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { isService: true, vendorId: true },
  })
  if (!listing || !listing.isService) throw new Error('Not a service listing')
  if (listing.vendorId === user.id) throw new Error('Cannot book your own service')

  const booking = await prisma.booking.create({
    data: {
      listingId,
      buyerId: user.id,
      date: new Date(date),
      message: message ?? null,
      status: 'PENDING',
    },
  })

  await prisma.notification.create({
    data: {
      userId: listing.vendorId,
      type: 'booking_update',
      title: 'New booking request',
      message: `A customer wants to book your service.`,
      link: `/dashboard/bookings`,
    },
  })

  revalidatePath('/dashboard/bookings')
  revalidatePath(`/booking/${listingId}`)

  return { id: booking.id }
}

export async function getUserBookings() {
  const user = await getSessionUser()
  if (!user) return []

  return prisma.booking.findMany({
    where: { buyerId: user.id },
    include: {
      listing: { select: { title: true, slug: true, images: { take: 1, select: { url: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getVendorBookings() {
  const user = await getSessionUser()
  if (!user) return []

  return prisma.booking.findMany({
    where: { listing: { vendorId: user.id } },
    include: {
      buyer: { select: { name: true, email: true } },
      listing: { select: { title: true } },
    },
    orderBy: { date: 'asc' },
  })
}

export async function updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED') {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { select: { vendorId: true, title: true } },
      buyer: { select: { id: true } },
    },
  })
  if (!booking || booking.listing.vendorId !== user.id) throw new Error('Forbidden')

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  })

  const label = status === 'CONFIRMED' ? 'confirmed' : 'cancelled'
  await prisma.notification.create({
    data: {
      userId: booking.buyer.id,
      type: 'booking_update',
      title: `Booking ${label}`,
      message: `Your booking "${booking.listing.title}" has been ${label}.`,
      link: `/dashboard/bookings`,
    },
  })

  revalidatePath('/dashboard/bookings')
}
