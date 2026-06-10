'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useDemoControl } from '@/lib/store/demo-control'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toggleWishlistItem } from '@/lib/actions/wishlist'

interface WishlistButtonProps {
  listingId: string
  isWished: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'overlay' | 'plain'
}

export function WishlistButton({
  listingId,
  isWished: initialWished,
  size = 'md',
  variant = 'plain',
}: WishlistButtonProps) {
  const { data: session } = useSession()
  const { simulatedUserId } = useDemoControl()
  const isAuthenticated = !!session || !!simulatedUserId
  const router = useRouter()
  const [wished, setWished] = useState(initialWished)
  const [pending, startTransition] = useTransition()
  const reduce = useReducedMotion()

  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  } as const

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  } as const

  const baseClass =
    variant === 'overlay'
      ? 'rounded-full bg-white/90 backdrop-blur shadow-warm-md text-neutral-700 hover:bg-white hover:text-primary-500'
      : 'rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-primary-500 dark:hover:bg-neutral-800'

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    // Optimistic update
    setWished((w) => !w)

    startTransition(async () => {
      try {
        await toggleWishlistItem(listingId, !wished)
        toast.success(wished ? 'Removed from wishlist' : 'Saved for later')
      } catch {
        setWished((w) => !w)
      }
    })
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={pending}
      whileTap={reduce ? undefined : { scale: 0.85 }}
      animate={
        reduce || !wished
          ? { scale: 1 }
          : { scale: [1, 1.4, 0.85, 1.1, 1] }
      }
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.4, times: [0, 0.3, 0.5, 0.75, 1], ease: 'easeOut' }
      }
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wished}
      className={`inline-flex items-center justify-center transition-colors disabled:opacity-50 ${sizeMap[size]} ${baseClass} ${
        wished && variant === 'plain' ? 'bg-primary-50 text-primary-500 dark:bg-primary-900/30' : ''
      } ${wished && variant === 'overlay' ? 'text-primary-500' : ''}`}
    >
      <Heart
        className={iconSize[size]}
        fill={wished ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </motion.button>
  )
}
