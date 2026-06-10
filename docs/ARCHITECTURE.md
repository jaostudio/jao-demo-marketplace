# Likha Marketplace — Architecture

> Last updated: Sprint 0
> Companion to: `PLAN.md` (what we're building), `API.md` (how we call it), `SEED.md` (what data it starts with)

---

## 1. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Server components, streaming, ISR, RSC patterns |
| Auth | NextAuth v4 + PrismaAdapter | JWT strategy, role embedded, same as before |
| Database | SQLite (dev) / Postgres (prod) | Prisma works with both, swap URL only |
| ORM | Prisma 7 | Type-safe, migrations, already in use |
| Client state | Zustand + persist | Cart, wishlist, recently viewed |
| Server state | RSC + `revalidatePath` | No need for TanStack Query yet |
| Styling | Tailwind CSS v4 | Already configured |
| Fonts | `next/font/google` (Inter, Playfair Display) | No external request, no FOUT |
| Icons | `lucide-react` | Already a dependency |
| Theme | `next-themes` | System detection, no FOUC |
| Charts | `recharts` (Sprint 3) | React-native, no canvas |
| Forms | `react-hook-form` + `zod` (Sprint 3) | Type-safe, performant |
| Date picker | `react-datepicker` (Sprint 6) | Mature, accessible |
| i18n | `next-intl` (Sprint 7) | App router compatible |
| Payment | `stripe` + webhook (Sprint 2) | Test mode, real flow |
| Image upload | `cloudinary` upload widget (Sprint 7) | Free tier, easy |

---

## 2. Monorepo Position

```
Portfolio contents/
├── packages/
│   ├── core/         ← @jaostudio/core: state machines, events, helpers
│   ├── engine/       ← @jaostudio/engine: types, renderers (NOT used in marketplace)
│   ├── ui/           ← @jaostudio/ui: section components (NOT used in marketplace)
│   └── analytics/    ← @jaostudio/analytics
├── marketplace-demo/ ← THIS PROJECT
└── ... other demos
```

Likha consumes `@jaostudio/core` for state machines and event emission only. We do not use `@jaostudio/engine` or `@jaostudio/ui` (those are landingpage-specific). The marketplace UI is bespoke.

---

## 3. Data Model (Target State)

```prisma
// ============== Existing (kept as-is) ==============

enum UserRole { VENDOR BUYER ADMIN }
enum ListingStatus { DRAFT PENDING_REVIEW APPROVED REJECTED SOLD ARCHIVED }
enum BookingStatus { PENDING CONFIRMED CANCELLED }
enum PaymentState { PENDING_PAYMENT PAID REFUNDED }
enum FulfillmentState { UNFULFILLED PROCESSING FULFILLED RETURNED }

model User {
  id, name, email, password, role, image, createdAt
  bio           String?
  avatarUrl     String?
  location      String?
  socialLinks   Json?   // { facebook?, instagram?, twitter? }

  listings         Listing[]
  moderatedListings Listing[] @relation("ModeratedListings")
  reviews          Review[]
  bookings         Booking[]
  orders           Order[]
  vendorOrders     Order[]    @relation("VendorOrders")
  metrics          VendorMetrics?
  wishlist         WishlistItem[]
  notifications    Notification[]
  conversationsA   Conversation[] @relation("ConvA")
  conversationsB   Conversation[] @relation("ConvB")
  messagesSent     Message[]
}

model Category {
  id, name, slug
  icon      String?   // lucide icon name (Sprint 4)
  coverUrl  String?   // hero tile image (Sprint 4)
  listings  Listing[]
}

model Listing {
  id, title, slug, description, price, status, ...
  moderatedAt, moderatedById, vendorId, categoryId

  // NEW in this build
  isService        Boolean   @default(false)
  bookingDuration  Int?      // minutes
  stock            Int       @default(1)
  isFlashSale      Boolean   @default(false)
  flashSalePrice   Int?      // cents (when active)
  flashSaleEnds    DateTime?

  images   ListingImage[]
  reviews  Review[]
  bookings Booking[]
  wishlist WishlistItem[]
}

model ListingImage { id, url, alt, sortOrder, listingId }
model Review { id, rating, text, listingId, authorId, createdAt @@unique([listingId, authorId]) }
model Booking { id, date, message, status, listingId, buyerId, createdAt, updatedAt }
model VendorMetrics { vendorId @id, vendor, listingCount, orderCount, reviewCount, updatedAt }
model Order { id, orderNumber, total, currency, paymentState, fulfillmentState, buyerId, vendorId, email, name, address, createdAt; items OrderItem[] }
model OrderItem { id, orderId, listingId, productName, priceAtPurchase, quantity }

// ============== New (Sprint 0) ==============

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  listingId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@unique([userId, listingId])
  @@index([userId])
  @@index([listingId])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // "order_update" | "review_reply" | "booking_reminder" | "message" | "system" | "flash_sale"
  title     String
  message   String
  isRead    Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())
  @@index([userId, isRead, createdAt])
}

model Conversation {
  id           String    @id @default(cuid())
  participantA User      @relation("ConvA", fields: [participantAId], references: [id])
  participantB User      @relation("ConvB", fields: [participantBId], references: [id])
  participantAId String
  participantBId String
  listingId    String?   // optional context: started from this listing
  messages     Message[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  @@unique([participantAId, participantBId, listingId])
  @@index([participantAId])
  @@index([participantBId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation(fields: [senderId], references: [id])
  content        String
  isRead         Boolean      @default(false)
  createdAt      DateTime     @default(now())
  @@index([conversationId, createdAt])
}
```

### Schema migration approach

- **Sprint 0**: Add new models, extend Listing/User. No destructive changes. Use `prisma db push` for dev.
- **Production**: Would require `prisma migrate dev` workflow. For this demo, `db push` is fine.

---

## 4. State Machines (consumed from `@jaostudio/core`)

### Listing machine

```
DRAFT ──submit──→ PENDING_REVIEW ──approve──→ APPROVED ──sell──→ SOLD
                       │                          │
                       └──reject──→ REJECTED      ├──archive──→ ARCHIVED
                                       │           │
                                       └─archive──→│
                                                   └─republish (vendor only)──→ PENDING_REVIEW
```

**Actor guards:**
- `submit`: vendor only
- `approve` / `reject`: admin only
- `sell`: system only (after payment captured)
- `archive`: buyer, vendor, admin (anyone)
- `republish`: vendor only

### Payment sub-machine

```
PENDING_PAYMENT ──confirm_payment──→ PAID ──refund_payment──→ REFUNDED
```

**Guards:**
- `confirm_payment`: total > 0, actor ≠ vendor
- `refund_payment`: admin or system only

### Fulfillment sub-machine

```
UNFULFILLED ──process──→ PROCESSING ──ship──→ FULFILLED ──return_fulfillment──→ RETURNED
```

**Guards:**
- `process`: ≠ buyer
- `ship`: state === PROCESSING, ≠ buyer
- `return_fulfillment`: ≠ vendor

### Booking machine (newly wired in Sprint 6)

```
PENDING ──confirm──→ CONFIRMED ──cancel──→ CANCELLED
   └──────cancel──────────────────→
```

**Guards:**
- `confirm`: vendor only
- `cancel`: buyer or vendor

### Content machine (NOT USED here)

We don't use the content state machine — that's for the content-platform-demo.

---

## 5. Event System

All status changes emit events through `@jaostudio/core/events`:

| Event | When | Consumers |
|-------|------|-----------|
| `emit.listingTransitioned(listingId, from, to)` | Listing status changes | Notification system, analytics |
| `emit.listingViewed(listingId, vendorId)` | Buyer opens listing page | Vendor metrics (views counter) |
| `emit.orderCreated(orderId, total, currency, causeId)` | Order placed | Notification system |
| `emit.orderTransitioned(orderId, from, to, causeId)` | Payment/fulfillment change | Notification system |
| `emit.bookingTransitioned(bookingId, from, to)` | Booking status changes | Notification system |
| `emit.pageview(pathname)` | Page navigation | Analytics (page-view-tracker) |
| `emit.actionClicked(label, href?)` | Button/link click | Analytics |

**Causation chains:**
- `createOrder` → emits `orderCreated` then `orderTransitioned(pending→paid)` with same `causeId`
- `confirmBooking` → emits `bookingTransitioned(pending→confirmed)`

---

## 6. Route Structure

```
/                              Public — homepage
/listings                      Public — browse all
/listings/[slug]               Public — product detail
/listings/create               Auth (VENDOR) — create listing
/vendors/[id]                  Public — vendor storefront
/about                         Public — about Likha
/wishlist                      Auth (BUYER) — saved items
/cart                          Public (persisted) — cart
/checkout                      Auth (BUYER) — checkout
/orders                        Auth (BUYER) — my orders
/orders/[id]                   Auth (BUYER) — order detail
/booking/[listingId]           Auth (BUYER) — book a service
/messages                      Auth — inbox
/messages/[id]                 Auth — conversation
/auth/signin                   Public
/auth/register                 Public
/dashboard                     Auth (VENDOR | ADMIN) — overview
/dashboard/listings            Auth (VENDOR) — manage listings
/dashboard/orders              Auth (VENDOR) — incoming orders
/dashboard/bookings            Auth (VENDOR) — booking calendar
/dashboard/profile             Auth (VENDOR) — store profile
/dashboard/messages            Auth (VENDOR) — buyer messages
/admin                         Auth (ADMIN) — overview
/admin/listings                Auth (ADMIN) — moderation
/admin/categories              Auth (ADMIN) — category CRUD
/admin/users                   Auth (ADMIN) — user management
/admin/flash-sales             Auth (ADMIN) — promotional deals
/admin/settings                Auth (ADMIN) — site settings
```

### Layout structure

- `app/layout.tsx` — root layout: `<html><body><AuthProvider><ThemeProvider><Nav /><main>{children}</main><Footer /></ThemeProvider></AuthProvider></body></html>`
- `app/(auth)/layout.tsx` — minimal layout for signin/register (centered card)
- `app/dashboard/layout.tsx` — sidebar nav for vendor + admin
- `app/admin/layout.tsx` — separate sidebar nav for admin

---

## 7. State Distribution

| Data | Lives in | Why |
|------|----------|-----|
| Cart items | Zustand + localStorage | Survives page refresh, client-only |
| Wishlist | Database (per user) | Server-truth, multi-device |
| Recently viewed | Zustand + localStorage | Privacy-friendly, no PII needed |
| User session | NextAuth JWT | Server + client accessible |
| Theme preference | next-themes (localStorage) | No DB needed |
| Currency preference | localStorage | Client-only, fast |
| Language preference | next-intl cookie | Server-readable, SEO-friendly |
| Notifications | Database | Cross-device, real-time |
| Messages | Database | Persisted, queryable |

---

## 8. Server vs Client Components

| Pattern | Use when |
|---------|----------|
| Server Component (default) | Reading from DB, no interactivity, SEO-critical pages |
| Client Component (`'use client'`) | Forms, state, event handlers, browser APIs |
| Server Action | Form submissions, mutations called from client components |
| Route Handler (`route.ts`) | Webhooks (Stripe), public APIs that need a URL |

### Examples
- `/listings/page.tsx` — Server Component (reads DB)
- `/listings/[slug]/add-to-cart-button.tsx` — Client Component (needs cart store)
- `lib/actions/orders.ts` — Server Actions (mutations)
- `app/api/stripe/webhook/route.ts` — Route Handler (webhook signature verification)

---

## 9. Error Handling Strategy

- **Server actions**: throw `Error` with descriptive message; client catches and displays in form
- **Not found**: `notFound()` from `next/navigation`
- **Unauthorized**: `redirect('/auth/signin')`
- **Forbidden**: throw `Error('Forbidden')` → caught by error boundary
- **Global error boundary**: `app/error.tsx` — generic friendly error UI
- **Form errors**: local state in client component, displayed inline

---

## 10. Performance Strategy

- **Static rendering** for `/about`, `/listings/[slug]` after first paint
- **Streaming SSR** for product lists (skeleton loader while data loads)
- **Image optimization** via `next/image` with Unsplash loader
- **Code splitting** automatic via App Router
- **Font preload** via `next/font/google`
- **Prefetching** automatic for `<Link>` in viewport
- **No client-side data fetching** for initial page loads — RSC fetches directly

### Lighthouse targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 11. Security Considerations

- **Auth**: NextAuth JWT, password hashing with bcrypt (already done)
- **CSRF**: Server actions are auto-protected by Next.js
- **XSS**: React escapes by default; never `dangerouslySetInnerHTML` without sanitization
- **SQL injection**: Prisma parameterized queries throughout
- **Image upload**: Validate file type + size on server, use Cloudinary signed uploads
- **Rate limiting**: Add `lib/rate-limit.ts` for auth endpoints (Sprint 8)
- **Session fixation**: NextAuth handles session rotation
- **Role-based access**: every protected route checks `session.user.role`
