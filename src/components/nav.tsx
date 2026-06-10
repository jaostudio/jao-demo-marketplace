'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  ShoppingBasket,
  ShoppingCart,
  PlusCircle,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
  Package,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useDemoControl } from '@/lib/store/demo-control'
import { useState, useRef, useEffect } from 'react'
import { MobileNav } from './mobile-nav'
import { CurrencySwitcher } from './currency-switcher'
import { LanguageSwitcher } from './language-switcher'
import { NotificationDropdown } from './notification-dropdown'
import { MessageUnreadBadge } from './message-unread-badge'
import { PwaInstallPrompt } from './pwa-install-prompt'
import { useTranslations } from 'next-intl'

export function Nav() {
  const t = useTranslations('nav')
  const { data: session } = useSession()
  const realUser = session?.user as any
  const { simulatedUserId, demoUserName, demoUserRole, demoUserAvatar } = useDemoControl()
  // If a real session exists, use it. Otherwise use the demo simulated user.
  const user = realUser ?? (simulatedUserId ? { name: demoUserName, role: demoUserRole, email: simulatedUserId, image: demoUserAvatar } : null)
  const itemCount = useCart((s) => s.itemCount())
  const { setTheme, resolvedTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  const isVendor = user?.role === 'VENDOR'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-neutral-50/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-warm-sm transition-transform group-hover:scale-105">
              <ShoppingBasket className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-neutral-800 dark:text-neutral-100">
                Palengkee
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-medium">
                Fresh from your community
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/listings">{t('browse')}</NavLink>
            {isVendor && (
              <NavLink href="/listings/create" icon={<PlusCircle className="h-4 w-4" />}>
                {t('sell')}
              </NavLink>
            )}
            {user && !isVendor && !isAdmin && (
              <NavLink href="/orders" icon={<Package className="h-4 w-4" />}>
                {t('orders')}
              </NavLink>
            )}
            {(isVendor || isAdmin) && (
              <NavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                {t('dashboard')}
              </NavLink>
            )}
            {isAdmin && (
              <NavLink href="/admin" icon={<ShieldCheck className="h-4 w-4" />}>
                {t('admin')}
              </NavLink>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            <CurrencySwitcher />
            <LanguageSwitcher />
            <PwaInstallPrompt />
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 block dark:hidden" />
            </button>

            {/* Wishlist (desktop only) */}
            {user && (
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {user && <MessageUnreadBadge />}

            {user && <NotificationDropdown />}

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Basket"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white shadow-warm-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu (desktop) */}
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex h-10 items-center gap-2 rounded-xl pl-2 pr-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  {user?.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-warm-lg dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-primary-600 dark:text-primary-400 font-bold">
                        {user?.role}
                      </p>
                    </div>
                    <UserMenuLink href="/profile" icon={<UserIcon className="h-4 w-4" />}>
                      {t('profile')}
                    </UserMenuLink>
                    <UserMenuLink href="/wishlist" icon={<Heart className="h-4 w-4" />}>
                      {t('wishlist')}
                    </UserMenuLink>
                    <UserMenuLink href="/messages" icon={<MessageSquare className="h-4 w-4" />}>
                      {t('messages')}
                    </UserMenuLink>
                    <UserMenuLink href="/orders" icon={<Package className="h-4 w-4" />}>
                      {t('orders')}
                    </UserMenuLink>
                    {(isVendor || isAdmin) && (
                      <UserMenuLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                      {t('dashboard')}
                    </UserMenuLink>
                    )}
                    {isAdmin && (
                      <UserMenuLink href="/admin" icon={<ShieldCheck className="h-4 w-4" />}>
                        {t('admin')}
                      </UserMenuLink>
                    )}
                    <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                    <button
                      onClick={() => {
                        if (simulatedUserId) {
                          document.cookie = 'demo_user_email=; path=/; max-age=0'
                          useDemoControl.getState().setSimulatedUser(null)
                          window.location.reload()
                        } else {
                          signOut({ callbackUrl: '/' })
                        }
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="h-10 px-4 inline-flex items-center justify-center rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/auth/register"
                  className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-primary-500 text-sm font-semibold text-white hover:bg-primary-600 shadow-warm-sm transition-colors"
                >
                  {t('join')}
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-1.5 px-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}

function UserMenuLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}
