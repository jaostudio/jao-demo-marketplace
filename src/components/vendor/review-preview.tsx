import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import type { StorefrontReview } from '@/lib/vendor'

interface ReviewPreviewProps {
  review: StorefrontReview
}

export function ReviewPreview({ review }: ReviewPreviewProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
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
          <p className="font-semibold text-neutral-800 dark:text-neutral-100">
            {review.author.name}
          </p>
          <div className="mt-0.5 inline-flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-300 dark:text-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
        <span className="shrink-0 text-xs text-neutral-500">
          {new Date(review.createdAt).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {review.text && (
        <p className="mt-3 text-sm text-neutral-700 line-clamp-3 dark:text-neutral-300">
          {review.text}
        </p>
      )}

      <Link
        href={`/listings/${review.listingSlug}`}
        className="mt-3 inline-block text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
      >
        Reviewed &ldquo;{review.listingTitle}&rdquo;
      </Link>
    </div>
  )
}
