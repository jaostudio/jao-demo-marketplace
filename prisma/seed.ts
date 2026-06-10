import { PrismaClient } from '@prisma/marketplace-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql(
  process.env.TURSO_AUTH_TOKEN
    ? { url: process.env.DATABASE_URL ?? 'file:./dev.db', authToken: process.env.TURSO_AUTH_TOKEN }
    : { url: process.env.DATABASE_URL ?? 'file:./dev.db' },
)
const prisma = new PrismaClient({ adapter })

const PASSWORD = 'likha2026'
const php = (pesos: number) => Math.round(pesos * 100)

// ===== USERS =====
const USERS = [
  { email: 'nena@palengkee.ph', name: "Aling Nena's Fish & Veggies", role: 'VENDOR' as const, bio: 'Fresh catch daily from Navotas fish port. Vegetables straight from Bulacan farms. Open since 1998.', location: 'Manila, Metro Manila', avatarUrl: '/avatars/aling-nena.jpg' },
  { email: 'mangjuan@palengkee.ph', name: "Mang Juan's Fruit Stand", role: 'VENDOR' as const, bio: 'Sweetest mangoes from Zambales, lanzones from Laguna, rambutan from Cavite. Family-run since the 80s.', location: 'Batangas City, Batangas', avatarUrl: '/avatars/mang-juan.jpg' },
  { email: 'rose@palengkee.ph', name: "Rose's Rice & Grocery", role: 'VENDOR' as const, bio: 'Premium Sinandomeng, Dinorado, and Jasponica rice. Complete pantry staples — soy sauce, vinegar, cooking oil, canned goods.', location: 'Vigan, Ilocos Sur', avatarUrl: '/avatars/rose.jpg' },
  { email: 'davao@palengkee.ph', name: "Davao Golden Coffee", role: 'VENDOR' as const, bio: 'Single-origin Arabica from the slopes of Mt. Apo. Farm-to-cup, roasted weekly. Also tablea and cacao nibs.', location: 'Davao City, Davao del Sur', avatarUrl: '/avatars/davao.jpg' },
  { email: 'cebu@palengkee.ph', name: "Cebu Shell & Home", role: 'VENDOR' as const, bio: 'Capiz shell lamps, mother-of-pearl trays, bamboo organizers. Handcrafted by Mactan artisans.', location: 'Lapu-Lapu City, Cebu', avatarUrl: '/avatars/cebu.jpg' },
  { email: 'pampanga@palengkee.ph', name: "Pampanga Delicacies", role: 'VENDOR' as const, bio: 'Authentic Kapampangan tocino, longganisa, taba ng talangka, and pastillas. Small-batch, no preservatives.', location: 'San Fernando, Pampanga', avatarUrl: '/avatars/pampanga.jpg' },
  { email: 'admin@palengkee.ph', name: 'Palengkee Admin', role: 'ADMIN' as const, bio: 'Platform administrator.', location: 'Manila, Metro Manila' },
  { email: 'isabel@test.ph', name: 'Isabel Reyes', role: 'BUYER' as const, bio: 'Home cook and market regular.', location: 'Quezon City, Metro Manila' },
  { email: 'paolo@test.ph', name: 'Paolo Cruz', role: 'BUYER' as const, bio: 'Coffee enthusiast, work-from-home dad.', location: 'Makati City, Metro Manila' },
  { email: 'liza@test.ph', name: 'Liza Mendoza', role: 'BUYER' as const, bio: 'Meal prepper, loves local brands.', location: 'Cebu City, Cebu' },
]

// ===== CATEGORIES =====
const CATEGORIES = [
  { slug: 'fresh-produce', name: 'Fresh Produce', icon: 'Carrot' },
  { slug: 'meat-seafood', name: 'Meat & Seafood', icon: 'Fish' },
  { slug: 'rice-groceries', name: 'Rice & Groceries', icon: 'Package' },
  { slug: 'coffee-drinks', name: 'Coffee & Drinks', icon: 'Coffee' },
  { slug: 'home-kitchen', name: 'Home & Kitchen', icon: 'Home' },
  { slug: 'local-delicacies', name: 'Local Delicacies', icon: 'Cookie' },
  { slug: 'crafts-souvenirs', name: 'Crafts & Souvenirs', icon: 'ShoppingBag' },
]

// ===== PRODUCTS (compact format) =====
// { t:title, s:slug, p:price_centavos, st:stock, v:vendor_email, c:cat_slug, fl?:flash_price, sv?:is_service, bd?:booking_minutes, // comment }
type ProdSeed = { t: string; s: string; p: number; st: number; v: string; c: string; fl?: number; sv?: boolean; bd?: number }

const PRODUCTS: ProdSeed[] = [
  // === Fresh Produce (20) ===
  { t:'Galunggong (per kg)', s:'galunggong-per-kg', p:php(180), st:50, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Bangus (deboned, per kg)', s:'bangus-deboned', p:php(240), st:30, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Fresh Tilapia (per kg)', s:'fresh-tilapia', p:php(140), st:40, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Saging na Saba (per kg)', s:'saging-saba', p:php(60), st:100, v:'mangjuan@palengkee.ph', c:'fresh-produce' },
  { t:'Carabao Mango (per kg)', s:'carabao-mango', p:php(150), st:20, v:'mangjuan@palengkee.ph', c:'fresh-produce', fl:php(120) },
  { t:'Siling Labuyo (100g)', s:'siling-labuyo', p:php(40), st:80, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Kamatis (per kg)', s:'kamatis', p:php(80), st:60, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Bawang (per kg)', s:'bawang', p:php(160), st:45, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Sibuyas (per kg)', s:'sibuyas', p:php(120), st:55, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Talong (per kg)', s:'talong', p:php(70), st:40, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Kangkong (bundle)', s:'kangkong', p:php(25), st:100, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Calamansi (500g)', s:'calamansi', p:php(60), st:80, v:'mangjuan@palengkee.ph', c:'fresh-produce' },
  { t:'Ampalaya (per kg)', s:'ampalaya', p:php(90), st:35, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Sayote (per kg)', s:'sayote', p:php(55), st:40, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Repolyo (per piece)', s:'repolyo', p:php(65), st:30, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Luya (per kg)', s:'luya', p:php(100), st:50, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Labanos (per kg)', s:'labanos', p:php(60), st:25, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Mustasa (bundle)', s:'mustasa', p:php(20), st:60, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Sitaw (per kg)', s:'sitaw', p:php(80), st:35, v:'nena@palengkee.ph', c:'fresh-produce' },
  { t:'Patola (per kg)', s:'patola', p:php(70), st:20, v:'nena@palengkee.ph', c:'fresh-produce' },

  // === Meat & Seafood (15) ===
  { t:'Pork Kasim (per kg)', s:'pork-kasim', p:php(280), st:25, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Pork Liempo (per kg)', s:'pork-liempo', p:php(350), st:20, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Chicken Whole Legs (per kg)', s:'chicken-legs', p:php(180), st:30, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Beef Bulalo Cut (per kg)', s:'beef-bulalo', p:php(420), st:15, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Shrimp (Hipon, per kg)', s:'hipon', p:php(380), st:12, v:'nena@palengkee.ph', c:'meat-seafood', fl:php(320) },
  { t:'Squid (Pusit, per kg)', s:'pusit', p:php(320), st:18, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Mussels (Tahong, per kg)', s:'tahong', p:php(100), st:40, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Crab (Alimasag, per kg)', s:'alimasag', p:php(450), st:8, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Frozen Hotdog (1kg)', s:'frozen-hotdog', p:php(200), st:60, v:'rose@palengkee.ph', c:'meat-seafood' },
  { t:'Frozen Meatballs (1kg)', s:'frozen-meatballs', p:php(220), st:50, v:'rose@palengkee.ph', c:'meat-seafood' },
  { t:'Beef Tapa (500g)', s:'beef-tapa', p:php(380), st:3, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Pork Chop (per kg)', s:'pork-chop', p:php(320), st:15, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Chicken Wings (per kg)', s:'chicken-wings', p:php(220), st:22, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Bangus Belly (per kg)', s:'bangus-belly', p:php(360), st:10, v:'nena@palengkee.ph', c:'meat-seafood' },
  { t:'Tuna Belly (per kg)', s:'tuna-belly', p:php(400), st:0, v:'nena@palengkee.ph', c:'meat-seafood' },

  // === Rice & Groceries (15) ===
  { t:'5kg Sinandomeng Rice', s:'sinandomeng-5kg', p:php(320), st:100, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'5kg Jasponica Rice', s:'jasponica-5kg', p:php(380), st:80, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Datu Puti Vinegar (1L)', s:'datu-puti-vinegar', p:php(45), st:200, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Soy Sauce (1L)', s:'soy-sauce', p:php(40), st:200, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Cooking Oil (1L)', s:'cooking-oil', p:php(90), st:150, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Brown Sugar (1kg)', s:'brown-sugar', p:php(60), st:120, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Refined Sugar (1kg)', s:'refined-sugar', p:php(55), st:120, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Iodized Salt (500g)', s:'iodized-salt', p:php(20), st:200, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'All-Purpose Flour (1kg)', s:'flour', p:php(50), st:100, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Cornstarch (500g)', s:'cornstarch', p:php(35), st:100, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Oatmeal (500g)', s:'oatmeal', p:php(95), st:60, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Coffee Creamer (400g)', s:'coffee-creamer', p:php(120), st:80, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Peanut Butter (500g)', s:'peanut-butter', p:php(130), st:50, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Mayonnaise (500ml)', s:'mayonnaise', p:php(110), st:70, v:'rose@palengkee.ph', c:'rice-groceries' },
  { t:'Tomato Sauce (1kg)', s:'tomato-sauce', p:php(75), st:90, v:'rose@palengkee.ph', c:'rice-groceries' },

  // === Coffee & Drinks (10) ===
  { t:'Davao Arabica (250g)', s:'davao-arabica', p:php(480), st:25, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Barako Coffee (200g)', s:'barako-coffee', p:php(420), st:18, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Benguet Arabica (250g)', s:'benguet-arabica', p:php(450), st:5, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Tablea de Cacao (10pcs)', s:'tablea', p:php(380), st:30, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Cacao Nibs (100g)', s:'cacao-nibs', p:php(280), st:20, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Pandan Iced Tea Mix (250g)', s:'pandan-iced-tea', p:php(120), st:40, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Fresh Buko Juice (500ml)', s:'buko-juice', p:php(80), st:30, v:'mangjuan@palengkee.ph', c:'coffee-drinks' },
  { t:'Lemongrass Tea Bags (10s)', s:'lemongrass-tea', p:php(95), st:50, v:'davao@palengkee.ph', c:'coffee-drinks' },
  { t:'Calamansi Juice Powder (200g)', s:'calamansi-juice', p:php(150), st:35, v:'mangjuan@palengkee.ph', c:'coffee-drinks' },
  { t:'Guyabano Juice (500ml)', s:'guyabano-juice', p:php(95), st:25, v:'mangjuan@palengkee.ph', c:'coffee-drinks' },

  // === Home & Kitchen (12) ===
  { t:'Bamboo Chopping Board', s:'bamboo-board', p:php(350), st:0, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Capiz Shell Pendant Lamp', s:'capiz-lamp', p:php(2800), st:4, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Abaca Placemat (set of 4)', s:'abaca-placemat', p:php(650), st:15, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Coconut Shell Bowl', s:'coconut-bowl', p:php(250), st:30, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Bamboo Utensil Set', s:'bamboo-utensils', p:php(380), st:20, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Wooden Serving Ladle', s:'wooden-ladle', p:php(120), st:40, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Banana Leaf Plate (10pcs)', s:'banana-leaf-plate', p:php(85), st:100, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Woven Bayong Bag', s:'bayong-bag', p:php(180), st:25, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Rattan Storage Basket', s:'rattan-basket', p:php(420), st:12, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Buri Hat', s:'buri-hat', p:php(280), st:8, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Coconut Coir Doormat', s:'coir-doormat', p:php(180), st:20, v:'cebu@palengkee.ph', c:'home-kitchen' },
  { t:'Bamboo Straw (pack of 20)', s:'bamboo-straw', p:php(60), st:60, v:'cebu@palengkee.ph', c:'home-kitchen' },

  // === Local Delicacies (15) ===
  { t:'Pampanga Tocino (500g)', s:'pampanga-tocino', p:php(280), st:30, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Vigan Longganisa (500g)', s:'vigan-longganisa', p:php(300), st:3, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Dried Mangoes (200g)', s:'dried-mangoes', p:php(250), st:40, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Piaya (box of 10)', s:'piaya', p:php(150), st:50, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Otap (pack of 20)', s:'otap', p:php(80), st:60, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Tablea Tsokolate (10pcs)', s:'tablea-tsokolate', p:php(320), st:30, v:'davao@palengkee.ph', c:'local-delicacies' },
  { t:'Puto Cheese (6pcs)', s:'puto-cheese', p:php(120), st:25, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Buko Pie (whole)', s:'buko-pie', p:php(580), st:10, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Ube Halaya (400g)', s:'ube-halaya', p:php(220), st:20, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Yema Spread (250g)', s:'yema-spread', p:php(140), st:30, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Polvoron (pack of 10)', s:'polvoron', p:php(100), st:40, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Banana Chips (200g)', s:'banana-chips', p:php(85), st:50, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Cassava Chips (200g)', s:'cassava-chips', p:php(75), st:45, v:'pampanga@palengkee.ph', c:'local-delicacies' },
  { t:'Saging Con Yelo Mix', s:'saging-con-yelo', p:php(150), st:20, v:'pampanga@palengkee.ph', c:'local-delicacies', fl:php(120) },
  { t:'Mais Con Yelo Mix', s:'mais-con-yelo', p:php(130), st:20, v:'pampanga@palengkee.ph', c:'local-delicacies' },

  // === Crafts & Souvenirs (13) ===
  { t:'Capiz Shell Keychain', s:'shell-keychain', p:php(80), st:200, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Bamboo Tumbler', s:'bamboo-tumbler', p:php(450), st:15, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Abaca Coin Purse', s:'abaca-coin-purse', p:php(120), st:40, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Woven Bilao Tray', s:'woven-bilao', p:php(380), st:10, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Miniature Jeepney', s:'mini-jeepney', p:php(250), st:25, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Capiz Shell Earrings', s:'capiz-earrings', p:php(350), st:30, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Wooden Spoon Set (3)', s:'wooden-spoon-set', p:php(220), st:20, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Abaca Sling Bag', s:'abaca-sling-bag', p:php(680), st:8, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Buri Fan', s:'buri-fan', p:php(150), st:30, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Coconut Shell Ashtray', s:'coconut-ashtray', p:php(180), st:20, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Bamboo Wind Chime', s:'bamboo-wind-chime', p:php(350), st:12, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Banig Mat (single)', s:'banig-mat', p:php(500), st:6, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },
  { t:'Handwoven Basket', s:'handwoven-basket', p:php(420), st:10, v:'cebu@palengkee.ph', c:'crafts-souvenirs' },

  // === Service (2) ===
  { t:'Private Coffee Cupping Session', s:'coffee-cupping', p:php(800), st:10, v:'davao@palengkee.ph', c:'coffee-drinks', sv:true, bd:60 },
  { t:'Market Tour with Mang Juan', s:'market-tour', p:php(500), st:8, v:'mangjuan@palengkee.ph', c:'fresh-produce', sv:true, bd:90 },
]

// ===== REVIEWS =====
const REVIEWS: { l: string; a: string; r: number; t: string }[] = [
  { l:'galunggong-per-kg', a:'isabel@test.ph', r:5, t:'Fresh na fresh! Perfect for pritong isda.' },
  { l:'bangus-deboned', a:'paolo@test.ph', r:4, t:'Walang tinik, madaling lutuin. Sarap!' },
  { l:'carabao-mango', a:'liza@test.ph', r:5, t:'Pinakamatamis na mangga! Sulit.' },
  { l:'saging-saba', a:'isabel@test.ph', r:4, t:'Perfect for turon at minatamis na saba.' },
  { l:'sinandomeng-5kg', a:'liza@test.ph', r:5, t:'Mabango at malagkit. The best rice!' },
  { l:'davao-arabica', a:'paolo@test.ph', r:5, t:'Smooth, hindi maasim. Bagong roast.' },
  { l:'barako-coffee', a:'isabel@test.ph', r:4, t:'Malakas ang tama, tulad ng naaalaala ko.' },
  { l:'pampanga-tocino', a:'liza@test.ph', r:5, t:'Authentic Kapampangan lasa. Tamang tamis.' },
  { l:'vigan-longganisa', a:'paolo@test.ph', r:4, t:'Masarap, mabango ng bawang. Konti lang stock!' },
  { l:'dried-mangoes', a:'isabel@test.ph', r:5, t:'Parang nasa Guimaras ako. Ang tamis!' },
  { l:'buko-pie', a:'liza@test.ph', r:5, t:'Fresh na buko, flaky ang crust. Sulit.' },
  { l:'ube-halaya', a:'isabel@test.ph', r:4, t:'Creamy at authentic na ube. Hindi artificial.' },
  { l:'capiz-lamp', a:'liza@test.ph', r:5, t:'Ganda ng ilaw pag sabay. Warm glow.' },
  { l:'abaca-placemat', a:'isabel@test.ph', r:4, t:'Elegant sa table setting. Quality.' },
  { l:'shell-keychain', a:'paolo@test.ph', r:5, t:'Mura pero quality. Perfect pasalubong.' },
  { l:'bamboo-tumbler', a:'isabel@test.ph', r:4, t:'Eco-friendly at maganda ang design.' },
  { l:'pork-kasim', a:'liza@test.ph', r:4, t:'Sariwa, perfect for sinigang.' },
  { l:'hipon', a:'paolo@test.ph', r:5, t:'Malalaki at sariwa. Sulit per kilo.' },
  { l:'bangus-belly', a:'isabel@test.ph', r:4, t:'Mataba at masarap. Best for daing.' },
  { l:'tablea-tsokolate', a:'liza@test.ph', r:5, t:'Pure cacao, walang halo. Sarap ng tsokolate.' },
  { l:'piaya', a:'isabel@test.ph', r:4, t:'Crunchy, tamang tamis. Umpisahan ang umaga.' },
  { l:'polvoron', a:'paolo@test.ph', r:3, t:'Masarap pero medyo matamis para sakin.' },
  { l:'mini-jeepney', a:'liza@test.ph', r:5, t:'Ang cute! Perfect souvenir for foreigners.' },
  { l:'pork-liempo', a:'isabel@test.ph', r:5, t:'Ginawa kong lechon kawali. Crunchy!' },
  { l:'beef-tapa', a:'paolo@test.ph', r:4, t:'Tender at malasa. Breakfast of champions.' },
  { l:'oatmeal', a:'liza@test.ph', r:4, t:'Healthy at affordable. Regular order na ito.' },
  { l:'bamboo-board', a:'isabel@test.ph', r:5, t:'Sayang out of stock. Sana magkaroon ulit.' },
  { l:'bayong-bag', a:'liza@test.ph', r:5, t:'Eco-friendly pamilihan bag. Matibay!' },
  { l:'coconut-bowl', a:'paolo@test.ph', r:4, t:'Unique design. Perfect for salads.' },
  { l:'coffee-cupping', a:'isabel@test.ph', r:5, t:'Ang saya! Natuto ako mag-appreciate ng coffee.' },
]

// ===== ORDERS =====
const ORDERS: { n: string; b: string; v: string; ps: 'PAID' | 'PENDING_PAYMENT' | 'REFUNDED'; fs: 'UNFULFILLED' | 'PROCESSING' | 'FULFILLED' | 'RETURNED'; e: string; nm: string; ad: string; items: { slug: string; name: string; qty: number; price: number }[]; ha?: number; da?: number }[] = [
  { n:'PLG-001', b:'isabel@test.ph', v:'nena@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'isabel@test.ph', nm:'Isabel Reyes', ad:'123 Katipunan Ave, Quezon City', items:[{ slug:'galunggong-per-kg', name:'Galunggong (per kg)', qty:2, price:php(180) },{ slug:'kamatis', name:'Kamatis (per kg)', qty:1, price:php(80) }], da:5 },
  { n:'PLG-002', b:'paolo@test.ph', v:'davao@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'paolo@test.ph', nm:'Paolo Cruz', ad:'456 Rada St, Makati City', items:[{ slug:'davao-arabica', name:'Davao Arabica (250g)', qty:2, price:php(480) },{ slug:'barako-coffee', name:'Barako Coffee (200g)', qty:1, price:php(420) }], da:4 },
  { n:'PLG-003', b:'liza@test.ph', v:'pampanga@palengkee.ph', ps:'PAID', fs:'PROCESSING', e:'liza@test.ph', nm:'Liza Mendoza', ad:'789 Magallanes St, Cebu City', items:[{ slug:'pampanga-tocino', name:'Pampanga Tocino (500g)', qty:3, price:php(280) },{ slug:'vigan-longganisa', name:'Vigan Longganisa (500g)', qty:1, price:php(300) }], da:2 },
  { n:'PLG-004', b:'isabel@test.ph', v:'rose@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'isabel@test.ph', nm:'Isabel Reyes', ad:'123 Katipunan Ave, Quezon City', items:[{ slug:'sinandomeng-5kg', name:'5kg Sinandomeng Rice', qty:1, price:php(320) },{ slug:'soy-sauce', name:'Soy Sauce (1L)', qty:2, price:php(40) },{ slug:'cooking-oil', name:'Cooking Oil (1L)', qty:1, price:php(90) }], da:6 },
  { n:'PLG-005', b:'paolo@test.ph', v:'nena@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'paolo@test.ph', nm:'Paolo Cruz', ad:'456 Rada St, Makati City', items:[{ slug:'hipon', name:'Shrimp (Hipon, per kg)', qty:1, price:php(380) },{ slug:'pusit', name:'Squid (Pusit, per kg)', qty:1, price:php(320) }], da:7 },
  { n:'PLG-006', b:'liza@test.ph', v:'cebu@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'liza@test.ph', nm:'Liza Mendoza', ad:'789 Magallanes St, Cebu City', items:[{ slug:'capiz-lamp', name:'Capiz Shell Pendant Lamp', qty:1, price:php(2800) },{ slug:'abaca-placemat', name:'Abaca Placemat (set of 4)', qty:2, price:php(650) }], da:10 },
  { n:'PLG-007', b:'isabel@test.ph', v:'nena@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'isabel@test.ph', nm:'Isabel Reyes', ad:'123 Katipunan Ave, Quezon City', items:[{ slug:'pork-kasim', name:'Pork Kasim (per kg)', qty:1, price:php(280) },{ slug:'saging-saba', name:'Saging na Saba (per kg)', qty:1, price:php(60) },{ slug:'calamansi', name:'Calamansi (500g)', qty:1, price:php(60) }], ha:12 },
  { n:'PLG-008', b:'paolo@test.ph', v:'davao@palengkee.ph', ps:'PENDING_PAYMENT', fs:'UNFULFILLED', e:'paolo@test.ph', nm:'Paolo Cruz', ad:'456 Rada St, Makati City', items:[{ slug:'tablea', name:'Tablea de Cacao (10pcs)', qty:1, price:php(380) },{ slug:'cacao-nibs', name:'Cacao Nibs (100g)', qty:2, price:php(280) }], ha:2 },
  { n:'PLG-009', b:'liza@test.ph', v:'cebu@palengkee.ph', ps:'PAID', fs:'PROCESSING', e:'liza@test.ph', nm:'Liza Mendoza', ad:'789 Magallanes St, Cebu City', items:[{ slug:'capiz-earrings', name:'Capiz Shell Earrings', qty:2, price:php(350) },{ slug:'shell-keychain', name:'Capiz Shell Keychain', qty:5, price:php(80) }], ha:6 },
  { n:'PLG-010', b:'isabel@test.ph', v:'pampanga@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'isabel@test.ph', nm:'Isabel Reyes', ad:'123 Katipunan Ave, Quezon City', items:[{ slug:'dried-mangoes', name:'Dried Mangoes (200g)', qty:3, price:php(250) },{ slug:'ube-halaya', name:'Ube Halaya (400g)', qty:1, price:php(220) },{ slug:'banana-chips', name:'Banana Chips (200g)', qty:2, price:php(85) }], da:8 },
  { n:'PLG-011', b:'paolo@test.ph', v:'cebu@palengkee.ph', ps:'PAID', fs:'FULFILLED', e:'paolo@test.ph', nm:'Paolo Cruz', ad:'456 Rada St, Makati City', items:[{ slug:'bamboo-tumbler', name:'Bamboo Tumbler', qty:1, price:php(450) },{ slug:'mini-jeepney', name:'Miniature Jeepney', qty:2, price:php(250) }], da:14 },
  { n:'PLG-012', b:'isabel@test.ph', v:'cebu@palengkee.ph', ps:'REFUNDED', fs:'RETURNED', e:'isabel@test.ph', nm:'Isabel Reyes', ad:'123 Katipunan Ave, Quezon City', items:[{ slug:'bamboo-board', name:'Bamboo Chopping Board', qty:1, price:php(350) }], da:20 },
]

// ===== BOOKINGS =====
const BOOKINGS: { b: string; l: string; d: number; s: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' }[] = [
  { b:'isabel@test.ph', l:'coffee-cupping', d:5, s:'CONFIRMED' },
  { b:'paolo@test.ph', l:'market-tour', d:10, s:'PENDING' },
  { b:'liza@test.ph', l:'coffee-cupping', d:3, s:'CONFIRMED' },
]

// ===== NOTIFICATIONS =====
const NOTIFICATIONS: { u: string; t: string; ttl: string; m: string; r: boolean; d: number; l?: string }[] = [
  { u:'nena@palengkee.ph', t:'order', ttl:'New order received', m:'Paolo Cruz ordered 2kg Galunggong and 1kg Kamatis.', r:false, d:1, l:'/dashboard/orders' },
  { u:'davao@palengkee.ph', t:'order', ttl:'New order received', m:'Paolo Cruz ordered Davao Arabica and Barako Coffee.', r:false, d:2, l:'/dashboard/orders' },
  { u:'isabel@test.ph', t:'order_update', ttl:'Your order PLG-001 has been delivered!', m:'Aling Nena marked your order as delivered.', r:false, d:5, l:'/orders' },
  { u:'isabel@test.ph', t:'order_update', ttl:'Your order PLG-007 is on the way!', m:'Aling Nena is preparing your pork and saba order.', r:true, d:10, l:'/orders' },
  { u:'paolo@test.ph', t:'order_update', ttl:'Your order PLG-008 has been shipped!', m:'Davao Golden Coffee shipped your tablea order.', r:false, d:1, l:'/orders' },
  { u:'liza@test.ph', t:'review', ttl:'Review your purchase', m:'How was your Capiz lamp? Share a review!', r:false, d:3, l:'/orders' },
  { u:'paolo@test.ph', t:'message', ttl:'New message from Davao Golden Coffee', m:'Rico replied to your question about the Benguet batch.', r:false, d:2, l:'/messages' },
  { u:'isabel@test.ph', t:'message', ttl:'New message from Cebu Shell & Home', m:'Cebu Shell responded about your bamboo tumbler inquiry.', r:false, d:1, l:'/messages' },
]

// ===== WISHLIST =====
const WISHLISTS: { u: string; items: string[] }[] = [
  { u:'isabel@test.ph', items:['galunggong-per-kg','carabao-mango','davao-arabica','pampanga-tocino','capiz-lamp','bamboo-tumbler','ube-halaya','piaya','banig-mat','coffee-cupping'] },
  { u:'paolo@test.ph', items:['benguet-arabica','tablea','beef-tapa','hipon','abaca-coin-purse'] },
  { u:'liza@test.ph', items:['abaca-placemat','coconut-bowl','shell-keychain','dried-mangoes','buko-pie','banana-chips'] },
]

// ===== COUPONS =====
const COUPONS: { code: string; kind: string; value: number; label: string; maxUses: number; useCount: number; active: boolean }[] = [
  { code:'PALENGKEE10', kind:'PERCENTAGE', value:10, label:'10% off your order', maxUses:100, useCount:0, active:true },
  { code:'WELCOME50', kind:'FIXED', value:php(50), label:'₱50 off your first order', maxUses:50, useCount:0, active:true },
  { code:'FREESHIP', kind:'FIXED', value:php(100), label:'Free shipping on your next order', maxUses:30, useCount:0, active:true },
  { code:'SENIOR5', kind:'PERCENTAGE', value:5, label:'5% off for our seniors', maxUses:20, useCount:0, active:true },
]

// ===== CONVERSATIONS =====
const CONVERSATIONS: { p: string[]; ls?: string; msgs: { s: string; c: string }[] }[] = [
  { p:['isabel@test.ph','nena@palengkee.ph'], msgs:[{ s:'isabel@test.ph', c:'Hi Aling Nena! Available pa ba ang galunggong today?' },{ s:'nena@palengkee.ph', c:'Oo naman anak! Fresh catch kaninang madaling araw. Magkano gusto mo?' }] },
  { p:['liza@test.ph','cebu@palengkee.ph'], ls:'capiz-lamp', msgs:[{ s:'liza@test.ph', c:'Hi! Available pa ba ang capiz lamp?' },{ s:'cebu@palengkee.ph', c:'Yes, we have 4 left. Would you like to order?' }] },
  { p:['paolo@test.ph','davao@palengkee.ph'], ls:'benguet-arabica', msgs:[{ s:'paolo@test.ph', c:'Kailan na-roast ang Benguet batch?' },{ s:'davao@palengkee.ph', c:'Last week! Fresh batch, June 2. It is drinking beautifully now.' }] },
  { p:['isabel@test.ph','cebu@palengkee.ph'], ls:'bamboo-tumbler', msgs:[{ s:'isabel@test.ph', c:'May ibang colors ba ng bamboo tumbler?' },{ s:'cebu@palengkee.ph', c:'We have natural bamboo and dark stain options. Will update the listing soon!' }] },
  { p:['liza@test.ph','pampanga@palengkee.ph'], msgs:[{ s:'liza@test.ph', c:'Gusto ko umorder ng tocino for weekend. Kaya pa ba?' },{ s:'pampanga@palengkee.ph', c:'Kaya pa! We have 30 packs ready. Order now for Saturday delivery.' }] },
]

// ===== BUNDLES =====
const BUNDLES: { title: string; desc: string; discountPct: number; items: string[] }[] = [
  { title:"Breakfast Saver Bundle", desc:"Start your day right! 5kg Sinandomeng Rice + Pampanga Tocino + Davao Arabica — save 12%", discountPct:12, items:['sinandomeng-5kg','pampanga-tocino','davao-arabica'] },
  { title:"Market Day Bundle", desc:"Your weekly market run: Galunggong, Kamatis, Kangkong, and Saging — save 10%", discountPct:10, items:['galunggong-per-kg','kamatis','kangkong','saging-saba'] },
  { title:"Pasalubong Bundle", desc:"The best of Pampanga: Tocino, Longganisa, Dried Mangoes, and Piaya — save 15%", discountPct:15, items:['pampanga-tocino','vigan-longganisa','dried-mangoes','piaya'] },
  { title:"Kitchen Starter Bundle", desc:"Equip your kitchen: Bamboo Utensils, Coconut Bowl, Banana Leaf Plates, and Bayong Bag — save 10%", discountPct:10, items:['bamboo-utensils','coconut-bowl','banana-leaf-plate','bayong-bag'] },
]

// ===== HELPERS =====
function daysAgo(d: number) { return new Date(Date.now() - d * 86400000) }
function daysAhead(d: number) { return new Date(Date.now() + d * 86400000) }
function hoursAgo(h: number) { return new Date(Date.now() - h * 3600000) }
function fmtDesc(t: string, c: string): string {
  const catMap: Record<string, string> = {
    'fresh-produce':'Fresh from the farm. Harvested daily. Available per kilo or piece.',
    'meat-seafood':'Fresh catch or cut daily. Store in refrigerator. Available per kilo.',
    'rice-groceries':'Pantry essential. Long shelf life. Store in a cool, dry place.',
    'coffee-drinks':'Premium quality. Freshly packed. Brew and enjoy at home.',
    'home-kitchen':'Handcrafted by local artisans. Eco-friendly materials. Made in the Philippines.',
    'local-delicacies':'Authentic Filipino flavor. Small-batch production. No artificial preservatives.',
    'crafts-souvenirs':'Handmade by Filipino artisans. Unique piece. Perfect as a gift or keepsake.',
  }
  return `${catMap[c] ?? 'Quality product from Palengkee.'}\n\n${t} — available now at Palengkee. Order today for nationwide delivery.`
}

// ===== MAIN =====
async function main() {
  console.log('🌱 Seeding Palengkee Marketplace...')
  const password = await bcrypt.hash(PASSWORD, 10)

  // Clear existing data
  console.log('  ↺ Clearing existing data...')
  await prisma.bundleItem.deleteMany()
  await prisma.bundle.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.listingImage.deleteMany()
  await prisma.listingVariant.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.category.deleteMany()
  await prisma.vendorMetrics.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('  👥 Seeding users...')
  const userMap = new Map<string, { id: string; role: string }>()
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: {
        name: u.name, email: u.email, password, role: u.role, location: u.location,
        avatarUrl: (u as any).avatarUrl ?? null, bio: u.bio,
        socialLinks: { facebook: `https://facebook.com/${u.email.split('@')[0]}`, instagram: `https://instagram.com/${u.email.split('@')[0]}` },
      },
    })
    userMap.set(u.email, { id: created.id, role: created.role })
  }
  console.log(`     Created ${userMap.size} users`)

  // Create categories
  console.log('  📂 Seeding categories...')
  const catMap = new Map<string, string>()
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({
      data: { name: c.name, slug: c.slug, icon: c.icon, coverUrl: `/categories/${c.slug}.jpg` },
    })
    catMap.set(c.slug, created.id)
  }
  console.log(`     Created ${catMap.size} categories`)

  // Create listings
  console.log('  📦 Seeding listings...')
  const listingMap = new Map<string, string>()
  for (const p of PRODUCTS) {
    const vendor = userMap.get(p.v)
    const catId = catMap.get(p.c)
    if (!vendor || !catId) { console.warn(`     Skipping ${p.s}: missing vendor/category`); continue }
    const now = new Date()
    const fsEnds = p.fl ? new Date(now.getTime() + 14 * 86400000) : undefined
    const created = await prisma.listing.create({
      data: {
        title: p.t, slug: p.s, description: fmtDesc(p.t, p.c),
        price: p.p, stock: p.st, status: 'APPROVED',
        isFlashSale: !!p.fl, flashSalePrice: p.fl ?? null, flashSaleEnds: fsEnds ?? null,
        isService: p.sv ?? false, bookingDuration: p.bd ?? null,
        vendorId: vendor.id, categoryId: catId,
        images: { create: { url: `/products/${p.s}.jpg`, alt: p.t, sortOrder: 0 } },
      },
    })
    listingMap.set(p.s, created.id)
  }
  console.log(`     Created ${listingMap.size} listings`)

  // Reviews
  console.log('  ⭐ Seeding reviews...')
  let reviewCount = 0
  for (const r of REVIEWS) {
    const listingId = listingMap.get(r.l)
    const author = userMap.get(r.a)
    if (!listingId || !author) continue
    await prisma.review.create({ data: { rating: r.r, text: r.t, listingId, authorId: author.id } })
    reviewCount++
  }
  console.log(`     Created ${reviewCount} reviews`)

  // Orders
  console.log('  🛒 Seeding orders...')
  for (const o of ORDERS) {
    const buyer = userMap.get(o.b)
    const vendor = userMap.get(o.v)
    if (!buyer || !vendor) continue
    const total = o.items.reduce((s, i) => s + i.price * i.qty, 0)
    const createdAt = o.ha ? hoursAgo(o.ha) : daysAgo(o.da ?? 0)
    await prisma.order.create({
      data: {
        orderNumber: o.n, total, currency: 'php',
        paymentState: o.ps, fulfillmentState: o.fs,
        buyerId: buyer.id, vendorId: vendor.id,
        email: o.e, name: o.nm, address: o.ad, createdAt,
        items: { create: o.items.map(i => ({ listingId: listingMap.get(i.slug) ?? '', productName: i.name, priceAtPurchase: i.price, quantity: i.qty })) },
      },
    })
  }
  console.log(`     Created ${ORDERS.length} orders`)

  // Bookings
  console.log('  📅 Seeding bookings...')
  for (const b of BOOKINGS) {
    const buyer = userMap.get(b.b)
    const listingId = listingMap.get(b.l)
    if (!buyer || !listingId) continue
    await prisma.booking.create({
      data: { date: daysAhead(b.d), status: b.s, listingId, buyerId: buyer.id,
        message: b.s === 'CONFIRMED' ? 'See you there! Excited to learn.' : 'Looking forward to it!' },
    })
  }
  console.log(`     Created ${BOOKINGS.length} bookings`)

  // Notifications
  console.log('  🔔 Seeding notifications...')
  for (const n of NOTIFICATIONS) {
    const user = userMap.get(n.u)
    if (!user) continue
    await prisma.notification.create({
      data: { userId: user.id, type: n.t, title: n.ttl, message: n.m, isRead: n.r, link: n.l, createdAt: daysAgo(n.d) },
    })
  }
  console.log(`     Created ${NOTIFICATIONS.length} notifications`)

  // Coupons
  console.log('  🏷️  Seeding coupons...')
  for (const c of COUPONS) {
    await prisma.coupon.create({ data: { ...c, kind: c.kind as any } })
  }
  console.log(`     Created ${COUPONS.length} coupons`)

  // Wishlist
  console.log('  ❤️  Seeding wishlist...')
  let wishlistCount = 0
  for (const w of WISHLISTS) {
    const user = userMap.get(w.u)
    if (!user) continue
    for (const slug of w.items) {
      const lid = listingMap.get(slug)
      if (!lid) continue
      try { await prisma.wishlistItem.create({ data: { userId: user.id, listingId: lid } }); wishlistCount++ } catch {}
    }
  }
  console.log(`     Created ${wishlistCount} wishlist items`)

  // Conversations
  console.log('  💬 Seeding conversations...')
  for (const c of CONVERSATIONS) {
    const a = userMap.get(c.p[0]); const b = userMap.get(c.p[1])
    if (!a || !b) continue
    const listingId = c.ls ? listingMap.get(c.ls) ?? null : null
    const conv = await prisma.conversation.create({ data: { participantAId: a.id, participantBId: b.id, listingId } })
    for (let i = 0; i < c.msgs.length; i++) {
      const m = c.msgs[i]; const sender = userMap.get(m.s)
      if (!sender) continue
      await prisma.message.create({
        data: { conversationId: conv.id, senderId: sender.id, content: m.c, isRead: i < c.msgs.length - 1,
          createdAt: new Date(Date.now() - (c.msgs.length - i) * 3600000) },
      })
    }
  }
  console.log(`     Created ${CONVERSATIONS.length} conversations`)

  // Bundles
  console.log('  🎁 Seeding bundles...')
  for (const b of BUNDLES) {
    const listingIds = b.items.map(s => listingMap.get(s)).filter(Boolean) as string[]
    if (listingIds.length < 2) continue
    await prisma.bundle.create({
      data: { title: b.title, description: b.desc, discountPct: b.discountPct, items: { create: listingIds.map(id => ({ listingId: id })) } },
    })
  }
  console.log('  🎁 Bundles seeded')

  // Vendor Metrics
  console.log('  📊 Computing vendor metrics...')
  for (const [, info] of userMap) {
    if (info.role !== 'VENDOR') continue
    const lc = await prisma.listing.count({ where: { vendorId: info.id } })
    const oc = await prisma.order.count({ where: { vendorId: info.id } })
    const tr = await prisma.order.aggregate({ where: { vendorId: info.id, paymentState: 'PAID' }, _sum: { total: true } }).then(r => r._sum.total ?? 0)
    const ra = await prisma.review.aggregate({ where: { listing: { vendorId: info.id } }, _avg: { rating: true }, _count: true }).then(r => ({ avg: r._avg.rating ?? 0, count: r._count }))
    await prisma.vendorMetrics.create({ data: { vendorId: info.id, listingCount: lc, orderCount: oc, totalRevenue: tr, averageRating: ra.avg } })
  }
  console.log('     Vendor metrics computed')

  console.log('\n✅ Seed complete!')
  console.log('\n   Test accounts (password: likha2026):')
  console.log('   ─────────────────────────────────────────')
  console.log('   Vendors:    nena@palengkee.ph, mangjuan@palengkee.ph, rose@palengkee.ph')
  console.log('              davao@palengkee.ph, cebu@palengkee.ph, pampanga@palengkee.ph')
  console.log('   Admin:      admin@palengkee.ph')
  console.log('   Buyers:     isabel@test.ph, paolo@test.ph, liza@test.ph')
  console.log('')
}

main().catch(e => { console.error('❌ Seed failed:', e); process.exit(1) }).finally(() => prisma.$disconnect())
