export function formatPHP(cents: number): string {
  const pesos = cents / 100
  return `₱${pesos.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`
}

export function formatPHPShort(cents: number): string {
  const pesos = cents / 100
  if (pesos >= 1000) {
    return `₱${(pesos / 1000).toFixed(pesos % 1000 === 0 ? 0 : 1)}k`
  }
  return `₱${pesos.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`
}
