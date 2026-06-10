import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Palengkee',
  description: 'Manage your account settings.',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/signin')

  if (user.role === 'VENDOR') redirect('/dashboard/profile')
  if (user.role === 'ADMIN') redirect('/admin')

  redirect('/orders')
}
