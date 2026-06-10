'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {
  X,
  Home,
  Package,
  Heart,
  MessageSquare,
  ShoppingCart,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingBasket,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useDemoControl } from '@/lib/store/demo-control'
import { LanguageSwitcher } from './language-switcher'
import { useTranslations } from 'next-intl'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { data: session } = useSession()
  const realUser = session?.user as any
  const { simulatedUserId, demoUserName, demoUserRole, demoUserAvatar } = useDemoControl()
  const user = realUser ?? (simulatedUserId ? { name: demoUserName, role: demoUserRole, email: simulatedUserId, image: demoUserAvatar } : null)
  const itemCount = useCart((s) => s.itemCount())
  const t = useTranslations('nav')

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const isVendor = user?.role === 'VENDOR'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform border-l border-neutral-200 bg-white shadow-2xl transition-transform duration-200 ease-out dark:border-neutral-800 dark:bg-neutral-950 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
              <ShoppingBasket className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <span className="font-bold text-lg text-neutral-800 dark:text-neutral-100">Palengkee</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)] px-2 py-4">
          {user && (
            <div className="mb-4 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {user.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>
              <p className="mt-2 inline-block rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                {user.role}
              </p>
            </div>
          )}

          <nav className="space-y-0.5">
            <MobileNavLink href="/" onClick={onClose} icon={<Home className="h-5 w-5" />}>
              {t('home')}
            </MobileNavLink>
            <MobileNavLink href="/listings" onClick={onClose} icon={<Package className="h-5 w-5" />}>
              {t('browse')}
            </MobileNavLink>
            <MobileNavLink href="/cart" onClick={onClose} icon={<ShoppingCart className="h-5 w-5" />}>
              <span className="flex-1">{t('cart')}</span>
              {itemCount > 0 && (
                <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </MobileNavLink>
            {user && (
              <MobileNavLink href="/wishlist" onClick={onClose} icon={<Heart className="h-5 w-5" />}>
                {t('wishlist')}
              </MobileNavLink>
            )}
            {user && (
              <MobileNavLink href="/messages" onClick={onClose} icon={<MessageSquare className="h-5 w-5" />}>
                {t('messages')}
              </MobileNavLink>
            )}
            {user && !isVendor && !isAdmin && (
              <MobileNavLink href="/orders" onClick={onClose} icon={<Package className="h-5 w-5" />}>
                {t('orders')}
              </MobileNavLink>
            )}
            {isVendor && (
              <>
                <MobileNavLink href="/listings/create" onClick={onClose} icon={<PlusCircle className="h-5 w-5" />}>
                  {t('sell')}
                </MobileNavLink>
                <MobileNavLink href="/dashboard" onClick={onClose} icon={<LayoutDashboard className="h-5 w-5" />}>
                  {t('dashboard')}
                </MobileNavLink>
              </>
            )}
            {isAdmin && (
              <>
                <MobileNavLink href="/dashboard" onClick={onClose} icon={<LayoutDashboard className="h-5 w-5" />}>
                  {t('dashboard')}
                </MobileNavLink>
                <MobileNavLink href="/admin" onClick={onClose} icon={<ShieldCheck className="h-5 w-5" />}>
                  {t('admin')}
                </MobileNavLink>
              </>
            )}
          </nav>

          <div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />

          <div className="flex items-center justify-between px-3 py-2">
            <LanguageSwitcher />
          </div>

          <div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />

          {user ? (
            <button
              onClick={() => {
                if (simulatedUserId) {
                  document.cookie = 'demo_user_email=; path=/; max-age=0'
                  useDemoControl.getState().setSimulatedUser(null)
                  onClose()
                  window.location.reload()
                } else {
                  signOut({ callbackUrl: '/' })
                  onClose()
                }
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <LogOut className="h-5 w-5" />
              {t('signOut')}
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
              >
                <LogIn className="h-4 w-4" />
                {t('signIn')}
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 shadow-warm-sm"
              >
                <UserPlus className="h-4 w-4" />
                {t('join')}
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
  icon,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}
