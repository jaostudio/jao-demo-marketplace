import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, ShoppingBag, Package, TrendingUp, ListOrdered, Tag, Settings, Percent, Zap, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin | Palengkee',
  description: 'Admin dashboard for managing the marketplace.',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const [userCounts, listingCounts, orderStats] = await Promise.all([
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.listing.groupBy({ by: ['status'], _count: true }),
    prisma.order.aggregate({ _sum: { total: true }, _count: true }),
  ])

  const totalUsers = userCounts.reduce((s, g) => s + g._count, 0)
  const totalListings = listingCounts.reduce((s, g) => s + g._count, 0)
  const totalRevenue = orderStats._sum.total ?? 0

  const adminLinks = [
    { href: '/admin/listings', label: 'Moderate Listings', icon: ListOrdered, desc: 'Approve or reject pending listings' },
    { href: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View, change roles, and suspend users' },
    { href: '/admin/coupons', label: 'Coupons', icon: Percent, desc: 'Create and manage discount codes' },
    { href: '/admin/flash-sales', label: 'Flash Sales', icon: Zap, desc: 'Set time-limited discounts on products' },
    { href: '/admin/categories', label: 'Categories', icon: Tag, desc: 'Manage product categories' },
    { href: '/admin/reports', label: 'Sales Reports', icon: FileText, desc: 'View orders and export CSV' },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings, desc: 'Configure site-wide options' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Admin
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-neutral-500">Total Users</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {totalUsers}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {userCounts.map((g) => (
              <span key={g.role} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {g.role}: {g._count}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Package className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-neutral-500">Total Listings</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {totalListings}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {listingCounts.map((g) => (
              <span key={g.status} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {g.status.replace(/_/g, ' ').toLowerCase()}: {g._count}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-neutral-500">Total Orders</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {orderStats._count}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-neutral-500">Total Revenue</p>
          <p className="mt-1 font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            ₱{(totalRevenue / 100).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <Icon className="h-5 w-5 text-primary-500" />
              <p className="mt-3 font-semibold text-neutral-800 dark:text-neutral-100">
                {link.label}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">{link.desc}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
