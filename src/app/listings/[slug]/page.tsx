import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from './add-to-cart-button'
import { Price } from '@/components/price'
import { Star, MapPin, Package, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import { CompareButton, ShareButtons, RecentlyViewedTracker, CompareFloatingBar } from '@/components/product-actions'
import { PriceDropAlertButton } from '@/components/price-drop-alert-button'
import { MessageVendorButton } from '@/components/message-vendor-button'
import { BundleOffer } from '@/components/bundle-offer'
import { getBundlesForListing } from '@/lib/actions/bundles'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
      vendor: { select: { name: true } },
    },
  })
  if (!listing) return { title: 'Not Found - Palengkee' }
  const ogImage = listing.images[0]?.url || `${BASE_URL}/hero-banner.jpg`
  const description = listing.description
    ? listing.description.length > 160
      ? listing.description.slice(0, 157) + '...'
      : listing.description
    : `Shop ${listing.title} on Palengkee`
  return {
    title: `${listing.title} - Palengkee`,
    description,
    openGraph: {
      title: `${listing.title} - Palengkee`,
      description,
      type: 'website',
      locale: 'en_PH',
      siteName: 'Palengkee',
      url: `${BASE_URL}/listings/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} - Palengkee`,
      description,
      images: [ogImage],
    },
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          location: true,
          bio: true,
          _count: { select: { listings: true } },
        },
      },
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      variants: {
        orderBy: { label: 'asc' },
      },
      reviews: {
        include: { author: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
  if (!listing || listing.status !== 'APPROVED') notFound()

  const relatedListings = listing.category
    ? await prisma.listing.findMany({
        where: {
          categoryId: listing.categoryId,
          id: { not: listing.id },
          status: 'APPROVED',
        },
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
          vendor: { select: { name: true } },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })
    : []

  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length
      : null

  const hasDiscount =
    listing.isFlashSale && listing.flashSalePrice && listing.flashSaleEnds &&
    new Date(listing.flashSaleEnds) > new Date()

  const bundles = await getBundlesForListing(listing.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-neutral-500">
        <Link href="/listings" className="hover:text-primary-600">
          All products
        </Link>
        <span className="mx-1.5">/</span>
        <Link
          href={`/listings?category=${listing.category.slug}`}
          className="hover:text-primary-600"
        >
          {listing.category.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700 dark:text-neutral-300">{listing.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
            {listing.images[0]?.url ? (
              <Image
                src={listing.images[0].url}
                alt={listing.images[0].alt ?? listing.title}
                width={800}
                height={800}
                priority
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl font-bold text-neutral-300">
                {listing.title.charAt(0)}
              </div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {listing.images.slice(1, 5).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900"
                >
                  {img.url && (
                    <Image
                      src={img.url}
                      alt={img.alt ?? listing.title}
                      fill
                      sizes="(max-width: 1024px) 25vw, 200px"
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            {listing.category.name}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
            {listing.title}
          </h1>

          {avgRating !== null && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= Math.round(avgRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-neutral-500">({listing.reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <p className="font-serif text-4xl font-bold text-primary-600 dark:text-primary-400">
                  <Price amountCents={listing.flashSalePrice!} />
                </p>
                <p className="text-lg text-neutral-500 line-through dark:text-neutral-400">
                  <Price amountCents={listing.price} />
                </p>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold uppercase text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  Sale
                </span>
              </>
            ) : (
              <p className="font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                <Price amountCents={listing.price} />
              </p>
            )}
          </div>

          {/* Service badge */}
          {listing.isService && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-900 dark:border-accent-800 dark:bg-accent-900/20 dark:text-accent-100">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Service / experience</span>
              {listing.bookingDuration && (
                <span className="text-accent-700 dark:text-accent-300">
                  · {listing.bookingDuration} minutes
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <p className="mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {listing.description}
          </p>

          {/* Add to cart / book */}
          <AddToCartButton
            listing={{
              id: listing.id,
              title: listing.title,
              price: hasDiscount ? listing.flashSalePrice! : listing.price,
              vendorId: listing.vendor.id,
              vendorName: listing.vendor.name,
              imageUrl: listing.images[0]?.url ?? null,
            }}
            isService={listing.isService}
            variants={listing.variants.map((v) => ({
              id: v.id,
              label: v.label,
              priceAdj: v.priceAdj,
              stock: v.stock,
            }))}
          />

          {/* Compare + Share + Price drop alert */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CompareButton listingId={listing.id} title={listing.title} />
            <ShareButtons title={listing.title} slug={listing.slug} />
            <PriceDropAlertButton listingId={listing.id} />
          </div>

          {/* Trust strip */}
          <ul className="mt-6 space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
            <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <ShieldCheck className="h-4 w-4 text-primary-500" />
              <span>Secure payment, your info is protected</span>
            </li>
            <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Truck className="h-4 w-4 text-primary-500" />
              <span>Island-wide delivery with tracking</span>
            </li>
            {!listing.isService && (
              <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Package className="h-4 w-4 text-primary-500" />
                <span>{listing.stock > 0 ? `${listing.stock} in stock` : 'Out of stock'}</span>
              </li>
            )}
          </ul>

          {/* Vendor card */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              {listing.vendor.avatarUrl ? (
                <Image
                  src={listing.vendor.avatarUrl}
                  alt={listing.vendor.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  {listing.vendor.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-500">Made by</p>
                <Link
                  href={`/vendors/${listing.vendor.id}`}
                  className="font-semibold text-neutral-800 hover:underline dark:text-neutral-100"
                >
                  {listing.vendor.name}
                </Link>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                  {listing.vendor.location && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {listing.vendor.location}
                    </span>
                  )}
                  <span>·</span>
                  <span>{listing.vendor._count.listings} pieces</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageVendorButton
                vendorId={listing.vendor.id}
                listingId={listing.id}
                label="Message"
                className="h-9 border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              />
              <Link
                href={`/vendors/${listing.vendor.id}`}
                className="hidden h-9 items-center justify-center rounded-xl border border-neutral-300 px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 sm:inline-flex dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Visit store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle offers */}
      {bundles.length > 0 && (
        <div className="mt-10 space-y-4">
          {bundles.map((bundle) => (
            <BundleOffer key={bundle.id} bundle={bundle as any} currentListingId={listing.id} />
          ))}
        </div>
      )}

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Reviews
        </h2>
        {listing.reviews.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {listing.reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  {review.author.avatarUrl ? (
                    <Image
                      src={review.author.avatarUrl}
                      alt={review.author.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {review.author.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                      {review.author.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i <= review.rating
                            ? 'fill-amber-400 text-amber-400'
          : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {review.text}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* You may also like */}
      {relatedListings.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            You may also like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedListings.map((r) => (
              <Link
                key={r.id}
                href={`/listings/${r.slug}`}
                className="group rounded-xl border border-neutral-200 bg-white overflow-hidden transition-all hover:shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {r.images[0]?.url ? (
                    <Image
                      src={r.images[0].url}
                      alt={r.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-300 dark:text-neutral-600">
                      {r.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-neutral-500 truncate">{r.vendor.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-800 line-clamp-1 dark:text-neutral-100">
                    {r.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-primary-600 dark:text-primary-400">
                    <Price amountCents={r.price} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <RecentlyViewedTracker listingId={listing.id} />
      <CompareFloatingBar />
    </div>
  )
}
