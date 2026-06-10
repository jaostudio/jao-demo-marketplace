const fs = require('fs');
const path = require('path');
const https = require('https');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'products');
const CATEGORIES_DIR = path.join(__dirname, '..', 'public', 'categories');
const AVATARS_DIR = path.join(__dirname, '..', 'public', 'avatars');
const HERO_PATH = path.join(__dirname, '..', 'public', 'hero-banner.jpg');

function download(url, filePath) {
  return new Promise((resolve) => {
    const tryGet = (u) => {
      https.get(u, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 20000,
      }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (res.headers.location) {
            tryGet(res.headers.location);
            return;
          }
        }
        if (res.statusCode !== 200) {
          console.log(`  FAIL ${path.basename(filePath)} (HTTP ${res.statusCode})`);
          resolve(false);
          return;
        }
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filePath);
          console.log(`  OK ${path.basename(filePath)} (${(stats.size / 1024).toFixed(1)}KB)`);
          resolve(true);
        });
        file.on('error', () => { fs.unlink(filePath, () => {}); resolve(false); });
      }).on('error', (e) => {
        console.log(`  ERR ${path.basename(filePath)}: ${e.message}`);
        resolve(false);
      });
    };
    tryGet(url);
  });
}

async function main() {
  console.log('=== Downloading Product Images from picsum.photos ===\n');

  [PRODUCTS_DIR, CATEGORIES_DIR, AVATARS_DIR].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Read slugs from CSV
  const csv = fs.readFileSync(path.join(__dirname, '..', 'image-mapping.csv'), 'utf-8');
  const lines = csv.trim().split('\n').slice(1);
  const slugs = lines.map(l => l.split(',')[0].trim());

  console.log(`Found ${slugs.length} products from CSV\n`);

  let ok = 0, fail = 0;
  for (const slug of slugs) {
    const filePath = path.join(PRODUCTS_DIR, `${slug}.jpg`);
    const url = `https://picsum.photos/seed/palengkee-${slug}/800/800`;
    const success = await download(url, filePath);
    if (success) ok++; else fail++;
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nProducts: ${ok} downloaded, ${fail} failed`);

  // Category images
  const cats = ['fresh-produce','meat-seafood','rice-groceries','coffee-drinks','home-kitchen','local-delicacies','crafts-souvenirs'];
  console.log('\n--- Category Covers ---');
  for (const cat of cats) {
    const filePath = path.join(CATEGORIES_DIR, `${cat}.jpg`);
    const url = `https://picsum.photos/seed/cat-${cat}/1200/800`;
    await download(url, filePath);
    await new Promise(r => setTimeout(r, 200));
  }

  // Hero banner
  console.log('\n--- Hero Banner ---');
  await download('https://picsum.photos/seed/palengkee-market-scene/1920/800', HERO_PATH);

  // Vendor avatars
  console.log('\n--- Vendor Avatars ---');
  const avatars = ['aling-nena','mang-juan','rose','davao','cebu','pampanga'];
  for (const av of avatars) {
    const filePath = path.join(AVATARS_DIR, `${av}.jpg`);
    const url = `https://picsum.photos/seed/avatar-${av}/200/200`;
    await download(url, filePath);
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== All Done ===');
}

main().catch(console.error);