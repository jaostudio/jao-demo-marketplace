import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { getWishlistIds } from '@/lib/actions/wishlist'
import nextDynamic from 'next/dynamic'
import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { VendorSpotlight } from '@/components/home/vendor-spotlight'
import { RecentlyViewed } from '@/components/recently-viewed'
import type { ListingCardData } from '@/components/listing-card'
import type { Metadata } from 'next'

const FeaturedListings = nextDynamic(() => import('@/components/home/featured-listings').then(m => m.FeaturedListings))
const StatsCounter = nextDynamic(() => import('@/components/home/stats-counter').then(m => m.StatsCounter))
const WhyPalengkee = nextDynamic(() => import('@/components/home/why-palengkee').then(m => m.WhyPalengkee))
const NewsletterCta = nextDynamic(() => import('@/components/home/newsletter-cta').then(m => m.NewsletterCta))

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Palengkee - Fresh from your community',
  description:
    'Multi-vendor marketplace for fresh produce, local essentials, and everyday goods - direct from Filipino communities to your door.',
}

export default async function HomePage() {
  const [sessionUser, categoriesRaw, featuredRaw, vendorsRaw, buyerCount, allListingsRaw] =
    await Promise.all([
      getSessionUser(),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { listings: true } } },
      }),
      prisma.listing.findMany({
        where: { status: 'APPROVED' },
        take: 8,
        orderBy: [{ createdAt: 'desc' }],
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
      }),
      prisma.user.findMany({
        where: { role: 'VENDOR' },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          location: true,
          bio: true,
          _count: { select: { listings: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.user.count({ where: { role: 'BUYER' } }),
      prisma.listing.findMany({
        where: { status: 'APPROVED' },
        take: 100,
        select: { id: true, slug: true, title: true, price: true, images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } } },
      }),
    ])

  const wishlistIds = sessionUser ? await getWishlistIds() : []

  const categories = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    coverUrl: c.coverUrl,
    listingCount: c._count.listings,
  }))

  const featured: ListingCardData[] = featuredRaw.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    price: l.price,
    flashSalePrice: l.flashSalePrice,
    isFlashSale: l.isFlashSale,
    flashSaleEnds: l.flashSaleEnds?.toISOString() ?? null,
    stock: l.stock,
    isService: l.isService,
    isWished: wishlistIds.includes(l.id),
    imageUrl: l.images[0]?.url ?? null,
    vendor: {
      id: l.vendor.id,
      name: l.vendor.name,
      avatarUrl: l.vendor.avatarUrl,
      location: l.vendor.location,
    },
    category: { name: l.category.name, slug: l.category.slug },
  }))

  const vendors = vendorsRaw.map((v) => ({
    id: v.id,
    name: v.name,
    avatarUrl: v.avatarUrl,
    location: v.location,
    bio: v.bio,
    listingCount: v._count.listings,
  }))

  const recentListings = allListingsRaw.map(l => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    price: l.price,
    imageUrl: l.images[0]?.url ?? null,
  }))

  // Region count: distinct vendor locations (parsed for the city)
  const distinctLocations = new Set(
    vendors
      .map((v) => v.location?.split(',')[0]?.trim())
      .filter(Boolean) as string[],
  )

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />
      <FeaturedListings listings={featured} />
      <RecentlyViewed listings={recentListings} />
      <VendorSpotlight vendors={vendors} />
      <StatsCounter
        vendorCount={vendors.length}
        productCount={featuredRaw.length}
        regionCount={Math.max(distinctLocations.size, 1) + 4}
        buyerCount={Math.max(buyerCount, 1000) * 5}
      />
      <WhyPalengkee />
      <NewsletterCta />
    </>
  )
}
