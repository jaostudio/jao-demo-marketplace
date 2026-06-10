import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ListingCard, type ListingCardData } from '@/components/listing-card'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Wishlist | Palengkee',
  description: 'View your saved products and favorites.',
}

export default async function WishlistPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/signin')

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      listing: {
        include: {
          vendor: {
            select: { id: true, name: true, avatarUrl: true, location: true },
          },
          category: { select: { name: true, slug: true } },
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const cardData: ListingCardData[] = items.map(({ listing: l }) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    price: l.price,
    flashSalePrice: l.flashSalePrice,
    isFlashSale: l.isFlashSale,
    flashSaleEnds: l.flashSaleEnds?.toISOString() ?? null,
    stock: l.stock,
    isService: l.isService,
    isWished: true,
    imageUrl: l.images[0]?.url ?? null,
    vendor: {
      id: l.vendor.id,
      name: l.vendor.name,
      avatarUrl: l.vendor.avatarUrl,
      location: l.vendor.location,
    },
    category: { name: l.category.name, slug: l.category.slug },
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Saved for later
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-5xl">
          My Wishlist
        </h1>
        <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {cardData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <Heart className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 font-serif text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            Your wishlist is feeling empty
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {cardData.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  )
}
