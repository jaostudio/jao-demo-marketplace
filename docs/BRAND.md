# Likha Brand Guide

> Last updated: Sprint 0

---

## 1. Name & Voice

| | |
|---|---|
| **Name** | Likha |
| **Pronunciation** | "Lick-ha" (rhymes with "sticker") |
| **Meaning** | Filipino/Tagalog: "to create" / "a creation" / "handmade" |
| **Tagline** | Discover Filipino Craft |
| **Sub-tagline** | Authentic artisanal goods, straight from the islands |
| **Personality** | Warm, artisan, trusted, proudly local, modern-traditional balance |
| **Voice** | Friendly, knowledgeable, never corporate. Speaks to buyers like a friend who knows the makers. |
| **Avoid** | "Cheap", "discount", "clearance", hype-y language, emoji overload |

### Voice examples

**Good:**
- "Handwoven by Maria's family in Baguio for three generations."
- "This week's spotlight: ceramic ware from Taal."
- "Free shipping on orders over ₱1,500."

**Avoid:**
- "🔥 HOT DEALS 🔥"
- "Mega sale!! Don't miss out!!"
- "Cheap stuff from the Philippines"

---

## 2. Color Palette

### Primary palette (light mode)

| Token | Hex | Tailwind class | Usage |
|-------|-----|----------------|-------|
| `primary-50` | `#FBF1EA` | `bg-primary-50` | Tinted backgrounds, hover states |
| `primary-100` | `#F5DCC8` | `bg-primary-100` | Subtle highlights |
| `primary-200` | `#EDB98E` | `bg-primary-200` | Decorative |
| `primary-300` | `#E29761` | `bg-primary-300` | Mid-tone |
| `primary-400` | `#D17D43` | `bg-primary-400` | Mid-tone |
| `primary-500` | `#C2693D` | `bg-primary-500` | **Brand primary** |
| `primary-600` | `#A4512D` | `bg-primary-600` | **Hover** |
| `primary-700` | `#824025` | `bg-primary-700` | Active/pressed |
| `primary-800` | `#5F2F1C` | `bg-primary-800` | Dark text on light bg |
| `primary-900` | `#3D1F13` | `bg-primary-900` | Headings on light bg |

### Secondary palette

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-50` | `#FBF4E5` | Tinted background |
| `secondary-100` | `#F5E2B5` | Highlights |
| `secondary-200` | `#EBC985` | Decorative |
| `secondary-300` | `#E1B25B` | Mid-tone |
| `secondary-400` | `#DDA848` | Mid-tone |
| `secondary-500` | `#D4A352` | **Ochre gold** — sale tags, badges |
| `secondary-600` | `#B58A3D` | Hover |
| `secondary-700` | `#8C6A2E` | Active |

### Accent palette

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-50` | `#E8F1ED` | Tinted background |
| `accent-100` | `#C4DCCF` | Highlights |
| `accent-500` | `#2D6A4F` | **Deep green** — success, eco |
| `accent-600` | `#245840` | Hover |
| `accent-700` | `#1B4332` | Active |

### Neutral palette (warm-tinted, NOT pure gray)

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#FDF8F2` | **Page background (light)** |
| `neutral-100` | `#F5EFE6` | Card backgrounds, subtle separation |
| `neutral-200` | `#E8DFD1` | Borders |
| `neutral-300` | `#D2C5B0` | Disabled |
| `neutral-400` | `#A89B85` | Tertiary text |
| `neutral-500` | `#6B5E52` | **Body text on light** |
| `neutral-600` | `#4A4137` | Stronger body text |
| `neutral-700` | `#3A322A` | Headings |
| `neutral-800` | `#2C241B` | **Body text (light) — high emphasis** |
| `neutral-900` | `#1A140E` | **Body text (dark mode) — high emphasis** |
| `neutral-950` | `#0D0A07` | Page background (dark) |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#2D6A4F` (= accent-500) | Confirmed, paid, success messages |
| `warning` | `#D4A352` (= secondary-500) | Pending, awaiting review |
| `error` | `#C2472A` | Errors, destructive actions, reject states |
| `info` | `#4A6FA5` | Informational, neutral notifications |

### Status colors (for state machine badges)

| Status | Light bg | Light text | Dark bg | Dark text |
|--------|----------|------------|---------|-----------|
| DRAFT | `bg-neutral-100` | `text-neutral-700` | `bg-neutral-800` | `text-neutral-300` |
| PENDING_REVIEW | `bg-secondary-100` | `text-secondary-700` | `bg-secondary-900/30` | `text-secondary-300` |
| APPROVED | `bg-accent-100` | `text-accent-700` | `bg-accent-900/30` | `text-accent-300` |
| REJECTED | `bg-red-100` | `text-red-700` | `bg-red-900/30` | `text-red-400` |
| SOLD | `bg-primary-100` | `text-primary-700` | `bg-primary-900/30` | `text-primary-300` |
| ARCHIVED | `bg-neutral-200` | `text-neutral-600` | `bg-neutral-800` | `text-neutral-500` |
| PENDING_PAYMENT | `bg-secondary-100` | `text-secondary-700` | `bg-secondary-900/30` | `text-secondary-300` |
| PAID | `bg-accent-100` | `text-accent-700` | `bg-accent-900/30` | `text-accent-300` |
| UNFULFILLED | `bg-neutral-100` | `text-neutral-700` | `bg-neutral-800` | `text-neutral-300` |
| PROCESSING | `bg-blue-100` | `text-blue-700` | `bg-blue-900/30` | `text-blue-300` |
| FULFILLED | `bg-accent-100` | `text-accent-700` | `bg-accent-900/30` | `text-accent-300` |
| RETURNED | `bg-red-100` | `text-red-700` | `bg-red-900/30` | `text-red-400` |

---

## 3. Typography

### Font families

| Use | Family | Weights |
|-----|--------|---------|
| Sans (UI, body, headings) | **Inter** | 400, 500, 600, 700, 800 |
| Display (hero, vendor names) | **Playfair Display** | 400 (italic), 600, 700 |
| Mono (order numbers, code) | **JetBrains Mono** | 400, 500 |

### Type scale

| Token | Size (px) | Tailwind | Use case |
|-------|-----------|----------|----------|
| `text-xs` | 12 | `text-xs` | Helper text, badges |
| `text-sm` | 14 | `text-sm` | Body small, captions |
| `text-base` | 16 | `text-base` | Body default |
| `text-lg` | 20 | `text-lg` | Lead paragraphs |
| `text-xl` | 24 | `text-xl` | Card titles |
| `text-2xl` | 32 | `text-2xl` | Section headers |
| `text-3xl` | 40 | `text-3xl` | Page titles |
| `text-4xl` | 48 | `text-4xl` | Hero sub |
| `text-5xl` | 64 | `text-5xl` | Hero title |
| `text-6xl` | 80 | `text-6xl` | Display (rare) |

### Line heights

- Body: `leading-relaxed` (1.625)
- Headings: `leading-tight` (1.2)
- Display: `leading-none` (1.0)

### Letter spacing

- Hero: `tracking-tight` (-0.02em)
- Display (Playfair): default
- Body: default
- All-caps labels: `tracking-wider` (0.05em)

---

## 4. Spacing & Sizing

- **Container**: `max-w-7xl` (1280px) on desktop, full width on mobile with `px-4`
- **Section padding**: `py-16` (64px) on desktop, `py-10` (40px) on mobile
- **Card padding**: `p-6` (24px) standard
- **Grid gap**: `gap-6` (24px) on cards
- **Border radius**:
  - `rounded-lg` (8px) — small elements
  - `rounded-xl` (12px) — buttons, inputs
  - `rounded-2xl` (16px) — cards
  - `rounded-3xl` (24px) — large hero cards
  - `rounded-full` — pills, badges, avatars

---

## 5. Shadow system

```
shadow-sm    — subtle, for resting cards
shadow-md    — default, for raised cards on hover
shadow-lg    — modal, dropdown
shadow-xl    — popover, floating notifications
shadow-2xl   — modal overlay
```

Warm-tinted shadows (use rgba with terracotta hint):
```
--shadow-warm-sm: 0 1px 2px 0 rgba(194, 105, 61, 0.05)
--shadow-warm-md: 0 4px 6px -1px rgba(194, 105, 61, 0.1), 0 2px 4px -1px rgba(194, 105, 61, 0.06)
--shadow-warm-lg: 0 10px 15px -3px rgba(194, 105, 61, 0.1), 0 4px 6px -2px rgba(194, 105, 61, 0.05)
```

---

## 6. Imagery

### Style
- **Warm, natural lighting** — never studio, never stock-photo-perfect
- **Hands at work** — close-ups of artisan process
- **Materials in context** — clay on a wheel, weaving loom, drying fabrics
- **Filipino settings** — workshops with capiz windows, bamboo, natural materials
- **People of the Philippines** — diverse, working, not posed

### Sources
- **Unsplash** for seed data (search "basketry", "weaving", "pottery wheel", "carving", "tropical workshop")
- **Cloudinary** for user uploads (in production with real vendors)
- Fallback: gradient placeholder with first letter of title in primary-100 bg

### Caption style
- Lower-case, italic, on light or dark tint
- "Kalinga weaver, Baguio"
- "Burnay pottery, Taal, Batangas"

---

## 7. Iconography

- **lucide-react** for UI icons (already a dependency)
- Outline style (24×24px default)
- Stroke width: 2 (lucide default)
- Color: inherit from context (text-current)

### Custom symbols (Filipino motifs)
- **Sun** (8-ray) — for "fresh" / "featured" badges
- **Wave** (3-line) — for "shipping from coastal areas"
- **Leaf** — for "natural materials"
- **Coconut** — for "island-made"
- **Banana leaf** — for "sustainable packaging"

Implement as inline SVG components in `src/components/icons/`.

---

## 8. Tone & Microcopy

### Buttons
- ✅ "Add to Cart", "Place Order", "Submit for Review", "Message Maker"
- ❌ "Buy Now!!!", "Submit", "OK", "Send"

### Empty states
- ✅ "No saved items yet. Browse the catalog to start your wishlist."
- ❌ "Empty", "No items", "Nothing here"

### Errors
- ✅ "We couldn't process your payment. Please check your card details."
- ❌ "Error 400", "Bad request", "Something went wrong"

### Success
- ✅ "Order placed! Track it in your order history."
- ❌ "Success", "OK"

### Loading
- ✅ "Adding to cart…", "Processing payment…", "Sending message…"
- ❌ "Loading…", "Please wait…"

---

## 9. Accessibility

- **Color contrast**: WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- **Focus rings**: 2px terracotta outline with 2px offset on all interactive elements
- **Skip link**: "Skip to main content" at the top of every page
- **Alt text**: required for all product images; describe the product, not "image of product"
- **Keyboard navigation**: full tab order, ESC closes modals, arrow keys navigate menus
- **Screen reader**: ARIA labels on icon-only buttons ("Add to wishlist", "Open cart")

---

## 10. Don'ts

- ❌ Don't use pure black (`#000`) or pure white (`#FFF`) for text/backgrounds. Use `neutral-900` and `neutral-50` instead.
- ❌ Don't use Tailwind's default green/blue/indigo as primary brand colors.
- ❌ Don't use emoji as functional icons (✅ for "yes" button, etc.) — they can be decorative only.
- ❌ Don't center-align body text longer than 2 lines.
- ❌ Don't use italic for emphasis on body text — use weight (semibold) instead.
- ❌ Don't use more than 2 typefaces in a single component.
- ❌ Don't use red/green color pairings for status (color-blind users can't distinguish). Always include an icon or text.
