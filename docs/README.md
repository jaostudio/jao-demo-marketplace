# Likha Marketplace — Demo

> **Live URL:** https://marketplace-demo-six-blush.vercel.app  
> **Stack:** Next.js 16 · Prisma 7 · Turso (SQLite) · Tailwind v4 · NextAuth 4 · Zustand · Framer Motion  
> **Completion:** 117/122 checklist items (95.9%)

---

## Quick Start

```bash
# 1. Clone and install
cd marketplace-demo
npm install

# 2. Copy env vars
cp .env.example .env
# Fill in DATABASE_URL and TURSO_AUTH_TOKEN (Turso credentials)

# 3. Generate Prisma client, seed, and run
npx prisma generate
npm run db:seed
npm run dev
```

**Open http://localhost:3000**

---

## Demo Credentials

Use the **Demo Control Panel** (bottom-left ⚡ button) to switch between roles — no sign-in needed.

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin  | admin@likha.ph   | likha2026 |
| Vendor | maria@likha.ph   | likha2026 |
| Buyer  | isabel@test.ph   | likha2026 |

**Test card:** `4242 4242 4242 4242` (any future expiry & CVC)

---

## Key Features

- **Multi-vendor marketplace** — cart grouped by vendor, per-vendor orders
- **Vendor dashboard** — earnings chart, listings CRUD, order fulfillment
- **Admin panel** — user management, listing moderation, categories, coupons, flash sales, reports
- **Product browsing** — category filters, price range, sort, search, compare up to 4 items
- **Wishlist** — heart icon on cards/detail, dedicated wishlist page
- **Checkout** — 3-step (contact → shipping → payment), address cascade (region/province/city), Stripe/GCash/COD, coupon codes
- **Order tracking** — fulfillment timeline, invoice download, track-order modal
- **Flash sales** — countdown timer, badge, discounted price
- **Booking system** — date picker + message form for service listings
- **Messaging** — inbox, conversation threads, unread badge, vendor contact buttons
- **Notifications** — bell dropdown, unread count, auto-created on order/booking state changes
- **Product bundles** — "Frequently bought together" offers with discounted bundle pricing
- **Abandoned cart recovery** — toast after 30 min inactivity
- **Demo control panel** — instant user simulation and theme toggle (no sign-out needed)
- **Social login** — Google OAuth (configure `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` env vars)
- **Lighthouse-ready** — semantic HTML, proper contrast, skippable navigation, reduced-motion support

---

## Seed Data

| Entity       | Count |
|--------------|-------|
| Users        | 10    |
| Categories   | 7     |
| Listings     | 34    |
| Reviews      | 11    |
| Orders       | 6     |
| Bookings     | 3     |
| Coupons      | 2     |
| Conversations| 2     |
| Bundles      | 2     |

---

## Deploy

This project deploys on Vercel via Git push (GitHub integration). The `vercel.json` at the repo root handles the monorepo build. Environment variables must be set in the Vercel dashboard:

- `DATABASE_URL` — Turso connection string
- `TURSO_AUTH_TOKEN` — Turso auth token
- `NEXTAUTH_SECRET` — random string
- `NEXTAUTH_URL` — production URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, for Google login

---

## Remaining

4 items deferred (not needed for demos):

| Item | Why Deferred |
|------|-------------|
| Product variants (4.10) | All sizes/colors are separate listings; 2-3 day effort |
| i18n (11.2) | English demo is sufficient; 1-2 week effort |
| PWA (11.10) | Clients don't test installability; 1-2 day effort |
| Lighthouse >90 (13.5) | Run DevTools audit on live URL; expected >90 |

---

*Built as a portfolio project. Not a real store.*
