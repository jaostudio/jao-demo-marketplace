# Likha Marketplace — API Reference

> Last updated: Sprint 0
> All server actions live in `src/lib/actions/`. All return types are typed.

---

## Conventions

- All actions are async functions.
- All actions require a session unless explicitly marked "public".
- All actions throw `Error` on failure; the calling component catches and displays.
- All write actions call `revalidatePath()` for the affected routes.
- All state-machine transitions go through `@jaostudio/core` — never update enum fields directly.
- All write actions emit events via `@jaostudio/core/events`.

---

## Auth Actions (`lib/auth.ts`)

### `signIn(credentials)`
Handled by NextAuth `signIn('credentials', ...)` from the client. No custom action.

### `signOut()`
Handled by NextAuth `signOut()` from the client.

### `register(data)` — `POST /api/auth/register`
```ts
{
  name: string
  email: string
  password: string
  role: 'BUYER' | 'VENDOR'
}
// Returns: { ok: true } | { error: string }
// Errors: 400 (missing fields), 400 (admin role), 409 (email taken), 500
```

---

## Listing Actions (`lib/actions/orders.ts` — existing, to be extended)

### `createListing(formData)` — existing
```ts
formData: { title, description, price, category }
// Returns: { slug: string }
// Errors: 'Unauthorized' (not vendor), 'Missing fields', 'Invalid category', 'Listing with this title already exists'
// Side effects: emit.listingTransitioned(id, 'draft', 'pending_review')
```

### `moderateListing(listingId, action)` — existing
```ts
action: 'approve' | 'reject'
// Errors: 'Unauthorized' (not admin), 'Listing not found', 'Invalid transition'
// Side effects: emit.listingTransitioned(id, from, to)
```

### `submitListingForReview(listingId)` — NEW (Sprint 3)
```ts
// Vendor action: DRAFT → PENDING_REVIEW
// Errors: 'Unauthorized' (not owner), 'Invalid state'
// Side effects: emit.listingTransitioned
```

### `archiveListing(listingId)` — NEW (Sprint 3)
```ts
// Vendor or admin: any → ARCHIVED
```

### `updateListing(listingId, formData)` — NEW (Sprint 3)
```ts
formData: Partial<{ title, description, price, category, stock }>
// Vendor (own listings) or admin
```

### `createOrder(formData)` — existing, to be extended
```ts
formData: { items: JSON.stringify(CartItem[]), name, email, address }
// Returns: { orderId: string }
// Errors: 'Unauthorized', 'Cart is empty', 'Missing required fields'
// Side effects: emit.orderCreated + emit.orderTransitioned
```

### `markOrderPaid(orderId)` — NEW (Sprint 2)
```ts
// Stripe webhook equivalent for manual/test flow
// Side effects: emit.orderTransitioned(pending_payment → paid)
```

### `transitionOrderFulfillment(orderId, action)` — NEW (Sprint 2)
```ts
action: 'process' | 'ship' | 'return_fulfillment'
// Vendor only (own orders) or admin
// Side effects: emit.orderTransitioned
```

### `requestRefund(orderId)` — NEW (Sprint 4)
```ts
// Buyer (own order, within window) or admin
// Side effects: emit.orderTransitioned(paid → refunded)
```

---

## Wishlist Actions (`lib/actions/wishlist.ts`) — NEW (Sprint 1)

### `addToWishlist(listingId)`
```ts
// Auth (BUYER)
// Errors: 'Unauthorized', 'Already in wishlist'
// Side effects: revalidatePath('/wishlist'), revalidatePath('/listings/[slug]')
```

### `removeFromWishlist(listingId)`
```ts
// Auth (BUYER)
// Errors: 'Unauthorized', 'Not in wishlist'
```

### `getWishlistIds()`
```ts
// Auth (BUYER)
// Returns: string[]  (listing IDs, for heart-icon state on cards)
```

### `moveWishlistToCart(listingIds)`
```ts
// Auth (BUYER) — client picks up IDs and dispatches to cart store
// This is a client-side action, not a server action.
```

---

## Review Actions (`lib/actions/reviews.ts`) — NEW (Sprint 4)

### `createReview(formData)`
```ts
formData: { listingId, rating: 1-5, text, imageUrls?: string[] }
// Auth (BUYER, must have purchased the listing)
// Errors: 'Unauthorized', 'Already reviewed', 'Must purchase before reviewing', 'Rating must be 1-5'
// Side effects: revalidatePath(`/listings/${slug}`), revalidatePath('/dashboard')
```

### `replyToReview(reviewId, text)`
```ts
// Auth (VENDOR, owner of the reviewed listing) or admin
```

### `deleteReview(reviewId)`
```ts
// Auth (author or admin)
```

---

## Booking Actions (`lib/actions/booking.ts`) — NEW (Sprint 6)

### `createBooking(formData)`
```ts
formData: { listingId, date: ISO string, message? }
// Auth (BUYER)
// Errors: 'Unauthorized', 'Not a service listing', 'Date in the past', 'Slot taken'
// Side effects: emit.bookingTransitioned(pending), notification to vendor
```

### `confirmBooking(bookingId)`
```ts
// Auth (VENDOR, owner) — PENDING → CONFIRMED
```

### `cancelBooking(bookingId, reason?)`
```ts
// Auth (buyer who made it or vendor) — PENDING/CONFIRMED → CANCELLED
```

### `completeBooking(bookingId)`
```ts
// Auth (VENDOR, owner) — CONFIRMED → COMPLETED
// New state added: 'COMPLETED' (extension to booking state machine)
```

---

## Message Actions (`lib/actions/messages.ts`) — NEW (Sprint 5)

### `getOrCreateConversation(otherUserId, listingId?)`
```ts
// Auth (BUYER or VENDOR)
// Returns: { id: string }  (existing or new conversation)
// Errors: 'Unauthorized', 'Cannot message yourself'
```

### `sendMessage(conversationId, content)`
```ts
// Auth (participant in conversation)
// Errors: 'Unauthorized', 'Not a participant', 'Empty content'
// Side effects: notification to other participant, update conversation.updatedAt
```

### `markConversationRead(conversationId)`
```ts
// Auth (participant)
// Marks all unread messages addressed to current user as read
```

### `getUnreadCount()`
```ts
// Auth (any role)
// Returns: number  (sum of unread messages + unread notifications)
```

---

## Notification Actions (`lib/actions/notifications.ts`) — NEW (Sprint 5)

### `markNotificationRead(id)`
```ts
// Auth (owner of notification)
```

### `markAllNotificationsRead()`
```ts
// Auth (current user)
```

### `createNotification(data)` — internal helper
```ts
data: { userId, type, title, message, link? }
// Called from other server actions; not exposed to client
```

### `getNotifications({ limit?, unreadOnly? })`
```ts
// Auth (current user)
// Returns: Notification[]
```

---

## Category Actions (`lib/actions/categories.ts`) — NEW (Sprint 4)

### `createCategory(data)`
```ts
data: { name, slug, icon?, coverUrl? }
// Auth (ADMIN)
```

### `updateCategory(id, data)`
```ts
// Auth (ADMIN)
```

### `deleteCategory(id)`
```ts
// Auth (ADMIN)
// Errors: 'Cannot delete category with listings' (if listings exist)
```

---

## Flash Sale Actions (`lib/actions/flash-sales.ts`) — NEW (Sprint 6)

### `createFlashSale(data)`
```ts
data: { listingIds: string[], discountPercent: number, endsAt: Date }
// Auth (ADMIN)
// Side effects: updates each listing with isFlashSale, flashSalePrice, flashSaleEnds
```

### `endFlashSale(listingId)`
```ts
// Auth (ADMIN) or system (after endsAt passes)
// Side effects: clears flash sale fields
```

---

## Cart (Client-only, Zustand)

The cart is **not** a server action — it's a Zustand store with `persist` middleware. See `lib/store/cart.ts`.

```ts
useCart(): {
  items: CartItem[]
  addItem(item): void
  removeItem(listingId): void
  updateQuantity(listingId, qty): void
  clearCart(): void
  groups(): CartGroup[]  // grouped by vendor
  total(): number        // cents
  itemCount(): number
}
```

### `CartItem` shape
```ts
{
  listingId: string
  vendorId: string
  vendorName: string
  name: string
  price: number          // cents
  quantity: number
  imageUrl?: string
}
```

---

## Vendor Profile Actions

### `updateVendorProfile(data)` — NEW (Sprint 3)
```ts
data: { name?, bio?, avatarUrl?, location?, socialLinks?: { facebook?, instagram? } }
// Auth (VENDOR)
```

---

## Admin Actions

### `changeUserRole(userId, newRole)`
```ts
// Auth (ADMIN)
// newRole: 'BUYER' | 'VENDOR' | 'ADMIN'
// Cannot change own role
```

### `suspendUser(userId)`
```ts
// Auth (ADMIN) — soft delete via status field (TBD if we add User.status)
```

### `bulkApproveListings(listingIds)`
```ts
// Auth (ADMIN) — runs listing machine transition for each
```

---

## Stripe Webhook (`app/api/stripe/webhook/route.ts`) — NEW (Sprint 2)

### `POST /api/stripe/webhook`
- Verifies Stripe signature
- On `payment_intent.succeeded` → calls `markOrderPaid(orderId)`
- On `payment_intent.payment_failed` → leaves order in `PENDING_PAYMENT`, sends notification

---

## Server Action Patterns

### Throwing errors
```ts
export async function createReview(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')
  // ...
}
```

### Client catches
```tsx
'use client'
import { createReview } from '@/lib/actions/reviews'

async function handleSubmit() {
  try {
    await createReview(formData)
    toast.success('Review posted!')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
  }
}
```

### Revalidating
```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/listings')
revalidatePath(`/listings/${slug}`)
revalidatePath('/dashboard')
```

---

## Auth helpers (`lib/auth.ts`)

Reused by all protected actions:

```ts
// Returns session user or throws
async function requireUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')
  return session.user as { id: string; role: UserRole; email: string; name: string }
}

async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireUser()
  if (Array.isArray(role) ? !role.includes(user.role) : user.role !== role) {
    throw new Error('Forbidden')
  }
  return user
}

async function requireVendor() { return requireRole('VENDOR') }
async function requireAdmin() { return requireRole('ADMIN') }
```

These should be added to `lib/auth.ts` in Sprint 0 to standardize the pattern.
