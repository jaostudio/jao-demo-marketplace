'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function addWishlistItem(listingId: string): Promise<void> {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')

  if (user.role !== 'BUYER') {
    throw new Error('Only buyers can use the wishlist')
  }

  await prisma.wishlistItem.upsert({
    where: { userId_listingId: { userId: user.id, listingId } },
    update: {},
    create: { userId: user.id, listingId },
  })

  revalidatePath('/wishlist')
}

export async function removeWishlistItem(listingId: string): Promise<void> {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')

  await prisma.wishlistItem.deleteMany({
    where: { userId: user.id, listingId },
  })

  revalidatePath('/wishlist')
}

export async function getWishlistIds(): Promise<string[]> {
  const user = await getSessionUser()
  if (!user) return []

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    select: { listingId: true },
  })
  return items.map((i) => i.listingId)
}

export async function toggleWishlistItem(
  listingId: string,
  currentlyWished: boolean
): Promise<{ wished: boolean }> {
  if (currentlyWished) {
    await removeWishlistItem(listingId)
    return { wished: false }
  } else {
    await addWishlistItem(listingId)
    return { wished: true }
  }
}
