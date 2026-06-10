# Likha Seed Data Specification

> Last updated: Sprint 0
> Password for ALL accounts: `likha2026`

---

## 1. Users

### Vendors (6)

| Email | Name | Store Name | Location | Specialty | Bio |
|-------|------|-----------|----------|-----------|-----|
| `maria@likha.ph` | Maria Santos | Likha Weaves | Baguio City, Benguet | Handwoven textiles, blankets | "Third-generation weaver from the Cordilleras. We work with Kalinga and Ifugao master weavers to keep the tradition alive." |
| `juan@likha.ph` | Juan dela Cruz | Taal Pottery | Taal, Batangas | Burnay pottery, kitchenware | "Sixth-generation potter. We throw clay the same way my great-great-grandfather did — by hand, on a kick wheel, fired in a wood kiln." |
| `lorna@likha.ph` | Lorna Garcia | Ilocos Heritage | Vigan, Ilocos Sur | Wood carvings, abel fabric | "We restore heritage homes for a living, and source the abel, narra, and molave that go into them." |
| `rico@likha.ph` | Rico Morales | Davao Gold | Davao City, Davao del Sur | Single-origin coffee, tablea | "My family has been growing cacao on the foothills of Mt. Apo since 1962. We farm-to-bar every batch." |
| `teresa@likha.ph` | Teresa Lim | Cebu Craft | Cebu City, Cebu | Shell crafts, guitars, jewelry | "Cebuano craftswoman specializing in capiz, mother-of-pearl, and sustainably-sourced shells." |
| `andres@likha.ph` | Chef Andres | Pampanga Kitchen | Angeles, Pampanga | Artisan preserves, sweets, tocino | "Kapampangan culinary tradition. We make everything in small batches, the way Lola taught me." |

### Admin (1)

| Email | Name |
|-------|------|
| `admin@likha.ph` | Likha Admin |

### Buyers (3)

| Email | Name | Location | Notes |
|-------|------|----------|-------|
| `isabel@test.ph` | Isabel Reyes | Quezon City, Metro Manila | Test buyer, has prior orders and reviews |
| `paolo@test.ph` | Paolo Cruz | Makati City, Metro Manila | Test buyer, fresh account |
| `liza@test.ph` | Liza Mendoza | Cebu City, Cebu | Test buyer with bookings |

---

## 2. Categories (7)

| Slug | Name | Icon (lucide) | Tagline |
|------|------|---------------|---------|
| `textiles` | Handwoven & Textiles | `shirt` | Kalinga, Ifugao, Abel |
| `pottery` | Pottery & Ceramics | `coffee` | Burnay, terracotta, stoneware |
| `woodcraft` | Woodcraft & Furniture | `tree-deciduous` | Narra, molave, bamboo |
| `food-drink` | Artisan Food & Drinks | `utensils` | Coffee, tablea, preserves |
| `fashion` | Fashion & Accessories | `gem` | Jewelry, bags, weaves |
| `home-decor` | Home & Decor | `lamp` | Capiz, macramé, baskets |
| `art-prints` | Art & Prints | `palette` | Original art, linocuts, photography |

---

## 3. Listings (30 physical products)

Prices in **PHP (₱)**, stored as **cents (×100)** in DB. Example: ₱1,250 = `125000`.

### Maria Santos — Likha Weaves (`vendorId: maria`)

| Title | Slug | Category | Price (₱) | Stock | Description |
|-------|------|----------|-----------|-------|-------------|
| Inabel Blanket (Twin) | `inabel-blanket-twin` | textiles | 3,200 | 5 | "Handwoven in Ilocos Sur using 100% cotton. White and natural indigo. Twin size 60×80 in." |
| Kalinga Wrap Skirt | `kalinga-wrap-skirt` | fashion | 1,850 | 8 | "Traditional wrap skirt in red and black stripes. One size fits most." |
| T'boli T'nalak Cloth (per meter) | `tboli-tnalak-cloth` | textiles | 950 | 12 | "Authentic T'nalak weaved by T'boli dream weavers. Abaca fiber, natural dyes." |
| Ifugao Sungka Board | `ifugao-sungka-board` | home-decor | 1,400 | 4 | "Hand-carved from a single piece of narra wood. Includes shells." |
| Cordillera Shoulder Bag | `cordillera-shoulder-bag` | fashion | 980 | 10 | "Hand-woven strap with leather body. Adjustable length." |

### Juan dela Cruz — Taal Pottery (`vendorId: juan`)

| Title | Slug | Category | Price (₱) | Stock | Description |
|-------|------|----------|-----------|-------|-------------|
| Burnay Clay Jar (25cm) | `burnay-clay-jar` | pottery | 1,800 | 6 | "Traditional palayok jar. Earthy terracotta, food-safe glaze inside. Holds 3L." |
| Mini Pot Trio (set of 3) | `mini-pot-trio` | home-decor | 450 | 15 | "Set of 3 mini clay pots with matching spoons. Perfect for salt, spice, or succulents." |
| Ceramic Pour-Over Set | `ceramic-pour-over` | pottery | 2,200 | 7 | "Hand-thrown ceramic dripper with matching carafe. Holds 4 cups." |
| Tagay Pitcher (Large) | `tagay-pitcher` | pottery | 1,650 | 5 | "Traditional carafe with two ears. For water, juice, or arrack." |
| Terracotta Planter (30cm) | `terracotta-planter-30` | home-decor | 1,100 | 9 | "Wide-mouth planter with drainage hole. Terracotta unglazed." |

### Lorna Garcia — Ilocos Heritage (`vendorId: lorna`)

| Title | Slug | Category | Price (₱) | Stock | Description |
|-------|------|----------|-----------|-------|-------------|
| Narra Salad Bowl | `narra-salad-bowl` | woodcraft | 1,200 | 8 | "Turned from sustainably-sourced narra. 25cm diameter, food-safe oil finish." |
| Vigan Wooden Chair | `vigan-wooden-chair` | woodcraft | 4,500 | 3 | "Hand-crafted in the Vigan tradition. Solid molave. H 90cm × W 45cm × D 45cm." |
| Abel Iloco Table Runner | `abel-iloco-table-runner` | textiles | 1,400 | 10 | "Hand-loomed abel fabric. 30×180 cm. White with subtle weave pattern." |
| Bamboo Tray (set of 2) | `bamboo-tray-set` | home-decor | 680 | 12 | "Round bamboo trays, woven edge. Small + medium." |
| Hardwood Mortar & Pestle | `hardwood-mortar-pestle` | woodcraft | 850 | 11 | "For pounding spices. Heavy molave, will last generations." |

### Rico Morales — Davao Gold (`vendorId: rico`)

| Title | Slug | Category | Price (₱) | Stock | Description |
|-------|------|----------|-----------|-------|-------------|
| Sagada Arabica 250g | `sagada-arabica-250g` | food-drink | 480 | 25 | "Single-origin, medium roast. Notes of dark chocolate, walnut, citrus. Whole bean." |
| Tablea de Cacao (6-pack) | `tablea-de-cacao-6pack` | food-drink | 380 | 30 | "Pure cacao tablets. For tsokolate or baking. 6×30g." |
| Cacao Nibs 100g | `cacao-nibs-100g` | food-drink | 280 | 20 | "Roasted, crushed cacao beans. For toppings, smoothies, baking." |
| Barako Coffee 200g | `barako-coffee-200g` | food-drink | 420 | 18 | "Liberica beans from Batangas. Bold, strong, with smoky notes. Whole bean." |
| Single-Origin Bundle (3) | `coffee-bundle-3` | food-drink | 1,250 | 15 | "Sagada Arabica + Barako + Benguet. Three 100g bags. Save ₱150." |

### Teresa Lim — Cebu Craft (`vendorId: teresa`)

| Title | Slug | Category | Price (₱) | Stock | Description |
|-------|------|----------|-----------|-------|-------------|
| Capiz Shell Pendant Light | `capiz-pendant-light` | home-decor | 2,800 | 4 | "Drum-shaped pendant, hand-laid capiz shells. 35cm diameter. Bulb not included." |
| Shell-Crafted Earrings | `shell-craft-earrings` | fashion | 350 | 30 | "Lightweight capiz shell earrings. Hypoallergenic stainless hooks. Multiple designs." |
| Cebu Guitar Pick (set of 6) | `cebu-guitar-pick` | art-prints | 220 | 50 | "Hand-cut shell picks. 6 designs in a small fabric pouch." |
| Mother-of-Pearl Bracelet | `mother-of-pearl-bracelet` | fashion | 580 | 18 | "Polished shell discs on stretch cord. Adjustable 16–20cm." |
| Capiz Window Panel (set of 3) | `capiz-window-panel` | home-decor | 2,200 | 6 | "Three panel capiz window covering. Each 40×80 cm. Hand-laid shells." |

### Chef Andres — Pampanga Kitchen (`vendorId: andres`)

| Title | Slug | Category | Price (₱) | Stock | Description |
|-------|------|----------|-----------|-------|-------------|
| Tocino Slices (500g) | `tocino-slices-500g` | food-drink | 480 | 20 | "Sweet cured pork, family recipe. Frozen, ready to fry. Serves 4–6." |
| Longganisa Sausage (10pc) | `longganisa-10pc` | food-drink | 420 | 25 | "Garlic-rich Kapampangan longganisa. Vacuum-sealed. 10 pieces per pack." |
| Tsokolate Tablet (250g) | `tsokolate-tablet-250g` | food-drink | 320 | 30 | "Stone-ground tablea from Davao. For traditional hot tsokolate ah." |
| Suka Ng Tuba (500ml) | `suka-ng-tuba` | food-drink | 180 | 40 | "Coconut sap vinegar, aged 1 year. Unpasteurized. For sinigang." |
| Pampanga Buko Pie (3pc) | `pampanga-buko-pie` | food-drink | 580 | 15 | "Frozen, ready to bake. 3 individual pies. 12cm diameter." |

---

## 4. Service Listings (3)

These are bookable — `isService: true`, `bookingDuration` in minutes.

| Title | Slug | Vendor | Category | Price (₱) | Duration (min) | Description |
|-------|------|--------|----------|-----------|----------------|-------------|
| Custom Weave Consultation | `custom-weave-consultation` | Maria | textiles | 500 | 30 | "30-minute video consultation with Maria. Discuss your custom textile project — color, pattern, size, timeline." |
| Pottery Wheel Workshop (Taal) | `pottery-wheel-workshop` | Juan | pottery | 1,500 | 120 | "In-person workshop at our Taal studio. 2 hours, all materials included. Take home your own piece (fired and glazed in 2 weeks)." |
| Private Coffee Cupping | `private-coffee-cupping` | Rico | food-drink | 800 | 60 | "60-minute guided coffee tasting. Learn about origin, roast, and brewing. 5 single-origin samples included. Held in Davao or online." |

---

## 5. Listing Images (Unsplash)

Each listing gets **3–5 images**. URLs follow this pattern:

```
https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=800&q=80
```

### Curated Unsplash image bank (search-friendly IDs)

For Sprint 0 we'll use a curated set. Real IDs to be added in `prisma/seed.ts`:

- **Weaving/textiles**: search "loom", "weaving", "fabric"
- **Pottery/ceramics**: search "pottery", "ceramic", "clay"
- **Wood/furniture**: search "woodworking", "wooden", "carving"
- **Coffee/food**: search "coffee beans", "cacao", "artisan food"
- **Shells/jewelry**: search "shell", "jewelry making"
- **Home decor**: search "macrame", "bamboo", "home decor"

Each seed image will have:
- `url`: Unsplash URL
- `alt`: Description matching the listing
- `sortOrder`: 0, 1, 2...

### Default placeholder (no images)

If a listing has no images, the UI shows a gradient tile with the listing's first letter in `primary-100` background.

---

## 6. Sample Reviews

Pre-seeded reviews for the top listings. All written by `isabel@test.ph`:

| Listing | Rating | Text |
|---------|--------|------|
| Inabel Blanket (Twin) | 5 | "Beautifully woven, even better in person. The indigo is deep and the cotton is soft. Worth every peso." |
| Burnay Clay Jar (25cm) | 5 | "I use mine for sinigang now. The jar has a soul to it. Came perfectly packed in wood shavings." |
| Sagada Arabica 250g | 5 | "Best Filipino coffee I've had. Rich, complex, not bitter. Will reorder." |
| Capiz Shell Pendant Light | 4 | "Gorgeous. The shells catch the light beautifully. Took 20 minutes to install, worth it." |
| T'boli T'nalak Cloth (per meter) | 5 | "You can feel the work in this. Each inch is handwoven. I had a jacket made and it's my favorite piece." |
| Narra Salad Bowl | 5 | "Heavy, gorgeous grain. Already oily from the wood — will only get better with use." |
| Tocino Slices (500g) | 5 | "Tastes like my Lola's. The sweetness is just right, not overly so. Fry till edges are crispy." |
| Shell-Crafted Earrings | 4 | "Lightweight, look expensive. Bought two pairs as gifts." |

---

## 7. Sample Orders

Pre-seeded orders so the demo doesn't look empty:

### Order 1: `isabel@test.ph` → Maria (delivered)
- `orderNumber`: `LIKHA-001`
- `total`: ₱5,050 (2× Inabel Blanket)
- `paymentState`: `PAID`
- `fulfillmentState`: `FULFILLED`
- `createdAt`: 14 days ago

### Order 2: `isabel@test.ph` → Rico (processing)
- `orderNumber`: `LIKHA-002`
- `total`: ₱860 (Sagada Arabica + Cacao Nibs)
- `paymentState`: `PAID`
- `fulfillmentState`: `PROCESSING`
- `createdAt`: 3 days ago

### Order 3: `liza@test.ph` → Chef Andres (unfulfilled)
- `orderNumber`: `LIKHA-003`
- `total`: ₱900 (Tocino + Longganisa)
- `paymentState`: `PAID`
- `fulfillmentState`: `UNFULFILLED`
- `createdAt`: 1 day ago

### Order 4: `paolo@test.ph` → Juan (pending)
- `orderNumber`: `LIKHA-004`
- `total`: ₱4,000 (2× Burnay Jar)
- `paymentState`: `PENDING_PAYMENT`
- `fulfillmentState`: `UNFULFILLED`
- `createdAt`: 2 hours ago

---

## 8. Sample Bookings

| Buyer | Listing | Date | Status |
|-------|---------|------|--------|
| `liza@test.ph` | Pottery Wheel Workshop (Taal) | Next Saturday, 10am | CONFIRMED |
| `isabel@test.ph` | Custom Weave Consultation | Tomorrow, 2pm | PENDING |
| `paolo@test.ph` | Private Coffee Cupping | Friday, 4pm | PENDING |

---

## 9. Sample Notifications

For `isabel@test.ph`:
- "Your order LIKHA-002 has shipped!" (3 days ago)
- "Maria responded to your review" (1 week ago)

For `maria@likha.ph`:
- "New order: LIKHA-001" (14 days ago)
- "Paolo is interested in Custom Weave Consultation" (2 days ago)

---

## 10. Wishlist

For `isabel@test.ph`:
- Capiz Shell Pendant Light
- Sagada Arabica 250g
- Vigan Wooden Chair

For `liza@test.ph`:
- Inabel Blanket (Twin)
- Bamboo Tray (set of 2)

---

## 11. Conversations & Messages

### Conversation 1: `isabel@test.ph` ↔ `maria@likha.ph`
- Context: Inabel Blanket
- Messages:
  - Isabel: "Hi Maria! Is the Inabel blanket available in a custom size?"
  - Maria: "Hi Isabel! Yes, we can do custom. Lead time is 3 weeks. Want me to send a quote?"
  - Isabel: "Yes please!"

### Conversation 2: `liza@test.ph` ↔ `juan@likha.ph`
- Context: Pottery Workshop
- Messages:
  - Liza: "Hi! Can I bring a friend to the workshop?"
  - Juan: "Of course! Additional person is ₱1,000. I'll update the booking."

---

## 12. Vendors' Inventory at Seed Time

| Vendor | Listings | Bookable | Total |
|--------|----------|----------|-------|
| Maria | 5 | 1 | 6 |
| Juan | 5 | 1 | 6 |
| Lorna | 5 | 0 | 5 |
| Rico | 5 | 1 | 6 |
| Teresa | 5 | 0 | 5 |
| Chef Andres | 5 | 0 | 5 |
| **Total** | **30** | **3** | **33** |

---

## 13. Seed Run Output

After running `npm run db:reset`, the database should contain:

```
👥 Users: 10 (6 vendors, 1 admin, 3 buyers)
📂 Categories: 7
📦 Listings: 33 (30 products, 3 services)
🖼️  Listing Images: ~120 (avg 4 per listing)
⭐ Reviews: 8
🛒 Orders: 4
📅 Bookings: 3
🔔 Notifications: 4
❤️ Wishlist Items: 5
💬 Conversations: 2
✉️ Messages: 4
```

This makes the demo feel populated from the moment a client visits.
