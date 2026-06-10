'use client'

import { useCurrency } from '@/lib/store/currency'
import { formatPrice } from '@/lib/currency'

export function Price({
  amountCents,
  className,
}: {
  amountCents: number
  className?: string
}) {
  const currency = useCurrency((s) => s.currency)
  return <span className={className}>{formatPrice(amountCents, currency)}</span>
}
