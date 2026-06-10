import { test, expect } from '@playwright/test';

const BASE = 'https://jao-marketplace-demo.vercel.app';
const BUYER_EMAIL = 'isabel@test.ph';
const BUYER_PASSWORD = 'likha2026';

async function addProductToCart(page: any, productSlug: string) {
  await page.goto(`${BASE}/listings/${productSlug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const addBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addBtn).toBeVisible({ timeout: 15000 });
  await addBtn.click();
  await page.waitForTimeout(1000);
}

test('Smoke test: all critical buyer paths', async ({ page }) => {
  test.setTimeout(600000);

  // ===== SIGN IN =====
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', BUYER_EMAIL);
  await page.fill('input[type="password"]', BUYER_PASSWORD);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL('**/');
  await page.waitForTimeout(1000);

  // ===== STEP 1: Homepage sections =====
  await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  // Check page contains expected sections (checking text content, not visibility,
  // because framer-motion whileInView delays make visibility unreliable in tests)
  const bodyText = await page.evaluate(() => document.body.innerText);
  expect(bodyText).toContain('SHOP BY CATEGORY');
  expect(bodyText).toContain('Everything you need, fresh daily');
  expect(bodyText).toContain('The hands behind every piece');
  expect(bodyText).toContain('WHY PALENGKEE');

  // ===== STEP 2: Add to cart + coupon =====
  await addProductToCart(page, 'davao-arabica');

  await page.goto(`${BASE}/cart`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await expect(page.getByText('Your selections')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Order summary')).toBeVisible();

  // Apply coupon
  await page.fill('#coupon', 'PALENGKEE10');
  await page.click('button:has-text("Apply")');
  await page.waitForTimeout(500);
  await expect(page.getByText('PALENGKEE10').first()).toBeVisible();

  // ===== STEP 3: Checkout with card =====
  await addProductToCart(page, 'galunggong-per-kg');

  await page.goto(`${BASE}/checkout`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // Fill phone (required, not in session)
  await page.fill('#phone', '+63 912 345 6789');

  await page.selectOption('#region', 'NCR');
  await page.waitForTimeout(300);
  await page.selectOption('#province', 'Metro Manila');
  await page.fill('#city', 'Quezon City');
  await page.fill('#barangay', 'Barangay Pinyahan');
  await page.fill('#street', '123 Maginhawa St');
  await page.fill('#postalCode', '1100');
  // Card is default
  await page.getByText('Credit / debit card').click();
  await page.waitForTimeout(300);
  await page.fill('#card-number', '4242 4242 4242 4242');
  await page.fill('#card-expiry', '12/28');
  await page.fill('#card-cvc', '123');
  await page.getByRole('button', { name: /place order/i }).click();
  await page.waitForTimeout(5000);

  // Check order was created
  await expect(page.getByText('Order placed successfully').first()).toBeVisible({ timeout: 30000 });

  // ===== STEP 4: Orders list =====
  await page.goto(`${BASE}/orders`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await expect(page.getByRole('heading', { name: 'Order history' })).toBeVisible({ timeout: 10000 });

  // ===== STEP 5: Vendor storefront =====
  await page.goto(`${BASE}/listings`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const listingLinks = page.locator('a[href*="/listings/"][href^="/listings/"]');
  await expect(listingLinks.first()).toBeVisible({ timeout: 10000 });
  await listingLinks.first().click();
  await page.waitForTimeout(3000);
  const visitStore = page.locator('a[href^="/vendors/"]').first();
  await expect(visitStore).toBeVisible({ timeout: 10000 });
  await visitStore.click();
  await page.waitForTimeout(3000);
  await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

  // ===== STEP 6: Dark mode =====
  const darkToggle = page.getByRole('button', { name: /toggle theme/i }).first();
  if (await darkToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await darkToggle.click();
    await page.waitForTimeout(500);
  }

  console.log('All critical buyer paths passed!');
});
