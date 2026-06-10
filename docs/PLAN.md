# Likha Marketplace — Development Plan

> **Status:** Planning complete, Sprint 0 in progress
> **Last updated:** Sprint 0 kickoff
> **Brand:** Likha (Filipino for "to create / a creation")

---

## 1. Vision

A production-grade, multi-vendor marketplace demo that showcases every feature a client would expect from a real-world artisan commerce platform. The demo is **a single deployment, one fictional brand** ("Likha"), focused on Filipino artisan goods, with enough polish and depth to feel like a real product a client could sign up for tomorrow.

## 2. Strategy

- **One brand, one site, one experience.** No vertical switcher (already proven in `landingpage-demo`).
- **Show, don't tell.** Every feature must be visible in a real user flow, not buried in a settings page.
- **State-machine-first.** Listing, payment, fulfillment, and booking transitions are guarded by `@jaostudio/core` machines. Every status change is a real transition.
- **Philippines-flavored authenticity.** Currency in PHP by default, address fields use Philippine regions/provinces/cities/barangays, content references real artisan traditions.

## 3. What's Already Built (Keep)

- NextAuth v4 with CredentialsProvider + JWT role embedding (BUYER / VENDOR / ADMIN)
- Listing lifecycle state machine (DRAFT → PENDING_REVIEW → APPROVED/REJECTED → SOLD/ARCHIVED)
- Payment + Fulfillment sub-machines
- Booking state machine (PENDING → CONFIRMED → CANCELLED) — schema only
- Multi-vendor cart (Zustand + persist, grouped by vendor)
- Checkout with vendor-scoped order creation
- Admin moderation panel
- Vendor dashboard (basic metrics, listing/orders list)
- Event emitter wired through `@jaostudio/core/events` with causationId
- Seed data: 4 users, 5 categories, 10 listings, 2 reviews

## 4. What's New in This Build

### 4.1 Rebrand

| Before | After |
|--------|-------|
| Name: "Marketplace" | Name: **Likha** |
| Tagline: "Discover Unique Goods" | Tagline: **"Discover Filipino Craft"** |
| Brand color: green `#22c55e` | Brand color: **terracotta `#C2693D`** |
| USD pricing | **PHP (₱) by default** with USD switcher |
| Generic stock photos | **Filipino artisan themed** content + Unsplash |
| US-style auth (basic) | **Philippine address fields** (region, province, city, barangay) |

### 4.2 New Models (Prisma)

```prisma
model WishlistItem { ... }     // buyer saves listings
model Notification { ... }      // bell icon, dropdown
model Conversation { ... }      // buyer ↔ vendor chat
model Message { ... }           // chat content
```

### 4.3 Extended Fields

- `Listing`: `isService`, `bookingDuration`, `stock`, `isFlashSale`, `flashSalePrice`, `flashSaleEnds`
- `User`: `bio`, `avatarUrl`, `location`, `socialLinks` (JSON)

### 4.4 Feature Inventory (20 features)

| # | Feature | Sprint | Why |
|---|---------|--------|-----|
| 1 | Rebrand (colors, fonts, layout, nav, footer) | 0 | Foundation |
| 2 | New homepage (hero, categories, featured, vendor spotlight) | 1 | First impression |
| 3 | Search & filter enhancement (price slider, sort) | 1 | Discovery |
| 4 | Wishlist | 1 | UX expectation |
| 5 | Vendor storefront (public) | 3 | Multi-vendor showcase |
| 6 | Review submission (with star rating) | 4 | Trust |
| 7 | Fulfillment timeline (4-step visual) | 2 | Operational clarity |
| 8 | Buyer order history | 2 | Standard feature |
| 9 | Stripe test mode payment | 2 | Production-ready |
| 10 | Vendor dashboard (revenue chart) | 3 | Seller insights |
| 11 | Admin category management | 4 | Platform control |
| 12 | Notifications bell + dropdown | 5 | Real-time feel |
| 13 | Real-time messaging (buyer ↔ vendor) | 5 | Communication |
| 14 | Booking UI (service listings) | 6 | Differentiator |
| 15 | Multi-currency switcher (PHP/USD) | 7 | International |
| 16 | Multi-language (EN + Tagalog) | 7 | Local + global |
| 17 | Light/dark theme | 7 | Modern UX |
| 18 | Flash sales | 6 | Promotional |
| 19 | Product variants (size/color) | 7 | Flexibility |
| 20 | Social login (Google + Facebook) | 7 | Low friction |

---

## 5. Phased Roadmap

### Sprint 0 — Rebrand & Data (Day 1–2)
**Goal:** Site looks and feels like Likha.
- [ ] `globals.css` — terracotta palette + dark mode vars
- [ ] `layout.tsx` — update metadata, add `ThemeProvider`
- [ ] `nav.tsx` — Likha brand, mobile hamburger, theme toggle, cart badge
- [ ] `footer.tsx` — 4-column footer
- [ ] `prisma/schema.prisma` — add WishlistItem, Notification, Conversation, Message models + extend Listing/User
- [ ] `prisma/seed.ts` — 6 vendors, 7 categories, 30+ products, 3 service listings
- [ ] Run migrations + seed
- [ ] Build verification (no errors, lighthouse smoke test)

### Sprint 1 — Homepage & Discovery (Day 3–4)
**Goal:** Buyers can browse and discover.
- [ ] `page.tsx` (home) — hero, category tiles, featured listings, vendor spotlight, stats
- [ ] `listings/page.tsx` — price slider, sort, responsive grid
- [ ] `listings/[slug]/page.tsx` — image gallery, vendor card
- [ ] `components/wishlist-button.tsx` + server actions
- [ ] `components/recently-viewed.tsx`

### Sprint 2 — Core Shopping (Day 5–6)
**Goal:** Complete purchase flow.
- [ ] `cart/page.tsx` — group by vendor, shipping mock, coupon
- [ ] `checkout/page.tsx` — GCash/Card/COD, PHP address fields
- [ ] `lib/stripe.ts` — Stripe test integration
- [ ] `orders/[id]/page.tsx` — fulfillment timeline
- [ ] `orders/page.tsx` — buyer order history

### Sprint 3 — Vendor Experience (Day 7–9)
**Goal:** Vendors manage their shop.
- [ ] `vendors/[id]/page.tsx` — public storefront
- [ ] `dashboard/page.tsx` — revenue chart
- [ ] `dashboard/listings/page.tsx` — submit for review, edit
- [ ] `dashboard/orders/page.tsx` — fulfillment buttons
- [ ] `dashboard/profile/page.tsx` — store profile editor
- [ ] `listings/create/page.tsx` — category select, image URL

### Sprint 4 — Reviews & Admin (Day 10–11)
**Goal:** Buyers review, admins control.
- [ ] `components/review-form.tsx` + server actions
- [ ] `admin/dashboard/page.tsx` — platform KPIs
- [ ] `admin/categories/page.tsx` — CRUD
- [ ] `admin/listings/page.tsx` — bulk actions
- [ ] `admin/users/page.tsx` — role changer

### Sprint 5 — Messaging & Notifications (Day 12–13)
**Goal:** Buyers and vendors communicate.
- [ ] `messages/page.tsx` — inbox
- [ ] `messages/[id]/page.tsx` — conversation
- [ ] `components/notification-dropdown.tsx` — bell + dropdown
- [ ] Server actions for both

### Sprint 6 — Booking & Flash Sales (Day 14–16)
**Goal:** Services can be booked, deals can be promoted.
- [ ] `components/date-picker.tsx` — react-datepicker
- [ ] `booking/[id]/page.tsx` — booking flow
- [ ] `dashboard/bookings/page.tsx` — calendar view
- [ ] `components/flash-banner.tsx`
- [ ] `admin/flash-sales/page.tsx` — CRUD deals

### Sprint 7 — Polish & Cross-cutting (Day 17–19)
**Goal:** Global-ready, production-quality.
- [ ] Currency switcher
- [ ] Locale switcher (EN + TL)
- [ ] Social login (Google + Facebook)
- [ ] Cloudinary image upload
- [ ] Inventory low-stock alerts
- [ ] Dark mode audit

### Sprint 8 — QA & Deploy (Day 20–21)
- [ ] SEO (meta, sitemap, JSON-LD)
- [ ] Lighthouse >90
- [ ] Playwright E2E tests
- [ ] Vercel + Neon deploy
- [ ] Demo mode env

---

## 6. File Inventory

### Modified (~20)
```
prisma/schema.prisma
prisma/seed.ts
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/listings/page.tsx
src/app/listings/[slug]/page.tsx
src/app/listings/create/page.tsx
src/app/cart/page.tsx
src/app/checkout/page.tsx
src/app/orders/[id]/page.tsx
src/app/dashboard/page.tsx
src/app/dashboard/listings/page.tsx
src/app/dashboard/orders/page.tsx
src/app/admin/listings/page.tsx
src/app/admin/users/page.tsx
src/components/nav.tsx
src/lib/actions/orders.ts
src/lib/store/cart.ts
src/lib/analytics.ts
```

### Created (~30)
```
src/app/about/page.tsx
src/app/booking/[id]/page.tsx
src/app/messages/page.tsx
src/app/messages/[id]/page.tsx
src/app/orders/page.tsx
src/app/vendors/[id]/page.tsx
src/app/wishlist/page.tsx
src/app/admin/categories/page.tsx
src/app/admin/dashboard/page.tsx
src/app/admin/flash-sales/page.tsx
src/app/dashboard/bookings/page.tsx
src/app/dashboard/profile/page.tsx
src/components/currency-switcher.tsx
src/components/flash-banner.tsx
src/components/footer.tsx
src/components/fulfillment-timeline.tsx
src/components/locale-switcher.tsx
src/components/mobile-nav.tsx
src/components/notification-dropdown.tsx
src/components/recently-viewed.tsx
src/components/review-form.tsx
src/components/vendor-card.tsx
src/components/wishlist-button.tsx
src/lib/actions/booking.ts
src/lib/actions/categories.ts
src/lib/actions/flash-sales.ts
src/lib/actions/inventory.ts
src/lib/actions/messages.ts
src/lib/actions/notifications.ts
src/lib/actions/reviews.ts
src/lib/actions/wishlist.ts
src/lib/cloudinary.ts
src/lib/currency.ts
src/lib/i18n.ts
src/lib/stripe.ts
src/messages/en.json
src/messages/tl.json
```

---

## 7. Tracking

- **Status board**: see `docs/CHECKLIST.md`
- **Per-sprint detail**: `docs/SPRINT_*.md` (one file per sprint as we progress)
- **Architecture decisions**: `docs/ARCHITECTURE.md`
- **Brand reference**: `docs/BRAND.md`
- **API reference**: `docs/API.md`
- **Seed data spec**: `docs/SEED.md`

---

## 8. Non-Goals (Out of Scope for This Demo)

To keep the demo focused and shippable, these are explicitly deferred:

- Real payment processing (we'll use Stripe test mode but no live keys)
- Real email sending (we'll log to console or save to Notification table)
- File storage for real images (we'll use Cloudinary unsigned uploads with a free tier; for seed data, Unsplash URLs)
- Production-grade search (Postgres full-text or Meilisearch) — we'll use simple `contains` queries
- Real-time messaging (WebSocket) — we'll use polling or just paginated refresh
- Tax calculations
- Shipping rate calculation — we'll use flat rates
- i18n beyond English + Tagalog
- Refund workflow (we'll show the state in DB but not build a UI)
- Mobile app / native PWA installation prompts
- Anything requiring actual external services beyond Cloudinary/Stripe test mode
