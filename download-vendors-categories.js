const fs = require('fs');
const path = require('path');
const https = require('https');

// Directories
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const CATEGORIES_DIR = path.join(__dirname, 'public', 'categories');
const AVATARS_DIR = path.join(__dirname, 'public', 'avatars');

// Vendor avatars - using Unsplash source API for random relevant images
const VENDOR_AVATARS = {
  'mang-juan': {
    query: 'filipino-man-farmer-smiling-portrait',
    description: 'Middle-aged Filipino man, fruit vendor'
  },
  'rose': {
    query: 'filipino-woman-market-smiling-portrait',
    description: 'Filipina woman, rice vendor'
  },
  'davao': {
    query: 'filipino-coffee-farmer-portrait',
    description: 'Coffee farmer/roaster'
  },
  'cebu': {
    query: 'filipino-artisan-craftsman-portrait',
    description: 'Shell craft artisan'
  },
  'pampanga': {
    query: 'filipino-woman-cooking-food-portrait',
    description: 'Food maker, delicacies'
  }
};

// Category covers - using Unsplash source API
const CATEGORY_COVERS = {
  'fresh-produce': {
    query: 'philippines-wet-market-vegetables-fresh-produce',
    description: 'Bustling vegetable market stall'
  },
  'meat-seafood': {
    query: 'fresh-seafood-fish-market-display',
    description: 'Fish and seafood display'
  },
  'rice-groceries': {
    query: 'rice-sacks-market-grocery-staples',
    description: 'Rice sacks and groceries'
  },
  'coffee-drinks': {
    query: 'coffee-beans-roasted-philippines',
    description: 'Coffee beans close-up'
  },
  'home-kitchen': {
    query: 'bamboo-kitchenware-handicrafts',
    description: 'Bamboo and kitchen items'
  },
  'local-delicacies': {
    query: 'filipino-food-delicacies-tocino-longganisa',
    description: 'Filipino delicacies display'
  },
  'crafts-souvenirs': {
    query: 'woven-baskets-capiz-shell-crafts',
    description: 'Woven baskets and shell crafts'
  }
};

// Most visible products (homepage, flash sales, first page)
const PRIORITY_PRODUCTS = [
  // Fresh Produce - Fish
  { slug: 'galunggong-per-kg', query: 'fresh-fish-market-display' },
  { slug: 'bangus-deboned', query: 'milkfish-fresh-seafood' },
  { slug: 'fresh-tilapia', query: 'fresh-tilapia-fish' },
  
  // Fresh Produce - Fruits
  { slug: 'saging-saba', query: 'saba-banana-philippines' },
  { slug: 'carabao-mango', query: 'philippine-mango-tropical-fruit' },
  { slug: 'calamansi', query: 'calamansi-lime-philippine' },
  
  // Fresh Produce - Vegetables
  { slug: 'siling-labuyo', query: 'chili-pepper-red-spicy' },
  { slug: 'kamatis', query: 'fresh-tomatoes-red' },
  { slug: 'bawang', query: 'garlic-bulbs-fresh' },
  { slug: 'sibuyas', query: 'fresh-onions-red-white' },
  { slug: 'talong', query: 'eggplant-purple-fresh' },
  
  // Meat & Seafood
  { slug: 'pork-kasim', query: 'raw-pork-meat-cuts' },
  { slug: 'pork-liempo', query: 'pork-belly-raw' },
  { slug: 'chicken-legs', query: 'raw-chicken-pieces' },
  { slug: 'beef-bulalo', query: 'raw-beef-meat-bone' },
  { slug: 'hipon', query: 'fresh-shrimp-prawns' },
  { slug: 'pusit', query: 'fresh-squid-seafood' },
  { slug: 'tahong', query: 'fresh-mussels-shellfish' },
  { slug: 'alimasag', query: 'fresh-crab-seafood' },
  
  // Rice & Groceries
  { slug: 'sinandomeng-5kg', query: 'white-rice-grain-sack' },
  { slug: 'jasponica-5kg', query: 'rice-grains-uncooked' },
  { slug: 'datu-puti-vinegar', query: 'vinegar-bottle-cooking' },
  { slug: 'soy-sauce', query: 'soy-sauce-bottle' },
  { slug: 'cooking-oil', query: 'cooking-oil-bottle' },
  
  // Coffee & Drinks
  { slug: 'davao-arabica', query: 'coffee-beans-roasted-arabica' },
  { slug: 'barako-coffee', query: 'barako-coffee-philippines' },
  { slug: 'benguet-arabica', query: 'arabica-coffee-beans' },
  { slug: 'tablea', query: 'chocolate-tablets-cacao' },
  { slug: 'buko-juice', query: 'coconut-juice-drink' },
  
  // Home & Kitchen
  { slug: 'bamboo-board', query: 'bamboo-chopping-board' },
  { slug: 'capiz-lamp', query: 'capiz-shell-lamp-light' },
  { slug: 'abaca-placemat', query: 'woven-placemat-handcraft' },
  { slug: 'coconut-bowl', query: 'coconut-shell-bowl' },
  { slug: 'bamboo-utensils', query: 'bamboo-utensils-set' },
  
  // Local Delicacies
  { slug: 'pampanga-tocino', query: 'tocino-filipino-cured-meat' },
  { slug: 'vigan-longganisa', query: 'longganisa-filipino-sausage' },
  { slug: 'dried-mangoes', query: 'dried-mangoes-philippines' },
  { slug: 'piaya', query: 'piaya-filipino-flatbread' },
  { slug: 'ube-halaya', query: 'ube-halaya-purple-yam' },
  { slug: 'buko-pie', query: 'buko-pie-coconut-pie' },
  
  // Crafts & Souvenirs
  { slug: 'shell-keychain', query: 'capiz-shell-keychain-craft' },
  { slug: 'bamboo-tumbler', query: 'bamboo-tumbler-bottle' },
  { slug: 'abaca-coin-purse', query: 'woven-coin-purse-handcraft' },
  { slug: 'woven-bilao', query: 'woven-tray-bilao' },
  { slug: 'mini-jeepney', query: 'miniature-jeepney-philippines' },
  { slug: 'capiz-earrings', query: 'capiz-shell-earrings-jewelry' },
  { slug: 'handwoven-basket', query: 'handwoven-basket-filipino' }
];

// Download image from Unsplash source
function downloadFromUnsplash(query, filename, outputDir) {
  return new Promise((resolve, reject) => {
    // Use Unsplash source API - redirects to a random relevant image
    const url = `https://source.unsplash.com/featured/800x800/?${encodeURIComponent(query)}`;
    
    https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
      },
      timeout: 10000
    }, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFromUrl(res.headers.location, filename, outputDir)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        console.log(`Failed to download ${filename}: HTTP ${res.statusCode}`);
        resolve(false);
        return;
      }
      
      const filePath = path.join(outputDir, filename);
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename} (${query})`);
        resolve(true);
      });
      
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {});
        reject(error);
      });
    }).on('error', (error) => {
      console.log(`Error downloading ${filename}: ${error.message}`);
      resolve(false);
    }).on('timeout', () => {
      console.log(`Timeout downloading ${filename}`);
      resolve(false);
    });
  });
}

// Download from specific URL
function downloadFromUrl(url, filename, outputDir) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    
    protocol.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFromUrl(res.headers.location, filename, outputDir)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      const filePath = path.join(outputDir, filename);
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
      
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {});
        reject(error);
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  console.log('=== Image Download Script ===\n');
  
  // Ensure directories exist
  [PRODUCTS_DIR, CATEGORIES_DIR, AVATARS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // 1. Download vendor avatars
  console.log('--- Downloading Vendor Avatars ---');
  for (const [slug, info] of Object.entries(VENDOR_AVATARS)) {
    const filename = `${slug}.jpg`;
    const filePath = path.join(AVATARS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (already exists)`);
      continue;
    }
    
    await downloadFromUnsplash(info.query, filename, AVATARS_DIR);
    await new Promise(r => setTimeout(r, 1500)); // Rate limiting
  }
  
  // 2. Download category covers
  console.log('\n--- Downloading Category Covers ---');
  for (const [slug, info] of Object.entries(CATEGORY_COVERS)) {
    const filename = `${slug}.jpg`;
    const filePath = path.join(CATEGORIES_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (already exists)`);
      continue;
    }
    
    await downloadFromUnsplash(info.query, filename, CATEGORIES_DIR);
    await new Promise(r => setTimeout(r, 1500));
  }
  
  // 3. Download priority products
  console.log('\n--- Downloading Priority Products ---');
  for (const product of PRIORITY_PRODUCTS) {
    const filename = `${product.slug}.jpg`;
    const filePath = path.join(PRODUCTS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (already exists)`);
      continue;
    }
    
    await downloadFromUnsplash(product.query, filename, PRODUCTS_DIR);
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log('\n=== Download Complete ===');
  console.log('\nPlease verify:');
  console.log('1. Check public/avatars/ for vendor portraits');
  console.log('2. Check public/categories/ for category covers');
  console.log('3. Check public/products/ for product images');
  console.log('4. Run "npm run dev" to test the site');
}

// Run
main().catch(console.error);
