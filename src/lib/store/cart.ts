'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  listingId: string
  vendorId: string
  vendorName: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
  variantLabel?: string | null
}

function itemKey(a: { listingId: string; variantLabel?: string | null }, b: { listingId: string; variantLabel?: string | null }) {
  return a.listingId === b.listingId && (a.variantLabel ?? null) === (b.variantLabel ?? null)
}

export interface CartGroup {
  vendorId: string
  vendorName: string
  items: CartItem[]
  subtotal: number
}

interface CartState {
  items: CartItem[]
  couponCode: string | null
  savedAt: number | null
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (listingId: string, variantLabel?: string | null) => void
  updateQuantity: (listingId: string, quantity: number, variantLabel?: string | null) => void
  clearCart: () => void
  setCoupon: (code: string | null) => void
  touch: () => void
  groups: () => CartGroup[]
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      savedAt: null,
      addItem: (item) => {
        const now = Date.now()
        set((state) => {
          const existing = state.items.find((i) => itemKey(i, item))
          if (existing) {
            return { items: state.items.map((i) => itemKey(i, item) ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i), savedAt: now }
          }
          return {
            items: [...state.items, { listingId: item.listingId, vendorId: item.vendorId, vendorName: item.vendorName, name: item.name, price: item.price, imageUrl: item.imageUrl, quantity: item.quantity ?? 1, variantLabel: item.variantLabel ?? null }],
            savedAt: now,
          }
        })
      },
      removeItem: (listingId, variantLabel?) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.listingId === listingId && (i.variantLabel ?? null) === (variantLabel ?? null))),
          savedAt: Date.now(),
        })),
      updateQuantity: (listingId, quantity, variantLabel?) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => !(i.listingId === listingId && (i.variantLabel ?? null) === (variantLabel ?? null)))
            : state.items.map((i) => i.listingId === listingId && (i.variantLabel ?? null) === (variantLabel ?? null) ? { ...i, quantity } : i),
          savedAt: Date.now(),
        })),
      clearCart: () => set({ items: [], couponCode: null, savedAt: null }),
      setCoupon: (code) => set({ couponCode: code }),
      touch: () => set({ savedAt: Date.now() }),
      groups: () => {
        const items = get().items
        const map = new Map<string, { vendorName: string; items: CartItem[] }>()
        for (const item of items) {
          if (!map.has(item.vendorId)) {
            map.set(item.vendorId, { vendorName: item.vendorName, items: [] })
          }
          map.get(item.vendorId)!.items.push(item)
        }
        return Array.from(map.entries()).map(([vendorId, g]) => ({
          vendorId,
          vendorName: g.vendorName,
          items: g.items,
          subtotal: g.items.reduce((s, i) => s + i.price * i.quantity, 0),
        }))
      },
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'likha-cart-v2' },
  ),
)
