import { prisma } from '@/lib/prisma'

export interface SocialLinks {
  facebook?: string
  instagram?: string
  tiktok?: string
  website?: string
}

export function parseSocialLinks(json: unknown): SocialLinks {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {}
  const obj = json as Record<string, unknown>
  const out: SocialLinks = {}
  if (typeof obj.facebook === 'string') out.facebook = obj.facebook
  if (typeof obj.instagram === 'string') out.instagram = obj.instagram
  if (typeof obj.tiktok === 'string') out.tiktok = obj.tiktok
  if (typeof obj.website === 'string') out.website = obj.website
  return out
}

export interface StorefrontListing {
  id: string
  slug: string
  title: string
  price: number
  imageUrl: string | null
  isFlashSale: boolean
  flashSalePrice: number | null
  flashSaleEnds: Date | null
  isService: boolean
  category: { name: string; slug: string }
}

export interface StorefrontReview {
  id: string
  rating: number
  text: string
  createdAt: Date
  author: { name: string; avatarUrl: string | null }
  listingTitle: string
  listingSlug: string
}

export interface StorefrontData {
  id: string
  name: string
  avatarUrl: string | null
  location: string | null
  bio: string | null
  socialLinks: SocialLinks
  metrics: {
    listingCount: number
    orderCount: number
    reviewCount: number
    totalRevenue: number
    averageRating: number
  } | null
  listings: StorefrontListing[]
  reviews: StorefrontReview[]
  categories: { name: string; slug: string }[]
}

export async function getVendorStorefront(id: string): Promise<StorefrontData | null> {
  const vendor = await prisma.user.findFirst({
    where: { id, role: 'VENDOR' },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      location: true,
      bio: true,
      socialLinks: true,
      metrics: {
        select: {
          listingCount: true,
          orderCount: true,
          reviewCount: true,
          totalRevenue: true,
          averageRating: true,
        },
      },
      listings: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          price: true,
          isFlashSale: true,
          flashSalePrice: true,
          flashSaleEnds: true,
          isService: true,
          category: { select: { name: true, slug: true } },
          images: {
            take: 1,
            orderBy: { sortOrder: 'asc' },
            select: { url: true },
          },
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
              id: true,
              rating: true,
              text: true,
              createdAt: true,
              author: { select: { name: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  })

  if (!vendor) return null

  const listings: StorefrontListing[] = vendor.listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    price: l.price,
    imageUrl: l.images[0]?.url ?? null,
    isFlashSale: l.isFlashSale,
    flashSalePrice: l.flashSalePrice,
    flashSaleEnds: l.flashSaleEnds,
    isService: l.isService,
    category: l.category,
  }))

  const reviews: StorefrontReview[] = vendor.listings
    .flatMap((l) =>
      l.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        text: r.text,
        createdAt: r.createdAt,
        author: r.author,
        listingTitle: l.title,
        listingSlug: l.slug,
      })),
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3)

  const categoriesMap = new Map<string, { name: string; slug: string }>()
  for (const l of vendor.listings) {
    if (!categoriesMap.has(l.category.slug)) {
      categoriesMap.set(l.category.slug, l.category)
    }
  }

  return {
    id: vendor.id,
    name: vendor.name,
    avatarUrl: vendor.avatarUrl,
    location: vendor.location,
    bio: vendor.bio,
    socialLinks: parseSocialLinks(vendor.socialLinks),
    metrics: vendor.metrics,
    listings,
    reviews,
    categories: Array.from(categoriesMap.values()),
  }
}
