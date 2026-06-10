import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProviderWrapper } from '@/components/theme-provider-wrapper'
import Script from 'next/script'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { IntlProvider } from '@/components/intl-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { DemoBanner } from '@/components/demo-banner'
import { Toaster } from 'sonner'
import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper'

const PageViewTracker = dynamic(() => import('@/components/page-view-tracker').then(m => m.PageViewTracker))
const AbandonedCartTracker = dynamic(() => import('@/components/abandoned-cart-tracker').then(m => m.AbandonedCartTracker))
const ServiceWorkerRegister = dynamic(() => import('@/components/service-worker-register').then(m => m.ServiceWorkerRegister))
const DemoControlPanel = dynamic(() => import('@/components/demo-control-panel').then(m => m.DemoControlPanel))
const LiveChatWidget = dynamic(() => import('@/components/live-chat-widget').then(m => m.LiveChatWidget))

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://palengkee.com'),
  title: 'Palengkee - Fresh from your community',
  description:
    'Multi-vendor marketplace for fresh produce, local essentials, and everyday goods - direct from Filipino communities to your door.',
  keywords: ['marketplace', 'Philippines', 'fresh produce', 'local', 'sari-sari', 'groceries', 'delivery'],
  authors: [{ name: 'Palengkee' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Palengkee - Fresh from your community',
    description: 'Local produce, everyday essentials, and honest prices - delivered to your door.',
    type: 'website',
    locale: 'en_PH',
    siteName: 'Palengkee',
    url: 'https://palengkee.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palengkee - Fresh from your community',
    description: 'Local produce, everyday essentials, and honest prices - delivered to your door.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F6F2' },
    { media: '(prefers-color-scheme: dark)', color: '#12100E' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <html lang={locale === 'tl' ? 'tl' : 'en'} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* suppress-react-theme-warning removed — the Script caused the very console.error it tried to hide */}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-neutral-50 text-neutral-800 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-warm-md"
        >
          Skip to main content
        </a>
        <ThemeProviderWrapper attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <IntlProvider locale={locale} messages={messages}>
              <DemoBanner show={process.env.DEMO_MODE !== 'false'} />
              <Nav />
              <PageViewTracker />
              <AbandonedCartTracker />
              <main id="main" className="min-h-[calc(100vh-4rem)]"><ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper></main>
              <Toaster richColors position="top-right" />
              {process.env.DEMO_MODE !== 'false' && <DemoControlPanel />}
              <ServiceWorkerRegister />
              <LiveChatWidget />
              <Footer />
            </IntlProvider>
          </AuthProvider>
        </ThemeProviderWrapper>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
