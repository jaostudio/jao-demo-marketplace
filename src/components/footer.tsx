import Link from 'next/link'
import { ShoppingBasket, Facebook, Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'

const footerLinks = {
  about: [
    { label: 'About Palengkee', href: '/about' },
    { label: 'Our Makers', href: '/listings' },
    { label: 'Press', href: '/about' },
    { label: 'Careers', href: '/about' },
  ],
  browse: [
    { label: 'All Categories', href: '/listings' },
    { label: 'Featured', href: '/listings' },
    { label: 'New Arrivals', href: '/listings' },
    { label: 'Service Bookings', href: '/listings' },
  ],
  support: [
    { label: 'Help Center', href: '/about' },
    { label: 'Shipping & Delivery', href: '/about' },
    { label: 'Returns & Refunds', href: '/about' },
    { label: 'Contact Us', href: '/about' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy' },
    { label: 'Vendor Agreement', href: '/terms' },
  ],
}

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-neutral-200 bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-warm-sm">
                <ShoppingBasket className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg tracking-tight text-neutral-800 dark:text-neutral-100">
                  Palengkee
                </span>
                <span className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                  {t('tagline')}
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('aboutDesc')}
            </p>
            <div className="mt-6 flex gap-2">
              <SocialLink href="https://facebook.com" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title={t('about')} links={footerLinks.about} />
          <FooterColumn title={t('browse')} links={footerLinks.browse} />
          <FooterColumn title={t('support')} links={footerLinks.support} />
          <FooterColumn title={t('legal')} links={footerLinks.legal} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 text-sm text-neutral-600 dark:text-neutral-300 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-xs">{t('disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
    >
      {children}
    </a>
  )
}
