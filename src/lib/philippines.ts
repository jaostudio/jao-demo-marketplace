export const PHILIPPINE_REGIONS = [
  { value: 'NCR', label: 'National Capital Region (NCR)' },
  { value: 'CAR', label: 'Cordillera Administrative Region (CAR)' },
  { value: 'I', label: 'Region I — Ilocos' },
  { value: 'II', label: 'Region II — Cagayan Valley' },
  { value: 'III', label: 'Region III — Central Luzon' },
  { value: 'IV-A', label: 'Region IV-A — CALABARZON' },
  { value: 'IV-B', label: 'Region IV-B — MIMAROPA' },
  { value: 'V', label: 'Region V — Bicol' },
  { value: 'VI', label: 'Region VI — Western Visayas' },
  { value: 'VII', label: 'Region VII — Central Visayas' },
  { value: 'VIII', label: 'Region VIII — Eastern Visayas' },
  { value: 'IX', label: 'Region IX — Zamboanga Peninsula' },
  { value: 'X', label: 'Region X — Northern Mindanao' },
  { value: 'XI', label: 'Region XI — Davao Region' },
  { value: 'XII', label: 'Region XII — SOCCSKSARGEN' },
  { value: 'XIII', label: 'Region XIII — Caraga' },
  { value: 'BARMM', label: 'BARMM — Bangsamoro' },
] as const

export type RegionValue = (typeof PHILIPPINE_REGIONS)[number]['value']

export const PROVINCES_BY_REGION: Record<RegionValue, string[]> = {
  NCR: [
    'Metro Manila',
    'Caloocan',
    'Las Piñas',
    'Makati',
    'Malabon',
    'Mandaluyong',
    'Manila',
    'Marikina',
    'Muntinlupa',
    'Navotas',
    'Parañaque',
    'Pasay',
    'Pasig',
    'Pateros',
    'Quezon City',
    'San Juan',
    'Taguig',
    'Valenzuela',
  ],
  CAR: ['Abra', 'Apayao', 'Benguet', 'Bontoc', 'Ifugao', 'Kalinga', 'Mountain Province'],
  I: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
  II: ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
  III: [
    'Aurora',
    'Bataan',
    'Bulacan',
    'Nueva Ecija',
    'Pampanga',
    'Tarlac',
    'Zambales',
  ],
  'IV-A': ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal'],
  'IV-B': ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
  V: ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
  VI: ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental'],
  VII: ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor'],
  VIII: ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte'],
  IX: ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'],
  X: ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental'],
  XI: ['Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental'],
  XII: ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat'],
  XIII: ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'],
  BARMM: ['Basilan', 'Lanao del Sur', 'Maguindanao', 'Sulu', 'Tawi-Tawi'],
}

export const SHIPPING_METHODS = [
  {
    value: 'standard',
    label: 'Standard delivery',
    description: '5-7 business days',
    fee: 10000,
  },
  {
    value: 'express',
    label: 'Express delivery',
    description: '1-3 business days',
    fee: 25000,
  },
] as const

export type ShippingMethod = (typeof SHIPPING_METHODS)[number]['value']

export const PAYMENT_METHODS = [
  {
    value: 'card',
    label: 'Credit / debit card',
    description: 'Visa, Mastercard, JCB',
  },
  {
    value: 'gcash',
    label: 'GCash',
    description: 'Pay with your GCash wallet',
  },
  {
    value: 'cod',
    label: 'Cash on delivery',
    description: 'Pay when you receive your order',
  },
] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value']

export const MOCK_COUPONS: Record<string, { kind: 'percent' | 'fixed'; value: number; label: string }> = {
  PALENGKEE10: { kind: 'percent', value: 10, label: '10% off your order' },
  WELCOME: { kind: 'fixed', value: 20000, label: '₱200 off your first order' },
  FREESHIP: { kind: 'fixed', value: 0, label: 'Free shipping discount' },
}
