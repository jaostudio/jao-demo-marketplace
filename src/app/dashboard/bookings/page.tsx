import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getVendorBookings } from '@/lib/actions/booking'
import { BookingActions } from './booking-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookings | Palengkee',
  description: 'View and manage your service bookings.',
  robots: { index: false, follow: false },
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

export default async function DashboardBookingsPage() {
  const user = await getSessionUser()
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const bookings = await getVendorBookings()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Vendor Dashboard
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage incoming service requests from buyers.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">No bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Service</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-950">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-800 dark:text-neutral-100">{b.buyer.name}</p>
                    <p className="text-xs text-neutral-500">{b.buyer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{b.listing.title}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                    {new Date(b.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <BookingActions bookingId={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
