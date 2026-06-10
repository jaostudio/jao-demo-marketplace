import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/marketplace-client'
import { getSessionUser } from '@/lib/auth'
import { getWishlistIds } from '@/lib/actions/wishlist'
import { ListingCard, type ListingCardData } from '@/components/listing-card'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SortSelect } from '@/components/sort-select'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Products | Palengkee',
  description: 'Browse fresh produce, local delicacies, home essentials, and more from Filipino vendors.',
}

interface ListingsPageProps {
  searchParams: Promise<{
    category?: string | string[]
    q?: string
    sort?: 'newest' | 'price-asc' | 'price-desc'
    minPrice?: string
    maxPrice?: string
    minRating?: string
    loc?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const { category, q, sort = 'newest', minPrice, maxPrice, minRating, loc } = await searchParams
  const [sessionUser, categories] = await Promise.all([
    getSessionUser(),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  const categorySlugs = category
    ? Array.isArray(category) ? category : [category]
    : []

  const where: Prisma.ListingWhereInput = { status: 'APPROVED' }
  if (categorySlugs.length > 0) where.category = { slug: { in: categorySlugs } }
  if (q && q.trim()) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { vendor: { name: { contains: q } } },
    ]
  }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = Math.round(parseFloat(minPrice) * 100)
    if (maxPrice) where.price.lte = Math.round(parseFloat(maxPrice) * 100)
  }
  if (minRating) {
    const ratingVal = parseInt(minRating)
    if (ratingVal > 0) {
      const listingIds = (
        await prisma.review.groupBy({
          by: ['listingId'],
          _avg: { rating: true },
          having: { rating: { _avg: { gte: ratingVal } } },
          take: 200,
          orderBy: { listingId: 'asc' },
        })
      ).map((r) => r.listingId)
      where.id = { in: listingIds }
    }
  }
  if (loc && loc.trim()) {
    where.vendor = { location: { contains: loc } }
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    sort === 'price-asc'
      ? { price: 'asc' }
      : sort === 'price-desc'
        ? { price: 'desc' }
        : { createdAt: 'desc' }

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    take: 100,
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          location: true,
        },
      },
      category: { select: { name: true, slug: true } },
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { url: true },
      },
    },
  })

  const wishlistIds = sessionUser ? await getWishlistIds() : []

  const cardData: ListingCardData[] = listings.map((l) => ({
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Browse the Marketplace
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-5xl">
          All products
        </h1>
        <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
          {listings.length} {listings.length === 1 ? 'product' : 'products'} from
          our vendor families.
        </p>
      </div>

      {/* Search + sort */}
      <form method="GET" className="mb-4 flex flex-col gap-2 sm:flex-row">
        {categorySlugs.map(s => <input key={s} type="hidden" name="category" value={s} />)}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            name="q"
            defaultValue={q}
          placeholder="Search products..."
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
        />
        </div>
        <SortSelect defaultValue={sort} />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          Search
        </button>
      </form>

      {/* Category pills (multi-select) */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={buildHref({ q, sort })}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            categorySlugs.length === 0
              ? 'bg-primary-500 text-white shadow-warm-sm'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const active = categorySlugs.includes(cat.slug)
          const nextSlugs = active
            ? categorySlugs.filter(s => s !== cat.slug)
            : [...categorySlugs, cat.slug]
          return (
            <Link
              key={cat.slug}
              href={buildHref({ q, sort, category: nextSlugs.length > 0 ? nextSlugs : undefined })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-500 text-white shadow-warm-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
              }`}
            >
              {cat.name}
            </Link>
          )
        })}
      </div>

      {/* Active filter indicator */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {minPrice && <FilterPill label={`Min: ₱${minPrice}`} href={buildHref({ q, sort, category, minPrice: undefined, maxPrice, minRating, loc })} />}
        {maxPrice && <FilterPill label={`Max: ₱${maxPrice}`} href={buildHref({ q, sort, category, minPrice, maxPrice: undefined, minRating, loc })} />}
        {minRating && <FilterPill label={`${minRating}+ stars`} href={buildHref({ q, sort, category, minPrice, maxPrice, minRating: undefined, loc })} />}
        {loc && <FilterPill label={`Location: ${loc}`} href={buildHref({ q, sort, category, minPrice, maxPrice, minRating, loc: undefined })} />}
        {(minPrice || maxPrice || minRating || loc) && (
          <Link
            href={buildHref({ q, sort, category })}
            className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            Clear all filters
          </Link>
        )}
      </div>

      {/* Filter toggles */}
      <details className="mb-6 group">
        <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100">
          <span className="inline-flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
        </summary>
        <form method="GET" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categorySlugs.map(s => <input key={s} type="hidden" name="category" value={s} />)}
          {q && <input type="hidden" name="q" value={q} />}
          {sort && sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Min price (₱)</label>
            <input name="minPrice" type="number" min={0} step="0.01" defaultValue={minPrice} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Max price (₱)</label>
            <input name="maxPrice" type="number" min={0} step="0.01" defaultValue={maxPrice} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Min rating</label>
            <select name="minRating" defaultValue={minRating ?? ''} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
              <option value="">Any</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Location</label>
            <input name="loc" defaultValue={loc} placeholder="e.g. Cebu" className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900" />
          </div>
          <div className="col-span-2 sm:col-span-4 flex gap-2">
            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600">
              Apply filters
            </button>
            <Link
              href={buildHref({ q, sort, category })}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            >
              Reset
            </Link>
          </div>
        </form>
      </details>

      {/* Grid */}
      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <p className="font-serif text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            No products found
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Try a different search term or browse all categories.
          </p>
          <Link
            href="/listings"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Clear filters
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

function FilterPill({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
    >
      {label}
      <X className="h-3 w-3" />
    </Link>
  )
}

function buildHref({
  q,
  sort,
  category,
  minPrice,
  maxPrice,
  minRating,
  loc,
}: {
  q?: string
  sort?: string
  category?: string | string[]
  minPrice?: string
  maxPrice?: string
  minRating?: string
  loc?: string
}): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (sort && sort !== 'newest') params.set('sort', sort)
  if (category) {
    const slugs = Array.isArray(category) ? category : [category]
    slugs.forEach(s => params.append('category', s))
  }
  if (minPrice) params.set('minPrice', minPrice)
  if (maxPrice) params.set('maxPrice', maxPrice)
  if (minRating) params.set('minRating', minRating)
  if (loc) params.set('loc', loc)
  const qs = params.toString()
  return `/listings${qs ? `?${qs}` : ''}`
}
