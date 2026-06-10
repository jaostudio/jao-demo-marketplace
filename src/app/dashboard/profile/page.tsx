import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileEditor } from '@/components/vendor/profile-editor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Palengkee',
  description: 'Edit your vendor profile.',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') redirect('/auth/signin')

  const vendor = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, avatarUrl: true, bio: true, location: true, socialLinks: true },
  })

  if (!vendor) redirect('/auth/signin')

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Vendor Dashboard
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Store Profile
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Update your store name, bio, and social links. Changes appear on your public storefront.
        </p>
      </div>
      <ProfileEditor vendor={vendor} />
    </div>
  )
}
