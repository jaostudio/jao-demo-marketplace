'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Users, Package, MapPin, Heart } from 'lucide-react'

interface Stat {
  value: number
  label: string
  suffix?: string
  icon: typeof Users
}

interface StatsCounterProps {
  vendorCount: number
  productCount: number
  regionCount: number
  buyerCount: number
}

export function StatsCounter({
  vendorCount,
  productCount,
  regionCount,
  buyerCount,
}: StatsCounterProps) {
  const reduce = useReducedMotion()

  const stats: Stat[] = [
    { value: vendorCount, label: 'Active vendors', icon: Users },
    { value: productCount, label: 'Products available', icon: Package },
    { value: regionCount, label: 'Cities covered', icon: MapPin },
    { value: buyerCount, label: 'Happy customers', suffix: '+', icon: Heart },
  ]

  return (
    <section className="bg-primary-500 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">
            By the numbers
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            A marketplace that&apos;s growing
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={i}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({
  stat,
  index,
  reduce,
}: {
  stat: Stat
  index: number
  reduce: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(reduce ? stat.value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    let startTime: number | null = null
    const duration = 1500
    let raf: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.floor(eased * stat.value))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setDisplay(stat.value)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, stat.value, reduce])

  const Icon = stat.icon

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.1 }}
      className="text-center"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
        {display.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-white/80">{stat.label}</p>
    </motion.div>
  )
}
