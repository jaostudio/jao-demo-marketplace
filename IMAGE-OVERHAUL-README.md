# Image Overhaul Instructions

This document explains how to replace all product, category, and vendor images with high-quality, authentic photos.

## Overview

- **100+ product images** in `public/products/`
- **7 category covers** in `public/categories/`
- **6 vendor avatars** in `public/avatars/`
- **1 hero banner** in `public/`

## Files Created

1. **`image-mapping.csv`** - CSV mapping with search keywords for each product
2. **`download-images.js`** - Script to auto-download from Unsplash API
3. **`download-manual.js`** - Script with pre-configured URLs for manual download

## Option 1: Semi-Manual Approach (Recommended)

### Step 1: Review the CSV Mapping

Open `image-mapping.csv` to see the search keywords for each product.

### Step 2: Download Images Manually

1. Go to [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
2. Search for the keywords in the CSV
3. Download images that match:
   - **Products**: 800x800 pixels, square crop
   - **Categories**: 1200x800 pixels, landscape
   - **Avatars**: 200x200 pixels, square crop
4. Save with the exact filename from the CSV (e.g., `galunggong-per-kg.jpg`)

### Step 3: Place Images

- Product images → `public/products/`
- Category images → `public/categories/`
- Vendor avatars → `public/avatars/`

### Step 4: Verify

Run `npm run dev` and check that all images load correctly.

## Option 2: Automated Download (Unsplash API)

### Step 1: Get Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an account and new application
3. Copy your Access Key

### Step 2: Set Environment Variable

```bash
# Windows
set UNSPLASH_ACCESS_KEY=your_access_key_here

# macOS/Linux
export UNSPLASH_ACCESS_KEY=your_access_key_here
```

### Step 3: Run the Script

```bash
node download-images.js
```

This will download images based on the search keywords in the CSV.

## Option 3: Quick Download (Pre-configured URLs)

### Step 1: Run the Manual Script

```bash
node download-manual.js
```

This uses pre-configured Unsplash URLs (may not be perfect for all products).

## Image Guidelines

### Product Images (100 items)

- **Resolution**: 800x800 pixels minimum
- **Format**: JPEG
- **File size**: < 200KB
- **Style**: Clear, well-lit, professional product photos

### Category Covers (7 items)

- **Resolution**: 1200x800 pixels
- **Format**: JPEG
- **Style**: Wide shots of market stalls, displays, or relevant scenes

### Vendor Avatars (6 items)

- **Resolution**: 200x200 pixels
- **Format**: JPEG
- **Style**: Friendly portraits of Filipino vendors

## Category Breakdown

### Fresh Produce (20 products)

- **Fish** (3): galunggong, bangus, tilapia
- **Fruits** (4): saba, mango, calamansi, repolyo
- **Vegetables** (13): sili, kamatis, bawang, sibuyas, talong, kangkong, ampalaya, sayote, luya, labanos, mustasa, sitaw, patola
- **Service** (1): market-tour

### Meat & Seafood (15 products)

- **Pork** (4): kasim, liempo, chop, tapa
- **Chicken** (2): legs, wings
- **Beef** (2): bulalo, tapa
- **Seafood** (4): hipon, pusit, tahong, alimasag
- **Processed** (2): hotdog, meatballs
- **Fish** (2): bangus belly, tuna belly

### Rice & Groceries (15 products)

- **Rice** (2): sinandomeng, jasponica
- **Condiments** (4): vinegar, soy sauce, oil, tomato sauce
- **Dry Goods** (9): sugar, salt, flour, cornstarch, oatmeal, creamer, peanut butter, mayonnaise

### Coffee & Drinks (11 products)

- **Coffee** (3): davao, barako, benguet
- **Cacao** (3): tablea, nibs, cupping
- **Beverages** (5): pandan, buko, lemongrass, calamansi, guyabano

### Home & Kitchen (12 products)

- **Bamboo** (3): board, utensils, straw
- **Shell** (2): lamp, bowl
- **Woven** (5): placemat, bayong, basket, hat, doormat
- **Wooden** (2): ladle, banana leaf plate

### Local Delicacies (15 products)

- **Meat** (2): tocino, longganisa
- **Dried** (3): mangoes, banana chips, cassava chips
- **Pastries** (5): piaya, otap, puto, polvoron, buko pie
- **Spreads** (2): ube, yema
- **Dessert** (3): saging con yelo, mais con yelo, tablea

### Crafts & Souvenirs (13 products)

- **Shell** (3): keychain, earrings, ashtray
- **Bamboo** (2): tumbler, wind chime
- **Woven** (6): coin purse, bilao, sling bag, fan, mat, basket
- **Wooden** (2): jeepney, spoon set

## Troubleshooting

### Images Not Loading

1. Check file extensions are `.jpg`
2. Verify filenames match exactly (case-sensitive)
3. Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### API Rate Limiting

If using the Unsplash script, add delays between requests (already included in script).

### Wrong Image Displayed

Ensure each product has only one image file in `public/products/`.

## Next Steps

After replacing images:

1. Re-seed the database: `npx prisma db push --force-reset && npx prisma db seed`
2. Test all pages: homepage, listings, product detail, cart, checkout
3. Verify images load in all viewports (mobile, tablet, desktop)

## Support

If you encounter issues:

1. Check the console for errors
2. Verify image files exist in the correct directories
3. Ensure image URLs are accessible (if using external URLs)
