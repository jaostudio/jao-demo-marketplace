export type CurrencyCode = 'PHP' | 'USD'

export const EXCHANGE_RATE = 56

export function convertToDisplayValue(cents: number, currency: CurrencyCode): number {
  const pesos = cents / 100
  if (currency === 'PHP') return pesos
  return pesos / EXCHANGE_RATE
}

export function formatPrice(cents: number, currency: CurrencyCode): string {
  const value = convertToDisplayValue(cents, currency)
  if (currency === 'PHP') {
    return `₱${Math.round(value).toLocaleString('en-PH')}`
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
