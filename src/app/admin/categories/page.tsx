import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CategoryManager } from './category-manager'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Categories | Palengkee Admin',
  description: 'Manage product categories.',
  robots: { index: false, follow: false },
}

export default async function AdminCategoriesPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { listings: true } } },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Admin
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Categories
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'} - add, edit, or remove them
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  )
}
