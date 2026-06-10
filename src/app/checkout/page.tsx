'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useDemoControl } from '@/lib/store/demo-control'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Smartphone,
  Banknote,
  Truck,
  Zap,
  Lock,
  Check,
  Loader2,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { Price } from '@/components/price'
import { createOrder, markOrdersProcessing } from '@/lib/actions/orders'
import { createPaymentIntent, confirmPaymentIntent, getTestCardHints } from '@/lib/stripe'
import {
  PHILIPPINE_REGIONS,
  PROVINCES_BY_REGION,
  SHIPPING_METHODS,
  PAYMENT_METHODS,
  type RegionValue,
  type ShippingMethod,
  type PaymentMethod,
} from '@/lib/philippines'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { simulatedUserId, demoUserName, demoUserRole, demoUserAvatar } = useDemoControl()
  const isAuthenticated = !!session || !!simulatedUserId
  const demoUser = simulatedUserId ? { name: demoUserName, email: simulatedUserId, role: demoUserRole, image: demoUserAvatar } : null
  const { items, total, clearCart, couponCode } = useCart()
  const cartTotal = total()
  const cartItems = items

  const [region, setRegion] = useState<string>('')
  const [province, setProvince] = useState<string>('')
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [gcashRef, setGcashRef] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const shippingFee = useMemo(
    () => SHIPPING_METHODS.find((s) => s.value === shippingMethod)?.fee ?? 0,
    [shippingMethod],
  )

  // One shipping fee per distinct vendor
  const distinctVendorCount = useMemo(
    () => new Set(cartItems.map((i) => i.vendorId)).size,
    [cartItems],
  )
  const totalShippingFee = shippingFee * Math.max(distinctVendorCount, 1)
  const grandTotal = cartTotal + totalShippingFee

  const availableProvinces: string[] = region
    ? PROVINCES_BY_REGION[region as RegionValue] ?? []
    : []

  if (status === 'loading' && !simulatedUserId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
          <Lock className="h-7 w-7 text-primary-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Sign in to checkout
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          You need an account to complete your purchase.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href={`/auth/signin?callbackUrl=/checkout`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Sign in
          </Link>
          <Link
            href={`/auth/register?callbackUrl=/checkout`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          >
            Create account
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Add some products before checking out.
        </p>
        <Link
          href="/listings"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)

    const form = new FormData(e.currentTarget)
    const name = (form.get('name') as string)?.trim()
    const email = (form.get('email') as string)?.trim()
    const phone = (form.get('phone') as string)?.trim()
    const city = (form.get('city') as string)?.trim()
    const barangay = (form.get('barangay') as string)?.trim()
    const street = (form.get('street') as string)?.trim()
    const postalCode = (form.get('postalCode') as string)?.trim()

    if (!name || !email || !phone || !city || !barangay || !street || !postalCode) {
      setError('Please fill in all required fields')
      setPending(false)
      return
    }

    try {
      // For card payments, run simulated Stripe flow first
      let cardLast4: string | undefined
      if (paymentMethod === 'card') {
        if (!card.number || !card.expiry || !card.cvc) {
          setError('Please fill in your card details')
          setPending(false)
          return
        }
        const intent = await createPaymentIntent(grandTotal)
        const result = await confirmPaymentIntent(intent.id, card.number)
        if (!result.ok) {
          setError(result.error ?? 'Payment failed')
          setPending(false)
          return
        }
        cardLast4 = card.number.replace(/\s+/g, '').slice(-4)
      } else if (paymentMethod === 'gcash') {
        if (!gcashRef || gcashRef.length < 6) {
          setError('That GCash number doesn\'t look right')
          setPending(false)
          return
        }
      }

      const orderResult = await createOrder({
        items: cartItems.map((i) => ({
          listingId: i.listingId,
          vendorId: i.vendorId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        contact: { name, email, phone },
        address: { region, province, city, barangay, street, postalCode },
        shipping: { method: shippingMethod, fee: shippingFee },
        payment: { method: paymentMethod, cardLast4, gcashRef },
        couponCode: couponCode ?? undefined,
      })

      // Post-creation transitions by payment method
      if (orderResult.orderIds.length > 0) {
        if (paymentMethod === 'card') {
          const { markOrderPaid } = await import('@/lib/actions/orders')
          for (const id of orderResult.orderIds) {
            await markOrderPaid(id)
          }
        } else if (paymentMethod === 'cod') {
          await markOrdersProcessing(orderResult.orderIds)
        }
      }

      clearCart()
      const firstId = orderResult.orderIds[0]
      router.push(`/orders/${firstId}?success=1`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oops, something went wrong')
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Checkout
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">
          Almost there
        </h1>
      </div>

      {/* Stepper */}
      <Stepper currentStep={step} />

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Step 1: Contact */}
          <Section
            step={1}
            title="Contact information"
            description="We'll send your order confirmation here."
            onStepEnter={() => setStep(1)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" defaultValue={demoUser?.name ?? session?.user?.name ?? ''} required />
              <Field
                label="Email"
                name="email"
                type="email"
                defaultValue={demoUser?.email ?? session?.user?.email ?? ''}
                required
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                required
              />
            </div>
          </Section>

          {/* Step 2: Shipping address */}
          <Section
            step={2}
            title="Shipping address"
            description="Where should we deliver your order?"
            onStepEnter={() => setStep(2)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="region">Region</Label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value)
                    setProvince('')
                  }}
                  required
                  className={selectClass}
                >
                  <option value="">Select region</option>
                  {PHILIPPINE_REGIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <select
                  id="province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  disabled={!region}
                  className={selectClass}
                >
                  <option value="">
                    {region ? 'Select province' : 'Select region first'}
                  </option>
                  {availableProvinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="City / Municipality" name="city" required />
              <Field label="Barangay" name="barangay" required />
              <div className="sm:col-span-2">
                <Field
                  label="Street address, building, unit"
                  name="street"
                  placeholder="Unit 4B, 23 Mahogany St., Greenhills Subd."
                  required
                />
              </div>
              <Field label="Postal code" name="postalCode" required maxLength={4} pattern="[0-9]{4}" />
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Shipping method
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SHIPPING_METHODS.map((m) => {
                  const Icon = m.value === 'express' ? Zap : Truck
                  return (
                    <label
                      key={m.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                        shippingMethod === m.value
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={m.value}
                        checked={shippingMethod === m.value}
                        onChange={() => setShippingMethod(m.value)}
                        className="sr-only"
                      />
                      <Icon className="mt-0.5 h-5 w-5 text-primary-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                            {m.label}
                          </p>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                            <Price amountCents={m.fee} />
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-neutral-500">{m.description}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </Section>

          {/* Step 3: Payment */}
          <Section
            step={3}
            title="Payment"
            description="Choose how you want to pay."
            onStepEnter={() => setStep(3)}
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => {
                const Icon =
                  m.value === 'card' ? CreditCard : m.value === 'gcash' ? Smartphone : Banknote
                return (
                  <label
                    key={m.value}
                    className={`flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 transition-colors ${
                      paymentMethod === m.value
                        ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="sr-only"
                    />
                    <Icon className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                        {m.label}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">{m.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* Method-specific fields */}
            <div className="mt-5">
              {paymentMethod === 'card' && (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="card-number">Card number</Label>
                      <input
                        id="card-number"
                        value={card.number}
                        onChange={(e) => {
                          const v = e.target.value
                            .replace(/\D/g, '')
                            .replace(/(.{4})/g, '$1 ')
                            .trim()
                            .slice(0, 19)
                          setCard((c) => ({ ...c, number: v }))
                        }}
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="card-expiry">Expiry (MM/YY)</Label>
                        <input
                          id="card-expiry"
                          value={card.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
                            setCard((c) => ({ ...c, expiry: v }))
                          }}
                          placeholder="12/28"
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-cvc">CVC</Label>
                        <input
                          id="card-cvc"
                          value={card.cvc}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                            setCard((c) => ({ ...c, cvc: v }))
                          }}
                          placeholder="123"
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Test cards:{' '}
                      <code className="font-mono text-neutral-700 dark:text-neutral-300">
                        {getTestCardHints().success}
                      </code>{' '}
                      (success),{' '}
                      <code className="font-mono text-neutral-700 dark:text-neutral-300">
                        {getTestCardHints().declined}
                      </code>{' '}
                      (declined)
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'gcash' && (
                <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-[140px_1fr] dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                    <div className="grid h-32 w-32 grid-cols-8 gap-px rounded-lg bg-white p-2">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square"
                          style={{
                            backgroundColor:
                              (i * 13 + 7) % 5 === 0 ? 'currentColor' : 'transparent',
                            color: 'rgb(15 23 42)',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500">LIKHA-2026</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">
                      Scan to pay with GCash
                    </h4>
                    <p className="mt-1 text-xs text-neutral-500">
                      Open your GCash app, scan the QR code, then enter the reference number from
                      your transaction receipt.
                    </p>
                    <div className="mt-3">
                      <Label htmlFor="gcash-ref">GCash reference number</Label>
                      <input
                        id="gcash-ref"
                        value={gcashRef}
                        onChange={(e) => setGcashRef(e.target.value)}
                        placeholder="e.g. 1234567890"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  <p className="font-semibold">Pay on delivery</p>
                  <p className="mt-1 text-xs">
                    Prepare exact change if possible. A small handling fee of ₱50 may apply per
                    vendor. Your order will be processed once confirmed.
                  </p>
                </div>
              )}
            </div>
          </Section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-7 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing your order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Place order - <Price amountCents={grandTotal} />
              </>
            )}
          </button>
        </div>

        {/* Order summary sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
              Order summary
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} from{' '}
              {distinctVendorCount} {distinctVendorCount === 1 ? 'vendor' : 'vendors'}
            </p>

            <ul className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <li key={item.listingId} className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-500">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-700 px-1 text-[10px] font-semibold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium text-neutral-800 dark:text-neutral-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500">× {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
                    <Price amountCents={item.price * item.quantity} />
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <dt>Subtotal</dt>
                <dd className="font-medium tabular-nums"><Price amountCents={cartTotal} /></dd>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <dt>
                  Shipping{' '}
                  <span className="text-xs text-neutral-500">
                    ({distinctVendorCount} {distinctVendorCount === 1 ? 'vendor' : 'vendors'})
                  </span>
                </dt>
                <dd className="font-medium tabular-nums"><Price amountCents={totalShippingFee} /></dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
                <dt className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-100">
                  Total
                </dt>
                <dd className="font-serif text-xl font-bold text-primary-600 dark:text-primary-400">
                  <Price amountCents={grandTotal} />
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </form>
    </div>
  )
}

function Stepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Contact' },
    { n: 2, label: 'Shipping' },
    { n: 3, label: 'Payment' },
  ]
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((s, i) => {
        const done = currentStep > s.n
        const active = currentStep === s.n
        return (
          <li key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done
                  ? 'bg-primary-500 text-white'
                  : active
                    ? 'bg-primary-500 text-white shadow-warm-sm'
                    : 'border border-neutral-300 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : s.n}
            </div>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                active || done ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-500'
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 ${done ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-800'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Section({
  step,
  title,
  description,
  children,
  onStepEnter,
}: {
  step: 1 | 2 | 3
  title: string
  description: string
  children: React.ReactNode
  onStepEnter: () => void
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      onViewportEnter={onStepEnter}
      className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
          {step}
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {title}
          </h2>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
      {children}
    </motion.section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required,
  maxLength,
  pattern,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  pattern?: string
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        className={inputClass}
      />
    </div>
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500"
    >
      {children}
    </label>
  )
}

const inputClass =
  'h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100'

const selectClass = inputClass
