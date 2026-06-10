'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero')
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }
  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-neutral-100 dark:bg-neutral-950"
    >
      {/* Background image - outside motion for instant LCP */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-banner.jpg"
          alt="Filipino vendor at work"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Parallax gradient overlays */}
      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-900/60 to-primary-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
      </motion.div>

      {/* Subtle paper grain texture overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        variants={reduce ? undefined : containerVariants}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? false : 'visible'}
        className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col items-start justify-center px-4 py-24 sm:min-h-[680px] sm:py-32"
      >
        <motion.div variants={reduce ? undefined : itemVariants}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-secondary-300" />
            <span>{t('community')}</span>
          </span>
        </motion.div>

        <motion.h1
          variants={reduce ? undefined : itemVariants}
          className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Fresh from your{' '}
          <span className="italic text-white/90 drop-shadow-sm">community</span>
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : itemVariants}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
        >
          Local produce, everyday essentials, and honest prices - delivered to your door.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : itemVariants}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/listings"
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary-500 px-7 text-base font-semibold text-white shadow-warm-lg transition-all hover:bg-primary-600 hover:shadow-warm-xl"
          >
            <span>{t('shopNow')}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#meet-the-makers"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
          >
            <span>{t('becomeVendor')}</span>
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          variants={reduce ? undefined : itemVariants}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Zero commission for basic sellers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Cash on delivery preferred
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            No hidden fees
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom fade into page content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-950" />
    </section>
  )
}
