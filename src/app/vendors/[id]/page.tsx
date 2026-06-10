import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Package, MessageCircle, ShoppingBag } from 'lucide-react'
import { getSessionUser } from '@/lib/auth'
import { getVendorStorefront } from '@/lib/vendor'
import { formatPHP } from '@/lib/format'
import { ListingCard, type ListingCardData } from '@/components/listing-card'
import { CoverBanner } from '@/components/vendor/cover-banner'
import { ReviewPreview } from '@/components/vendor/review-preview'

export const dynamic = 'force-dynamic'

export default async function VendorStorefrontPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getSessionUser()
  const data = await getVendorStorefront(id)

  if (!data) notFound()

  const isOwner = user?.id === id

  const listings: ListingCardData[] = data.listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    price: l.price,
    imageUrl: l.imageUrl,
    category: l.category,
    vendor: { name: data.name, avatarUrl: data.avatarUrl },
    isService: l.isService,
    isWished: false,
    isFlashSale: l.isFlashSale,
    flashSalePrice: l.flashSalePrice,
    flashSaleEnds: l.flashSaleEnds?.toISOString() ?? null,
  }))

  return (
    <div className="pb-16">
      <CoverBanner vendor={data} metrics={data.metrics} isOwner={isOwner} />

      {/* Stats row */}
      {data.metrics && (
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4">
          <MetricCard
            icon={<Package className="h-5 w-5" />}
            label="Products"
            value={data.metrics.listingCount.toString()}
          />
          <MetricCard
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Orders"
            value={data.metrics.orderCount.toString()}
          />
          <MetricCard
            icon={<MessageCircle className="h-5 w-5" />}
            label="Reviews"
            value={data.metrics.reviewCount.toString()}
          />
          <MetricCard
            icon={<span className="text-lg font-bold">₱</span>}
            label="Revenue"
            value={formatPHP(data.metrics.totalRevenue)}
          />
        </div>
      )}

      {/* Product grid */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Products
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{data.listings.length} products</p>

        {data.listings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <Package className="mx-auto h-10 w-10 text-neutral-400" />
            <h3 className="mt-3 font-semibold text-neutral-800 dark:text-neutral-100">
              No products yet
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              This vendor hasn&apos;t published any products yet.
            </p>
            <Link
              href="/listings"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Browse the marketplace
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      {data.reviews.length > 0 && (
        <section className="mx-auto mt-12 max-w-6xl px-4">
          <h2 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
            What buyers are saying
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Recent reviews from {data.metrics ? data.metrics.reviewCount : 0} reviews
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((review) => (
              <ReviewPreview key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
        {icon}
      </div>
      <p className="mt-2 font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
        {value}
      </p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  )
}
