'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function createCategory(formData: FormData) {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const coverUrl = formData.get('coverUrl') as string

  if (!name) throw new Error('Name is required')

  const slug = slugify(name)

  await prisma.category.create({
    data: { name, slug, icon: icon || null, coverUrl: coverUrl || null },
  })

  revalidatePath('/admin/categories')
  revalidatePath('/listings')
  return { ok: true }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const coverUrl = formData.get('coverUrl') as string

  if (!name) throw new Error('Name is required')

  const slug = slugify(name)

  await prisma.category.update({
    where: { id: categoryId },
    data: { name, slug, icon: icon || null, coverUrl: coverUrl || null },
  })

  revalidatePath('/admin/categories')
  revalidatePath('/listings')
  return { ok: true }
}

export async function deleteCategory(categoryId: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')

  const listingCount = await prisma.listing.count({ where: { categoryId } })
  if (listingCount > 0) throw new Error(`Cannot delete category with ${listingCount} listing(s). Move them first.`)

  await prisma.category.delete({ where: { id: categoryId } })

  revalidatePath('/admin/categories')
  revalidatePath('/listings')
  return { ok: true }
}
