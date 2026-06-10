'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Check, Loader2 } from 'lucide-react'

export function NewsletterCta() {
  const reduce = useReducedMotion()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setState('error')
      return
    }
    setState('loading')
    // Simulate network - no backend for newsletter in demo
    await new Promise((r) => setTimeout(r, 800))
    setState('success')
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-neutral-900 py-20 text-white sm:py-24">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97757' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-300">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Get the freshest deals
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            Weekly picks, flash sales, and vendor stories - straight to your inbox.
          </p>

          {state === 'success' ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-6 py-3 text-sm font-semibold text-accent-200"
            >
              <Check className="h-4 w-4" />
              Thanks - you&apos;re on the list.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (state === 'error') setState('idle')
                }}
                placeholder="you@email.com"
                disabled={state === 'loading'}
                className="h-12 w-full flex-1 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          )}

          {state === 'error' && (
            <p className="mt-2 text-sm text-red-300">
              Hmm, that doesn't look like an email.
            </p>
          )}

          <p className="mt-4 text-xs text-neutral-300">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
