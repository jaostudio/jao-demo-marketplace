# Likha Marketplace — Client Demo Script

> **Live URL:** https://marketplace-demo-six-blush.vercel.app  
> **Duration:** ~20 minutes  
> **Roles:** Admin, Vendor (Maria Santos), Buyer (Isabel)

---

## Before You Start

1. Open the live URL in a **clean browser** (Chrome incognito or a fresh profile).
2. Confirm the **Demo Mode banner** is visible at the top:
   > "Demo Mode — No real charges. Use test card 4242 4242 4242 4242."
3. Keep the **Demo Control Panel** handy (bottom-left "⚡ Demo" badge).

---

## Flow 1: Buyer Journey (8 min)

### 1.1 Landing on the Homepage

**Narrator:** *"Imagine you're looking for unique Filipino gifts. Let's walk through the experience."*

- Point out the **hero section** — headline, subhead, two CTAs.
- Scroll down: **Shop by Craft** — 7 category tiles with hover zoom.
- **Featured crafts** — 8 hand-picked products, each showing image, vendor avatar, title, price.
- **Meet the Makers** — vendor carousel (drag on mobile, arrows on desktop).
- **Stats counter** — scroll-triggered animation.
- **Newsletter CTA** — email input (mock).

### 1.2 Browsing & Filtering

- Navigate to **Browse Crafts** (`/listings`).
- Click **Art & Prints** category filter. Note the URL updates to `?category=art-prints`.
- Click filter badge to remove it.
- Open **Filters** (left sidebar on desktop, toggle on mobile):
  - Set **Min price** to ₱200, **Max price** to ₱1,000.
  - Click **Apply filters**. Note the URL params and active filter pills.
  - **Clear all** to reset.
- Change **Sort** to "Price: low to high" — products reorder.
- **Search** for "coffee" — results filter in real time.

### 1.3 Product Detail

- Click **Banaue Rice Terraces Photo Print** (₱8,500).
- **Narrator:** *"This is a limited-edition archival print. You can see the full description, stock indicator ('20 in stock'), and vendor details."*
- Scroll to **You may also like** — 4 recommendations from the same category.
- Click the **heart icon** to wishlist — bounce animation. (If not signed in, redirects to sign-in.)

### 1.4 Sign In

- Navigate to **Sign In** (`/auth/signin`).
- Enter credentials (or use Demo Panel — see section 4):
  - **Email:** `isabel@test.ph`
  - **Password:** `likha2026`
- Click **Sign In**.
- Note the redirect back to where you were, now with "Hi, Isabel" in the nav.

### 1.5 Cart & Coupon

- Add **Banaue Rice Terraces Print** to cart (click "Add to Cart").
- Add **Pampanga Buko Pie** (₱580) from another vendor.
- Open the **Cart** page (`/cart`).
- Point out: **Grouped by vendor** (Lorna Garcia items, Chef Andres items).
- Change quantity for buko pie from 1 to 2.
- On the right sidebar:
  - **Subtotal:** 9,660
  - **Shipping:** 200 (per vendor — total ~400)
  - **Coupon:** Enter `LIKHA10` → click **Apply** → 10% off appears.
  - **Total** updates to show discount.

### 1.6 Checkout

- Click **Proceed to Checkout**.
- **Step 1 — Contact:** Email is pre-filled. Click Continue.
- **Step 2 — Shipping:**
  - Name, Phone number fields.
  - **Region** dropdown → select a region → **Province** cascade populates.
  - Continue to **City/Municipality** then **Barangay**.
  - Street address, ZIP code. Click Continue.
  - **Shipping method** per vendor — Standard (₱100) or Express (₱250).
- **Step 3 — Payment:**
  - **Three options:** Card, GCash, COD.
  - Select **Card** → Stripe iframe loads — enter `4242 4242 4242 4242`, any future expiry, any CVC.
  - (Optional) Show GCash — static QR code with reference number field.
  - (Optional) Show COD — simplest option.
- Click **Place Order**.
- **Narrator:** *"Because there are two vendors, the system creates two separate orders — one for Lorna Garcia and one for Chef Andres."*
- Note the confirmation page with both order numbers (`LIKHA-005`, `LIKHA-006`).

### 1.7 Order Tracking

- Navigate to **My Orders** (`/orders`).
- Click one of the new orders.
- Show:
  - Order items, vendor, shipping address, payment method.
  - **Fulfillment timeline** — 4 steps (Placed → Paid → Shipped → Delivered) with current step highlighted.
  - **Invoice download** — click "Download Invoice" → opens a data-URI HTML invoice styled with the Likha brand.
  - **Track Order** — modal with simulated courier steps.

---

## Flow 2: Vendor Journey (6 min)

### 2.1 Switch to Vendor

**Two ways:**

1. **Sign out**, then sign in as `maria@likha.ph` / `likha2026`.
2. **Easier — use the Demo Panel** (see section 4): Select **"Maria (Vendor)"** from the dropdown. Page reloads.

### 2.2 Vendor Dashboard

- Navigate to **Dashboard** (`/dashboard`).
- **Narrator:** *"This is Maria's command center. She can see at a glance:"*
  - **Total Revenue** — ₱XX,XXX
  - **Total Orders** — X orders
  - **Active Listings** — 6 pieces
  - **Average Rating** — X.X stars
  - **Revenue chart** — last 30 days (mock data, animated).
- Point out the sidebar with: Overview, Listings, Orders, Profile.

### 2.3 Manage Listings

- Go to **Dashboard → Listings** (`/dashboard/listings`).
- Table shows: Title, Category, Price, Stock, Status, Actions.
- Click **Edit** on "Cordillera Shoulder Bag" — pre-filled form opens.
- Change price from ₱980 to ₱1,050. Click **Update**.
- Click the **Create Listing** button:
  - Title: "Ikat Dye Pillow Cover"
  - Category: Home & Decor
  - Price: ₱750
  - Stock: 15
  - Image URL (use any from Unsplash or reuse an existing one)
  - Description: "Hand-dyed ikot pillow cover..."
  - Click **Create** → status starts at PENDING_REVIEW.
- **Narrator:** *"New listings go through moderation — the admin approves them before they're visible."*

### 2.4 Fulfill Orders

- Go to **Dashboard → Orders** (`/dashboard/orders`).
- See incoming orders for Maria's products.
- Click **Process** on an UNFULFILLED order → status changes to PROCESSING.
- Then click **Mark Shipped** → changes to FULFILLED.
- **Narrator:** *"The buyer sees these status changes update in real time on their end."*

### 2.5 Profile Editor

- Go to **Dashboard → Profile** (`/dashboard/profile`).
- Show editable fields: Name, Bio, Location, Avatar URL, Cover Image URL, Social links.
- **Narrator:** *"This is how Maria customizes her public storefront."*

---

## Flow 3: Admin Journey (5 min)

### 3.1 Switch to Admin

Use the **Demo Panel** → toggle **Admin Mode ON** and select "None" from the dropdown → page reloads with admin nav visible.

Alternatively: sign in directly as `admin@likha.ph` / `likha2026`.

### 3.2 Admin Dashboard

- Navigate to **Admin** (`/admin`).
- **Narrator:** *"The platform owner sees cross-cutting KPIs:"*
  - Total users, vendors, orders, revenue.
  - Recent orders and user activity.

### 3.3 User Management

- Go to **Admin → Users** (`/admin/users`).
- Table: Name, Email, Role, Status, Joined, Actions.
- Change a buyer to VENDOR — click dropdown, select "VENDOR" → confirm.
- **Suspend** a user — click the suspend toggle → user is suspended.
- **Narrator:** *"Suspended users can't log in or transact."*

### 3.4 Listing Moderation

- Go to **Admin → Listings** (`/admin/listings`).
- Filter by "PENDING_REVIEW" — see the pillow cover Maria just created.
- Click **Approve** — listing is now visible on the storefront.
- (Optional) Click **Reject** — opens a reason dialog.

### 3.5 Category Management

- Go to **Admin → Categories** (`/admin/categories`).
- See 7 categories with cover images.
- Click **Add Category** — name, slug, description, cover image URL.
- Edit or delete existing categories.

### 3.6 Coupon Management

- Go to **Admin → Coupons** (`/admin/coupons`).
- See `LIKHA10` (10% off, 100 uses) and `WELCOME` (₱200 off, 50 uses).
- **Create a new coupon:**
  - Code: `FREESHIP`
  - Type: PERCENTAGE or FIXED
  - Value: 100 (₱100 flat)
  - Min spend: 500
  - Max uses: 50
  - Expiry: Select a future date.
- Click **Create** — new coupon appears in the list.

### 3.7 Flash Sales

- Go to **Admin → Flash Sales** (`/admin/flash-sales`).
- Create a flash sale:
  - Select a listing (e.g., "Barako Coffee 200g").
  - Discount price: ₱320 (from ₱420).
  - Start: now. End: 24 hours from now.
  - Click **Create**.
- **Narrator:** *"The product now shows a flash sale badge and countdown timer on the homepage and listing page."*

### 3.8 Reports

- Go to **Admin → Reports** (`/admin/reports`).
- Filter by vendor, category, or month.
- Click **Export CSV** — downloads a CSV file with the sales data.

### 3.9 Site Settings

- Go to **Admin → Settings** (`/admin/settings`).
- Edit tagline, contact email, default shipping fee.
- **Narrator:** *"Settings are currently demo-only and not persisted."*

---

## Flow 4: Demo Control Panel (1 min)

The ⚡ **Demo** button at the bottom-left opens the control panel. It has three modes:

| Feature | Action | Effect |
|---------|--------|--------|
| **Admin Mode toggle** | Switch ON | Admin nav links appear; all pages show admin data. |
| **User simulation dropdown** | Select a user | Sets `demo_user_email` cookie; page reloads as that user. |
| **Theme quick switch** | Light/Dark | Instantly toggles between themes (no reload). |

**Available sim users:**

| Name | Email | Role | What to Show |
|------|-------|------|-------------|
| Admin | admin@likha.ph | ADMIN | Full admin panel, user mgmt, moderation |
| Maria (Vendor) | maria@likha.ph | VENDOR | Vendor dashboard, listings, orders |
| Isabel (Buyer) | isabel@test.ph | BUYER | Cart, wishlist, order history |

**Narrator:** *"This eliminates the need to sign out and sign in during demos. Toggle admin mode to see platform controls, select a buyer to place orders, switch to vendor to manage fulfillment — all in seconds."*

---

## Extra Talking Points

- **Technology stack:** Next.js 16, TypeScript, Prisma (Turso/SQLite), NextAuth, Zustand, Tailwind CSS, Framer Motion, Stripe test mode.
- **Demo mode guard:** Real payment flows are blocked in demo mode — the banner and code enforce this.
- **34 listings, 6 orders, 11 reviews, 2 coupons** — enough data to demonstrate every feature without being overwhelming.
- **Dark mode by default** — matches modern site expectations, switchable to light.
- **PHP/USD switcher** — built-in, toggleable from the navbar.
- **Mobile responsive** — navigation adapts to mobile via hamburger menu.
- **Accessible** — skip-to-content link, focus rings, reduced-motion support.
- **Zero compilation errors** — `npm run build` passes cleanly.

---

## Credential Reference

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@likha.ph | likha2026 |
| Vendor | maria@likha.ph | likha2026 |
| Buyer | isabel@test.ph | likha2026 |
| Test card | 4242 4242 4242 4242 | Any future expiry & CVC |

---

## Troubleshooting

- **"Module not found" errors** — ensure `.env` has `DATABASE_URL` and `TURSO_AUTH_TOKEN` from the credentials above.
- **Demo panel not showing** — check `DEMO_MODE=true` in env, restart dev server.
- **Orders not creating** — demo mode guards `createOrder`; the banner and code enforce this.
- **Stripe iframe blank** — Stripe Publishable Key needs to be set in env (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
