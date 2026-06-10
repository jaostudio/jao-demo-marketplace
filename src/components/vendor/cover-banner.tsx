import Image from 'next/image'
import { MapPin, Star, Facebook, Instagram } from 'lucide-react'
import type { StorefrontData } from '@/lib/vendor'
import { MessageVendorButton } from '@/components/message-vendor-button'

interface CoverBannerProps {
  vendor: Pick<StorefrontData, 'id' | 'name' | 'avatarUrl' | 'location' | 'bio' | 'socialLinks'>
  metrics: StorefrontData['metrics']
  isOwner: boolean
}

export function CoverBanner({ vendor, metrics, isOwner }: CoverBannerProps) {
  const initials = vendor.name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="relative">
      {/* Cover gradient */}
      <div
        className="h-44 w-full sm:h-56 md:h-64"
        style={{
          background:
            'linear-gradient(135deg, #C2693D 0%, #D4884F 45%, #8B3A1F 100%)',
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-warm-md sm:h-32 sm:w-32 dark:border-neutral-900">
            {vendor.avatarUrl ? (
              <Image
                src={`${vendor.avatarUrl}?v=3`}
                alt={vendor.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-accent-600 font-serif text-3xl font-bold text-white">
                {initials}
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="font-serif text-2xl font-bold text-neutral-800 sm:text-3xl dark:text-neutral-100">
              {vendor.name}
            </h1>
            {vendor.location && (
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>{vendor.location}</span>
              </p>
            )}
            {vendor.bio && (
              <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base dark:text-neutral-300">
                {vendor.bio}
              </p>
            )}
          </div>

          {/* Action / social */}
          <div className="flex flex-wrap items-center gap-2 pb-1 sm:flex-nowrap sm:justify-end">
            {vendor.socialLinks.facebook && (
              <a
                href={vendor.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {vendor.socialLinks.instagram && (
              <a
                href={vendor.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}

            {isOwner ? (
              <a
                href="/dashboard/profile"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white shadow-warm-sm transition-colors hover:bg-primary-600"
              >
                Edit profile
              </a>
            ) : (
              <MessageVendorButton
                vendorId={vendor.id}
                label="Contact maker"
                className="h-10 rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              />
            )}
          </div>
        </div>

        {/* Rating row (under header, above stats) */}
        {metrics && metrics.reviewCount > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="inline-flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(metrics.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-neutral-800 dark:text-neutral-100">
              {metrics.averageRating.toFixed(1)}
            </span>
            <span className="text-neutral-500">({metrics.reviewCount} reviews)</span>
          </div>
        )}
      </div>
    </header>
  )
}
