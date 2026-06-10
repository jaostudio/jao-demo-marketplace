# Sprint 0 — Rebrand & Data

> **Status:** Ready for review
> **Goal:** Site looks and feels like Likha. Schema extended. Seed data populated.
> **Estimated work:** ~25 file changes, 0 new features visible to users (purely rebrand + data)
> **Risk:** Low (mostly cosmetic + schema additions)

---

## What This Sprint Does

1. Adds new Prisma models (WishlistItem, Notification, Conversation, Message)
2. Extends `Listing` and `User` with new optional fields
3. Replaces the green palette with terracotta
4. Adds `next-themes` for light/dark mode
5. Rewrites the nav with Likha branding + mobile hamburger
6. Adds a 4-column footer
7. Rewrites `seed.ts` with 6 vendors, 33 listings, full Filipino data
8. Adds auth helper functions

**Net result after Sprint 0:** Same routes, same flows — but the visual identity is Likha, the data is Filipino, and the database can support all features we plan to build.

---

## File-by-File Changes

### A. Schema (`prisma/schema.prisma`)

**Add 4 new models, extend 2 existing ones.** No destructive changes.

```prisma
// EXTEND existing User
model User {
  // ... existing fields ...
  bio           String?
  avatarUrl     String?
  location      String?
  socialLinks   Json?

  // NEW relations
  wishlist         WishlistItem[]
  notifications    Notification[]
  conversationsA   Conversation[] @relation("ConvA")
  conversationsB   Conversation[] @relation("ConvB")
  messagesSent     Message[]
}

// EXTEND existing Listing
model Listing {
  // ... existing fields ...
  isService        Boolean   @default(false)
  bookingDuration  Int?      // minutes
  stock            Int       @default(1)
  isFlashSale      Boolean   @default(false)
  flashSalePrice   Int?      // cents
  flashSaleEnds    DateTime?

  // NEW relation
  wishlist WishlistItem[]
}

// EXTEND existing Category
model Category {
  // ... existing fields ...
  icon      String?   // lucide icon name
  coverUrl  String?   // hero tile image
}

// NEW models
model WishlistItem { ... }
model Notification  { ... }
model Conversation  { ... }
model Message       { ... }
```

**Full schema content** is in `docs/ARCHITECTURE.md` section 3.

**Run:** `npx prisma db push` (dev DB)

---

### B. Styling (`src/app/globals.css`)

Replace the green palette with terracotta. Add dark mode support. Add Inter + Playfair Display.

**Current state (line 1-16):**
```css
@import "tailwindcss";
@source "../../packages/ui/src/**/*.tsx";
@theme { --color-brand-50 to --color-brand-900: green scale }
```

**New state (~80 lines):**
- `@import "tailwindcss"`
- `@source` line kept
- `@theme` block: all color tokens from `docs/BRAND.md` section 2
- `:root` block: light mode default (primary, secondary, accent, neutral, semantic)
- `.dark` block: dark mode overrides
- `@layer base`: dark-mode body bg/text
- Custom utilities for shadows

**No animations, no JS — pure CSS.**

---

### C. Layout (`src/app/layout.tsx`)

**Add:**
- `next-themes` `ThemeProvider` wrapping the app
- Playfair Display font import
- Updated metadata (title, description, OG)
- `attribute="class"` on ThemeProvider for Tailwind dark mode

**Current (line 1-28):**
```tsx
<html lang="en">
  <body className="...bg-white text-neutral-900...">
    <AuthProvider>
      <Nav />
      {children}
    </AuthProvider>
  </body>
</html>
```

**New (~40 lines):**
```tsx
<html lang="en" suppressHydrationWarning>
  <body className="...bg-neutral-50 text-neutral-800...">
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Nav />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  </body>
</html>
```

**Install:** `npm install next-themes`

---

### D. Nav (`src/components/nav.tsx`) — REWRITE

**Current:** Hardcoded "Marketplace" brand, no mobile menu, no theme toggle, basic cart icon.

**New (~150 lines):**
- Brand: "Likha" with leaf icon (lucide `leaf` in primary-500)
- Sticky header, blurred backdrop (existing pattern)
- Desktop nav links: Browse / Sell (VENDOR only) / Wishlist (BUYER only) / Cart icon with badge
- Theme toggle: sun/moon icon button
- Auth state: Sign in (logged out) / User dropdown (logged in)
- Mobile: Hamburger button → opens `MobileNav` slide-out drawer
- Cart badge shows item count from Zustand store

**Files affected:**
- `src/components/nav.tsx` (rewrite)
- `src/components/mobile-nav.tsx` (NEW, ~100 lines)

---

### E. Footer (`src/components/footer.tsx`) — NEW

**Layout:** 4-column grid on desktop, stacked on mobile.

| Column | Links |
|--------|-------|
| **About** | About Likha, Our Makers, Press, Careers |
| **Browse** | All Categories, Featured, New Arrivals, Sale |
| **Support** | Help Center, Shipping, Returns, Contact |
| **Legal** | Privacy, Terms, Cookies |

Below: brand line, social icons (Facebook, Instagram, TikTok), copyright.

**File:** `src/components/footer.tsx` (~100 lines)

---

### F. Auth Helpers (`src/lib/auth.ts`)

**Add** (don't replace) at the bottom of the existing file:

```ts
export async function requireUser() { ... }
export async function requireRole(role: UserRole | UserRole[]) { ... }
export async function requireVendor() { return requireRole('VENDOR') }
export async function requireAdmin() { return requireRole('ADMIN') }
```

These will be used by every protected action in future sprints.

**File:** `src/lib/auth.ts` (extend, ~30 lines added)

---

### G. Seed Data (`prisma/seed.ts`) — REWRITE

**Current:** 4 users, 5 categories, 10 listings, 2 reviews, generic artisan names.

**New:** Full Filipino data per `docs/SEED.md`:

```
👥 Users: 10 (6 vendors, 1 admin, 3 buyers)
📂 Categories: 7 (with icon + cover image)
📦 Listings: 33 (30 products, 3 services)
🖼️  Listing Images: ~120 (avg 4 per listing)
⭐ Reviews: 8
🛒 Orders: 4 (in different states)
📅 Bookings: 3 (in different states)
🔔 Notifications: 4
❤️ Wishlist Items: 5
💬 Conversations: 2 (with messages)
```

**File:** `prisma/seed.ts` (rewrite, ~500 lines, well-structured with helper functions)

**Avatar URLs:** Use DiceBear API for consistent avatars (e.g., `https://api.dicebear.com/7.x/notionists/svg?seed=maria-santos`).

**Image URLs:** Curated Unsplash search URLs. Real IDs to be added in seed file.

---

### H. Documentation (`docs/`)

All docs already written. Verify they render correctly.

---

## What This Sprint Does NOT Do

- ❌ No new routes created
- ❌ No new server actions
- ❌ No new UI pages
- ❌ No payment integration
- ❌ No wishlist functionality (button comes in Sprint 1)
- ❌ No cart changes
- ❌ No checkout changes

The cart icon in the new nav will link to `/cart` (existing), which is unchanged.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Prisma push breaks existing data | Low | High | SQLite dev DB, no production data. Re-seed if needed. |
| `next-themes` causes hydration mismatch | Medium | Medium | Use `suppressHydrationWarning`, follow `next-themes` docs |
| Color tokens break existing buttons | Medium | Low | All existing buttons use `bg-neutral-900` which we keep. |
| Seed takes long to run | Low | Low | Use `upsert` patterns, batched creates. |
| New mobile nav breaks existing pages | Low | Low | Mobile nav is a new component, not modifying pages. |

---

## Verification Checklist (before I start)

**Schema:**
- [ ] `prisma db push` succeeds
- [ ] `prisma generate` succeeds
- [ ] Existing pages still load

**Visual:**
- [ ] Visit `/` — see "Likha" brand, terracotta primary, footer
- [ ] Visit `/listings` — see terracotta-tinted category chips
- [ ] Visit `/dashboard` (as vendor) — see new nav layout
- [ ] Mobile viewport (< 640px) — see hamburger button, slide-out works
- [ ] Dark mode toggle — all colors invert properly
- [ ] Footer renders on every page

**Functional:**
- [ ] Sign in as `maria@likha.ph` / `likha2026` — works
- [ ] Sign in as `admin@likha.ph` / `likha2026` — works
- [ ] Sign in as `isabel@test.ph` / `likha2026` — works
- [ ] Browse listings — see Filipino product names
- [ ] Add to cart — cart badge updates
- [ ] Theme toggle persists across refresh
- [ ] No console errors
- [ ] No TypeScript errors (`npm run build` passes)

---

## Manual Test Plan (After Implementation)

```
1. npm install next-themes
2. npx prisma db push
3. npx prisma generate
4. npm run db:reset
5. npm run dev
6. Open http://localhost:3000
7. Visual check homepage — Likha brand
8. Resize to mobile — see hamburger
9. Toggle theme — see dark mode
10. Sign in as maria@likha.ph / likha2026
11. Browse /listings — see Filipino products
12. Sign out, sign in as isabel@test.ph
13. /orders — see seeded order
14. Sign out, sign in as admin
15. /admin/listings — see all listings in different states
```

---

## Out of Scope (Future Sprints)

- Homepage redesign → **Sprint 1**
- Wishlist button → **Sprint 1**
- New vendor storefront → **Sprint 3**
- Admin panel improvements → **Sprint 4**
- Booking UI → **Sprint 6**
- Multi-currency → **Sprint 7**
- Social login → **Sprint 7**

---

## Decision Points (please confirm before I start)

### 1. Avatar source
**Option A:** DiceBear (free, no signup, deterministic)
- URL: `https://api.dicebear.com/7.x/notionists/svg?seed=maria-santos`
- Pro: No API key, infinite unique avatars
- Con: SVG only, looks illustrated

**Option B:** UI Avatars (free, no signup, initials-based)
- URL: `https://ui-avatars.com/api/?name=Maria+Santos&background=C2693D&color=fff`
- Pro: Customizable colors
- Con: Initials, not character art

**My recommendation:** DiceBear with `notionists` style for character avatars + UI Avatars as fallback.

### 2. Brand logo treatment
For Sprint 0, I'll use the text "Likha" in Inter Bold with a `leaf` icon. No custom SVG logo.

Future sprint could add a proper SVG logo. OK?

### 3. Dark mode default
**Option A:** System preference (auto-detects)
**Option B:** Always light
**Option C:** Always dark

**My recommendation:** System preference. Most modern apps do this.

### 4. Navbar behavior
Sticky on scroll, with backdrop blur, on all viewports. OK?

### 5. Footer links
The 4 columns above are my proposal. Want to add/remove anything?

---

## Estimated Timeline

- Schema changes + push: 30 min
- globals.css rewrite: 30 min
- layout.tsx: 20 min
- nav.tsx rewrite: 1 hour
- mobile-nav.tsx: 1 hour
- footer.tsx: 30 min
- auth helpers: 15 min
- seed.ts rewrite: 2 hours
- Verification + fixes: 1 hour

**Total: ~7 hours of focused work**

---

**Ready to start?** Confirm the 5 decision points above and I'll begin implementation.
