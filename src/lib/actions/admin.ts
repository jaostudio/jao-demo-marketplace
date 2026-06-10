'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')
  return user
}

export async function changeUserRole(userId: string, newRole: 'BUYER' | 'VENDOR' | 'ADMIN') {
  const admin = await requireAdmin()
  if (userId === admin.id) throw new Error('Cannot change your own role')
  await prisma.user.update({ where: { id: userId }, data: { role: newRole } })
  revalidatePath('/admin/users')
  return { ok: true }
}

export async function toggleUserSuspend(userId: string, suspended: boolean) {
  const admin = await requireAdmin()
  if (userId === admin.id) throw new Error('Cannot suspend yourself')
  await prisma.user.update({ where: { id: userId }, data: { suspended } })
  revalidatePath('/admin/users')
  return { ok: true }
}

export async function createCoupon(data: {
  code: string; kind: 'percent' | 'fixed'; value: number; label: string; maxUses: number; expiresAt?: string
}) {
  await requireAdmin()
  await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      kind: data.kind,
      value: data.value,
      label: data.label,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  })
  revalidatePath('/admin/coupons')
  return { ok: true }
}

export async function updateCoupon(id: string, data: {
  code: string; kind: 'percent' | 'fixed'; value: number; label: string; maxUses: number; active: boolean; expiresAt?: string
}) {
  await requireAdmin()
  await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code.toUpperCase(),
      kind: data.kind,
      value: data.value,
      label: data.label,
      maxUses: data.maxUses,
      active: data.active,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  })
  revalidatePath('/admin/coupons')
  return { ok: true }
}

export async function deleteCoupon(id: string) {
  await requireAdmin()
  await prisma.coupon.delete({ where: { id } })
  revalidatePath('/admin/coupons')
  return { ok: true }
}

export async function setFlashSale(listingId: string, data: {
  flashSalePrice: number; flashSaleEnds: string
}) {
  await requireAdmin()
  await prisma.listing.update({
    where: { id: listingId },
    data: {
      isFlashSale: true,
      flashSalePrice: Math.round(data.flashSalePrice * 100),
      flashSaleEnds: new Date(data.flashSaleEnds),
    },
  })
  revalidatePath('/admin/flash-sales')
  return { ok: true }
}

export async function removeFlashSale(listingId: string) {
  await requireAdmin()
  await prisma.listing.update({
    where: { id: listingId },
    data: { isFlashSale: false, flashSalePrice: null, flashSaleEnds: null },
  })
  revalidatePath('/admin/flash-sales')
  return { ok: true }
}

export async function saveSiteSettings(_data: {
  tagline: string; contactEmail: string; defaultShippingFee: number; aboutText: string
}) {
  await requireAdmin()
  return { ok: true }
}
