import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRoleManager } from './user-role-manager'
import { UserSuspendToggle } from './user-suspend-toggle'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Manage Users | Palengkee Admin',
  description: 'Manage marketplace users.',
  robots: { index: false, follow: false },
}

export default async function AdminUsersPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, suspended: true, createdAt: true },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Admin
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Users
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {users.length} registered users
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <th className="px-5 pb-3 pt-4 font-medium text-neutral-500">Name</th>
              <th className="px-5 pb-3 pt-4 font-medium text-neutral-500">Email</th>
              <th className="px-5 pb-3 pt-4 font-medium text-neutral-500">Role</th>
              <th className="px-5 pb-3 pt-4 font-medium text-neutral-500">Status</th>
              <th className="px-5 pb-3 pt-4 font-medium text-neutral-500">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={`border-b border-neutral-100 last:border-0 dark:border-neutral-800 ${u.suspended ? 'opacity-60' : ''}`}>
                <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">{u.name}</td>
                <td className="px-5 py-3.5 text-neutral-500">{u.email}</td>
                <td className="px-5 py-3.5">
                  <UserRoleManager userId={u.id} currentRole={u.role} isSelf={u.id === user.id} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {u.suspended && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">Banned</span>}
                    <UserSuspendToggle userId={u.id} suspended={u.suspended} isSelf={u.id === user.id} />
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
