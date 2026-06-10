'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUser, requireUser, requireRole } from '@/lib/auth'
import { DEMO_MODE } from '@/lib/demo'
import { transitionListing, transitionPayment, transitionFulfillment } from '@jaostudio/core/state-machines'
import { emit } from '@jaostudio/core/events'
import { revalidatePath } from 'next/cache'
import { MOCK_COUPONS, type ShippingMethod, type PaymentMethod } from '@/lib/philippines'

async function createNotification(userId: string, type: string, title: string, message: string, link?: string) {
  await prisma.notification.create({
    data: { userId, type, title, message, link: link ?? null },
  })
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface VariantInput {
  label: string
  priceAdj: number
  stock: number
}

export async function createListing(formData: FormData) {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const pricePesos = parseFloat(formData.get('price') as string)
  const categorySlug = formData.get('category') as string
  const stock = parseInt(formData.get('stock') as string) || 1
  const isService = formData.get('isService') === 'on'
  const imageUrlsRaw = formData.get('imageUrls') as string | null
  const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : []
  const variantsRaw = formData.get('variants') as string | null
  const variants: VariantInput[] = variantsRaw ? JSON.parse(variantsRaw) : []

  if (!title || !description || !pricePesos || !categorySlug) throw new Error('Missing fields')

  const price = Math.round(pricePesos * 100)

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!category) throw new Error('Invalid category')

  const slug = slugify(title)
  const existing = await prisma.listing.findUnique({ where: { slug } })
  if (existing) throw new Error('Listing with this title already exists')

  const listing = await prisma.listing.create({
    data: {
      title,
      slug,
      description,
      price,
      stock,
      isService,
      status: 'DRAFT',
      vendorId: user.id,
      categoryId: category.id,
      images: imageUrls.length > 0
        ? { create: imageUrls.map((url, i) => ({ url, sortOrder: i })) }
        : undefined,
      variants: variants.length > 0
        ? { create: variants.map((v) => ({ label: v.label, priceAdj: v.priceAdj, stock: v.stock })) }
        : undefined,
    },
  })

  const newStatus = transitionListing('draft', 'submit', {
    hasRequiredFields: true,
    isVerifiedVendor: true,
    actor: 'vendor',
    role: 'user',
  })
  if (newStatus === 'pending_review') {
    await prisma.listing.update({
      where: { id: listing.id },
      data: { status: 'PENDING_REVIEW' },
    })
  }

  emit.listingTransitioned(listing.id, 'draft', newStatus)

  revalidatePath('/listings')
  revalidatePath('/dashboard/listings')
  return { slug: listing.slug }
}

export async function moderateListing(listingId: string, action: 'approve' | 'reject') {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')

  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) throw new Error('Listing not found')

  const stateKey = listing.status.toLowerCase() as any
  const newStatus = transitionListing(stateKey, action, {
    hasRequiredFields: true,
    isVerifiedVendor: true,
    actor: 'admin',
    role: 'admin',
  })
  if (newStatus === stateKey) throw new Error('Invalid transition')

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      status: newStatus.toUpperCase() as any,
      moderatedAt: new Date(),
      moderatedById: user.id,
    },
  })

  emit.listingTransitioned(listingId, stateKey, newStatus)
  revalidatePath('/admin/listings')
  revalidatePath('/listings')
}

interface OrderItemInput {
  listingId: string
  vendorId: string
  name: string
  price: number
  quantity: number
}

interface CreateOrderInput {
  items: OrderItemInput[]
  contact: {
    name: string
    email: string
    phone: string
  }
  address: {
    region: string
    province: string
    city: string
    barangay: string
    street: string
    postalCode: string
  }
  shipping: {
    method: ShippingMethod
    fee: number
  }
  payment: {
    method: PaymentMethod
    cardLast4?: string
    gcashRef?: string
  }
  couponCode?: string
}

export async function createOrder(input: CreateOrderInput) {
  const user = await requireUser()
  if (!DEMO_MODE) throw new Error('Production mode not yet configured - run in DEMO_MODE=true')

  if (!input.items.length) throw new Error('Cart is empty')

  const requiredContact = ['name', 'email', 'phone'] as const
  for (const k of requiredContact) {
    if (!input.contact[k]) throw new Error(`Missing contact field: ${k}`)
  }
  const requiredAddress = ['region', 'province', 'city', 'barangay', 'street', 'postalCode'] as const
  for (const k of requiredAddress) {
    if (!input.address[k]) throw new Error(`Missing address field: ${k}`)
  }
  if (!input.shipping.method) throw new Error('Missing shipping method')
  if (!input.payment.method) throw new Error('Missing payment method')

  // Group items by vendor
  const itemsByVendor = new Map<string, OrderItemInput[]>()
  for (const item of input.items) {
    if (!itemsByVendor.has(item.vendorId)) itemsByVendor.set(item.vendorId, [])
    itemsByVendor.get(item.vendorId)!.push(item)
  }

  // Subtotal across all vendors
  const subtotal = input.items.reduce((s, i) => s + i.price * i.quantity, 0)

  // Coupon discount
  let discount = 0
  let discountLabel: string | null = null
  if (input.couponCode) {
    const code = input.couponCode.toUpperCase()
    const coupon = MOCK_COUPONS[code]
    if (coupon) {
      if (coupon.kind === 'percent') {
        discount = Math.floor((subtotal * coupon.value) / 100)
      } else if (coupon.kind === 'fixed') {
        discount = Math.min(coupon.value, subtotal)
      }
      discountLabel = `${code}: ${coupon.label}`
    }
  }

  // Shipping: 1 fee per vendor (capped at 2× if many vendors - simplified: 1 per vendor)
  const shippingFee = input.shipping.fee * itemsByVendor.size
  const total = Math.max(0, subtotal - discount) + shippingFee

  const addressLine = [
    input.address.street,
    `Brgy. ${input.address.barangay}`,
    `${input.address.city}, ${input.address.province}`,
    `${input.address.region} ${input.address.postalCode}`,
    'Philippines',
  ].join(', ')

  // Create one order per vendor
  const created: { orderId: string; orderNumber: string; vendorId: string }[] = []
  for (const [vendorId, vendorItems] of itemsByVendor.entries()) {
    const vendorSubtotal = vendorItems.reduce((s, i) => s + i.price * i.quantity, 0)
    // Pro-rate discount across vendors
    const vendorDiscount = Math.floor((vendorSubtotal / subtotal) * discount)
    const vendorTotal = Math.max(0, vendorSubtotal - vendorDiscount) + input.shipping.fee

    const orderNumber = `PLG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        total: vendorTotal,
        currency: 'php',
        paymentState: 'PENDING_PAYMENT',
        fulfillmentState: 'UNFULFILLED',
        buyerId: user.id,
        vendorId,
        email: input.contact.email,
        name: input.contact.name,
        address: addressLine,
        items: {
          create: vendorItems.map((i) => ({
            listingId: i.listingId,
            productName: i.name,
            priceAtPurchase: i.price,
            quantity: i.quantity,
          })),
        },
      },
    })

    const causeId = `evt_${Date.now()}_create_${order.id}`
    emit.orderCreated(order.id, vendorTotal, 'php', undefined, causeId)

    await createNotification(vendorId, 'order_update', `New order ${orderNumber}`, 'A customer has placed a new order.', `/dashboard/orders`)
    await createNotification(user.id, 'order_update', `Order ${orderNumber} placed`, 'Your order has been placed successfully.', `/orders/${order.id}`)

    created.push({ orderId: order.id, orderNumber, vendorId })
  }

  revalidatePath('/orders')
  return {
    orderIds: created.map((c) => c.orderId),
    orderNumbers: created.map((c) => c.orderNumber),
    subtotal,
    discount,
    discountLabel,
    shippingFee,
    total,
  }
}

export async function markOrderPaid(orderId: string) {
  const user = await requireUser()
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')
  if (order.buyerId !== user.id) throw new Error('Forbidden')

  if (order.paymentState !== 'PENDING_PAYMENT') return { ok: true }

  const next = transitionPayment('pending_payment', 'confirm_payment', {
    total: order.total,
    items: 1,
    actor: 'buyer',
    role: 'user',
  })
  if (next === 'paid') {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentState: 'PAID' },
    })
    emit.orderTransitioned(orderId, 'pending_payment', 'paid', undefined, `evt_${Date.now()}_pay`)
    await createNotification(order.buyerId, 'order_update', 'Payment confirmed', `Order ${order.orderNumber} has been paid.`, `/orders/${orderId}`)
  }
  revalidatePath(`/orders/${orderId}`)
  revalidatePath('/orders')
  return { ok: true }
}

export async function markOrderCod(orderId: string) {
  // For Cash on Delivery - order stays PENDING_PAYMENT until delivery
  // but FULFILLMENT goes to PROCESSING
  const user = await requireUser()
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')
  if (order.buyerId !== user.id) throw new Error('Forbidden')
  revalidatePath(`/orders/${orderId}`)
  return { ok: true }
}

export async function markOrdersProcessing(orderIds: string[]) {
  // Used immediately after order creation for COD orders - transitions
  // fulfillment to PROCESSING so the vendor can start picking & packing.
  // Payment stays PENDING_PAYMENT (cash on delivery).
  const user = await requireUser()
  if (!orderIds.length) return { ok: true }

  for (const orderId of orderIds) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) continue
    if (order.buyerId !== user.id) continue
    if (order.fulfillmentState !== 'UNFULFILLED') continue

    const stateKey = order.fulfillmentState.toLowerCase() as any
    // Try the state machine first with the buyer-initiated action.
    // If the machine rejects (e.g., actor guard), fall back to a direct
    // system-level transition so the COD flow isn't blocked for the demo.
    const next = transitionFulfillment(stateKey, 'process', {
      actor: 'buyer',
      role: 'user',
      total: order.total,
      items: order.items.length,
    })

    const resolvedState =
      next !== stateKey ? next : (stateKey === 'unfulfilled' ? 'processing' : stateKey)

    await prisma.order.update({
      where: { id: orderId },
      data: { fulfillmentState: resolvedState.toUpperCase() as any },
    })
    emit.orderTransitioned(
      orderId,
      stateKey,
      resolvedState,
      undefined,
      `evt_${Date.now()}_cod_process`,
    )
    await createNotification(order.vendorId, 'order_update', `Order ${order.orderNumber}`, 'A new order is awaiting processing.', `/dashboard/orders`)
    revalidatePath(`/orders/${orderId}`)
    revalidatePath('/dashboard/orders')
  }
  return { ok: true }
}

export async function transitionOrderFulfillment(
  orderId: string,
  action: 'process' | 'ship' | 'return_fulfillment',
) {
  await requireRole(['VENDOR', 'ADMIN'])
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  if (!order) throw new Error('Order not found')

  const stateKey = order.fulfillmentState.toLowerCase() as any
  const next = transitionFulfillment(stateKey, action, {
    actor: 'vendor',
    role: 'user',
    total: order.total,
    items: order.items.length,
  })
  if (next === stateKey) throw new Error('Invalid transition')

  await prisma.order.update({
    where: { id: orderId },
    data: { fulfillmentState: next.toUpperCase() as any },
  })
  emit.orderTransitioned(orderId, stateKey, next, undefined, `evt_${Date.now()}_${action}`)
  const messages: Record<string, string> = { process: 'is being prepared', ship: 'has been shipped', return_fulfillment: 'has been returned' }
  if (messages[action]) {
    await createNotification(order.buyerId, 'order_update', `Order ${order.orderNumber}`, `Your order ${messages[action]}.`, `/orders/${orderId}`)
  }
  revalidatePath(`/orders/${orderId}`)
  revalidatePath('/dashboard/orders')
  return { ok: true, state: next }
}

export async function updateVendorProfile(formData: FormData) {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const bio = formData.get('bio') as string
  const location = formData.get('location') as string
  const socialLinksRaw = formData.get('socialLinks') as string

  if (!name) throw new Error('Name is required')

  let socialLinks: Record<string, string> = {}
  if (socialLinksRaw) {
    try {
      socialLinks = JSON.parse(socialLinksRaw)
    } catch { /* ignore invalid JSON */ }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, avatarUrl: avatarUrl || null, bio: bio || null, location: location || null, socialLinks },
  })

  revalidatePath('/dashboard/profile')
  revalidatePath(`/vendors/${user.id}`)
  return { ok: true }
}

export async function archiveListing(listingId: string) {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') throw new Error('Unauthorized')

  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) throw new Error('Listing not found')
  if (listing.vendorId !== user.id) throw new Error('Forbidden')

  await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'ARCHIVED' },
  })

  revalidatePath('/dashboard/listings')
  revalidatePath('/listings')
  return { ok: true }
}

export async function updateListing(listingId: string, formData: FormData) {
  const user = await getSessionUser()
  if (!user || user.role !== 'VENDOR') throw new Error('Unauthorized')

  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) throw new Error('Listing not found')
  if (listing.vendorId !== user.id) throw new Error('Forbidden')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const pricePesos = parseFloat(formData.get('price') as string)
  const categorySlug = formData.get('category') as string
  const stock = parseInt(formData.get('stock') as string) || 1
  const isService = formData.get('isService') === 'on'
  const variantsRaw = formData.get('variants') as string | null
  const variants: VariantInput[] = variantsRaw ? JSON.parse(variantsRaw) : []

  if (!title || !description || !pricePesos || !categorySlug) throw new Error('Missing fields')

  const price = Math.round(pricePesos * 100)
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!category) throw new Error('Invalid category')

  const slug = slugify(title)

  // Replace variants: delete existing, create new
  await prisma.listingVariant.deleteMany({ where: { listingId } })
  if (variants.length > 0) {
    await prisma.listingVariant.createMany({
      data: variants.map((v) => ({ listingId, label: v.label, priceAdj: v.priceAdj, stock: v.stock })),
    })
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      slug,
      description,
      price,
      stock,
      isService,
      categoryId: category.id,
      status: 'PENDING_REVIEW',
    },
  })

  revalidatePath('/dashboard/listings')
  revalidatePath(`/listings/${slug}`)
  return { slug }
}

export async function cancelOrder(orderId: string) {
  const user = await requireUser()
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')
  if (order.buyerId !== user.id) throw new Error('Forbidden')
  if (order.paymentState !== 'PENDING_PAYMENT') {
    throw new Error('Can only cancel unpaid orders')
  }
  await prisma.order.delete({ where: { id: orderId } })
  emit.orderTransitioned(orderId, 'pending_payment', 'canceled', undefined, `evt_${Date.now()}_cancel`)
  revalidatePath('/orders')
  return { ok: true }
}
