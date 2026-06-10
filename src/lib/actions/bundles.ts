'use server'

import { prisma } from '@/lib/prisma'

export async function getBundlesForListing(listingId: string) {
  const bundles = await prisma.bundle.findMany({
    where: {
      active: true,
      items: { some: { listingId } },
    },
    include: {
      items: {
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              isFlashSale: true,
              flashSalePrice: true,
              flashSaleEnds: true,
              images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
              vendor: { select: { name: true } },
            },
          },
        },
      },
    },
  })
  return bundles
}
