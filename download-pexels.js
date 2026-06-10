const fs = require('fs');
const path = require('path');
const https = require('https');

// Directories
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const CATEGORIES_DIR = path.join(__dirname, 'public', 'categories');
const AVATARS_DIR = path.join(__dirname, 'public', 'avatars');

// Pexels image URLs - using direct download links
// Format: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w={width}&h={height}&fit=crop
const PEXELS_IMAGES = {
  // Vendor Avatars
  'avatars': {
    'mang-juan': {
      id: '2379004',
      description: 'Filipino man portrait'
    },
    'rose': {
      id: '1181519',
      description: 'Filipina woman portrait'
    },
    'davao': {
      id: '2379005',
      description: 'Coffee farmer portrait'
    },
    'cebu': {
      id: '1181516',
      description: 'Artisan portrait'
    },
    'pampanga': {
      id: '1181519',
      description: 'Food maker portrait'
    }
  },
  
  // Category Covers
  'categories': {
    'fresh-produce': {
      id: '1126728',
      description: 'Fresh vegetables market stall'
    },
    'meat-seafood': {
      id: '229789',
      description: 'Fresh fish on ice'
    },
    'rice-groceries': {
      id: '1050242',
      description: 'Rice sacks at market'
    },
    'coffee-drinks': {
      id: '1695052',
      description: 'Coffee beans close-up'
    },
    'home-kitchen': {
      id: '1395306',
      description: 'Bamboo kitchenware'
    },
    'local-delicacies': {
      id: '2085771',
      description: 'Filipino food display'
    },
    'crafts-souvenirs': {
      id: '1395308',
      description: 'Woven crafts and baskets'
    }
  },
  
  // Priority Products - using generic but appropriate images
  'products': {
    // Fresh Produce - Fish
    'galunggong-per-kg': { id: '229789', query: 'fresh fish' },
    'bangus-deboned': { id: '229789', query: 'fresh fish' },
    'fresh-tilapia': { id: '229789', query: 'fresh fish' },
    
    // Fresh Produce - Fruits
    'saging-saba': { id: '461049', query: 'banana' },
    'carabao-mango': { id: '917373', query: 'mango' },
    'calamansi': { id: '1132047', query: 'lime citrus' },
    
    // Fresh Produce - Vegetables
    'siling-labuyo': { id: '4110251', query: 'chili pepper' },
    'kamatis': { id: '5710938', query: 'tomatoes' },
    'bawang': { id: '2286766', query: 'garlic' },
    'sibuyas': { id: '1578750', query: 'onions' },
    'talong': { id: '136123', query: 'eggplant' },
    'kangkong': { id: '1132047', query: 'leafy greens' },
    'ampalaya': { id: '136123', query: 'bitter gourd' },
    'sayote': { id: '136123', query: 'chayote' },
    'repolyo': { id: '136123', query: 'cabbage' },
    'luya': { id: '2286766', query: 'ginger' },
    'labanos': { id: '136123', query: 'radish' },
    'mustasa': { id: '1132047', query: 'mustard greens' },
    'sitaw': { id: '1132047', query: 'string beans' },
    'patola': { id: '136123', query: 'luffa gourd' },
    'market-tour': { id: '1126728', query: 'market tour' },
    
    // Meat & Seafood - Pork
    'pork-kasim': { id: '2338420', query: 'pork meat' },
    'pork-liempo': { id: '2338420', query: 'pork belly' },
    'pork-chop': { id: '2338420', query: 'pork chop' },
    
    // Meat & Seafood - Chicken
    'chicken-legs': { id: '1395306', query: 'raw chicken' },
    'chicken-wings': { id: '1395306', query: 'chicken wings' },
    
    // Meat & Seafood - Beef
    'beef-bulalo': { id: '1050242', query: 'beef meat' },
    'beef-tapa': { id: '1050242', query: 'beef jerky' },
    
    // Meat & Seafood - Seafood
    'hipon': { id: '1640777', query: 'shrimp prawns' },
    'pusit': { id: '1640777', query: 'squid seafood' },
    'tahong': { id: '1640777', query: 'mussels shellfish' },
    'alimasag': { id: '1640777', query: 'crab seafood' },
    
    // Meat & Seafood - Processed
    'frozen-hotdog': { id: '2338420', query: 'processed meat' },
    'frozen-meatballs': { id: '2338420', query: 'meatballs' },
    
    // Meat & Seafood - Fish
    'bangus-belly': { id: '229789', query: 'milkfish' },
    'tuna-belly': { id: '229789', query: 'tuna belly' },
    
    // Rice & Groceries - Rice
    'sinandomeng-5kg': { id: '1050242', query: 'white rice' },
    'jasponica-5kg': { id: '1050242', query: 'rice grains' },
    
    // Rice & Groceries - Condiments
    'datu-puti-vinegar': { id: '1395306', query: 'vinegar' },
    'soy-sauce': { id: '1395306', query: 'soy sauce' },
    'cooking-oil': { id: '1395306', query: 'cooking oil' },
    'tomato-sauce': { id: '1395306', query: 'tomato sauce' },
    
    // Rice & Groceries - Dry Goods
    'brown-sugar': { id: '1395306', query: 'brown sugar' },
    'refined-sugar': { id: '1395306', query: 'white sugar' },
    'iodized-salt': { id: '1395306', query: 'salt' },
    'flour': { id: '1395306', query: 'flour' },
    'cornstarch': { id: '1395306', query: 'cornstarch' },
    'oatmeal': { id: '1395306', query: 'oatmeal' },
    'coffee-creamer': { id: '1395306', query: 'coffee creamer' },
    'peanut-butter': { id: '1395306', query: 'peanut butter' },
    'mayonnaise': { id: '1395306', query: 'mayonnaise' },
    
    // Coffee & Drinks - Coffee
    'davao-arabica': { id: '1695052', query: 'coffee beans' },
    'barako-coffee': { id: '1695052', query: 'barako coffee' },
    'benguet-arabica': { id: '1695052', query: 'arabica coffee' },
    
    // Coffee & Drinks - Cacao
    'tablea': { id: '2085771', query: 'chocolate tablets' },
    'cacao-nibs': { id: '2085771', query: 'cacao nibs' },
    
    // Coffee & Drinks - Beverages
    'pandan-iced-tea': { id: '1395306', query: 'iced tea' },
    'buko-juice': { id: '1395306', query: 'coconut juice' },
    'lemongrass-tea': { id: '1395306', query: 'herbal tea' },
    'calamansi-juice': { id: '1395306', query: 'citrus juice' },
    'guyabano-juice': { id: '1395306', query: 'tropical juice' },
    
    // Coffee & Drinks - Service
    'coffee-cupping': { id: '1695052', query: 'coffee tasting' },
    
    // Home & Kitchen - Bamboo
    'bamboo-board': { id: '1395306', query: 'bamboo cutting board' },
    'bamboo-utensils': { id: '1395306', query: 'bamboo utensils' },
    'bamboo-straw': { id: '1395306', query: 'bamboo straw' },
    
    // Home & Kitchen - Shell
    'capiz-lamp': { id: '1395306', query: 'shell lamp' },
    'coconut-bowl': { id: '1395306', query: 'coconut bowl' },
    
    // Home & Kitchen - Woven
    'abaca-placemat': { id: '1395306', query: 'woven placemat' },
    'bayong-bag': { id: '1395306', query: 'woven bag' },
    'rattan-basket': { id: '1395306', query: 'rattan basket' },
    'buri-hat': { id: '1395306', query: 'woven hat' },
    'coir-doormat': { id: '1395306', query: 'coir doormat' },
    
    // Home & Kitchen - Wooden
    'wooden-ladle': { id: '1395306', query: 'wooden ladle' },
    'banana-leaf-plate': { id: '1395306', query: 'banana leaf plate' },
    
    // Local Delicacies - Meat
    'pampanga-tocino': { id: '2338420', query: 'tocino' },
    'vigan-longganisa': { id: '2338420', query: 'longganisa' },
    
    // Local Delicacies - Dried
    'dried-mangoes': { id: '917373', query: 'dried mangoes' },
    'banana-chips': { id: '461049', query: 'banana chips' },
    'cassava-chips': { id: '1395306', query: 'cassava chips' },
    
    // Local Delicacies - Pastries
    'piaya': { id: '2085771', query: 'filipino pastry' },
    'otap': { id: '2085771', query: 'puff pastry' },
    'puto-cheese': { id: '2085771', query: 'steamed cake' },
    'polvoron': { id: '2085771', query: 'powder candy' },
    
    // Local Delicacies - Cacao
    'tablea-tsokolate': { id: '2085771', query: 'chocolate tablets' },
    
    // Local Delicacies - Pastries
    'buko-pie': { id: '2085771', query: 'coconut pie' },
    
    // Local Delicacies - Spreads
    'ube-halaya': { id: '2085771', query: 'purple yam jam' },
    'yema-spread': { id: '2085771', query: 'caramel spread' },
    
    // Local Delicacies - Dessert
    'saging-con-yelo': { id: '1395306', query: 'banana ice' },
    'mais-con-yelo': { id: '1395306', query: 'corn ice' },
    
    // Crafts & Souvenirs - Shell
    'shell-keychain': { id: '1395308', query: 'shell craft' },
    'capiz-earrings': { id: '1395308', query: 'shell earrings' },
    'coconut-ashtray': { id: '1395308', query: 'coconut shell' },
    
    // Crafts & Souvenirs - Bamboo
    'bamboo-tumbler': { id: '1395308', query: 'bamboo tumbler' },
    'bamboo-wind-chime': { id: '1395308', query: 'bamboo wind chime' },
    
    // Crafts & Souvenirs - Woven
    'abaca-coin-purse': { id: '1395308', query: 'woven coin purse' },
    'woven-bilao': { id: '1395308', query: 'woven tray' },
    'abaca-sling-bag': { id: '1395308', query: 'woven sling bag' },
    'buri-fan': { id: '1395308', query: 'woven fan' },
    'banig-mat': { id: '1395308', query: 'woven mat' },
    'handwoven-basket': { id: '1395308', query: 'handwoven basket' },
    
    // Crafts & Souvenirs - Wooden
    'mini-jeepney': { id: '1395308', query: 'miniature jeepney' },
    'wooden-spoon-set': { id: '1395308', query: 'wooden spoon' }
  }
};

// Download image from Pexels
function downloadPexelsImage(photoId, filename, outputDir, width = 800, height = 800) {
  return new Promise((resolve, reject) => {
    const url = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;
    
    const filePath = path.join(outputDir, filename);
    
    https.get(url, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFromUrl(res.headers.location, filename, outputDir)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        console.log(`Failed: ${filename} (HTTP ${res.statusCode})`);
        resolve(false);
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(filePath);
        console.log(`Downloaded: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
        resolve(true);
      });
      
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {});
        reject(error);
      });
    }).on('error', (error) => {
      console.log(`Error: ${filename} - ${error.message}`);
      resolve(false);
    }).on('timeout', () => {
      console.log(`Timeout: ${filename}`);
      resolve(false);
    });
  });
}

// Download from specific URL
function downloadFromUrl(url, filename, outputDir) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000 }, (res) => {
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
  console.log('=== Pexels Image Download Script ===\n');
  
  // Ensure directories exist
  [PRODUCTS_DIR, CATEGORIES_DIR, AVATARS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  
  // 1. Download vendor avatars
  console.log('--- Vendor Avatars ---');
  for (const [slug, info] of Object.entries(PEXELS_IMAGES.avatars)) {
    const filename = `${slug}.jpg`;
    const filePath = path.join(AVATARS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`Skip: ${filename} (exists)`);
      skipped++;
      continue;
    }
    
    const success = await downloadPexelsImage(info.id, filename, AVATARS_DIR, 200, 200);
    if (success) downloaded++; else failed++;
    await new Promise(r => setTimeout(r, 500));
  }
  
  // 2. Download category covers
  console.log('\n--- Category Covers ---');
  for (const [slug, info] of Object.entries(PEXELS_IMAGES.categories)) {
    const filename = `${slug}.jpg`;
    const filePath = path.join(CATEGORIES_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`Skip: ${filename} (exists)`);
      skipped++;
      continue;
    }
    
    const success = await downloadPexelsImage(info.id, filename, CATEGORIES_DIR, 1200, 800);
    if (success) downloaded++; else failed++;
    await new Promise(r => setTimeout(r, 500));
  }
  
  // 3. Download product images
  console.log('\n--- Product Images ---');
  for (const [slug, info] of Object.entries(PEXELS_IMAGES.products)) {
    const filename = `${slug}.jpg`;
    const filePath = path.join(PRODUCTS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`Skip: ${filename} (exists)`);
      skipped++;
      continue;
    }
    
    const success = await downloadPexelsImage(info.id, filename, PRODUCTS_DIR, 800, 800);
    if (success) downloaded++; else failed++;
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Summary
  console.log('\n=== Summary ===');
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${downloaded + skipped + failed}`);
  
  console.log('\n=== Next Steps ===');
  console.log('1. Run "npm run dev" to test the site');
  console.log('2. Check public/avatars/ for vendor portraits');
  console.log('3. Check public/categories/ for category covers');
  console.log('4. Check public/products/ for product images');
}

// Run
main().catch(console.error);
