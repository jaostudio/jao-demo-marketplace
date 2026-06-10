const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const CATEGORIES_DIR = path.join(__dirname, 'public', 'categories');
const AVATARS_DIR = path.join(__dirname, 'public', 'avatars');

// Manual image mapping - replace URLs with actual image URLs you find
const MANUAL_IMAGES = {
  // Fresh Produce - Fish
  'galunggong-per-kg': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&h=800&fit=crop',
  'bangus-deboned': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&h=800&fit=crop',
  'fresh-tilapia': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&h=800&fit=crop',
  
  // Fresh Produce - Fruits
  'saging-saba': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&h=800&fit=crop',
  'carabao-mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop',
  'calamansi': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&h=800&fit=crop',
  
  // Fresh Produce - Vegetables
  'siling-labuyo': 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800&h=800&fit=crop',
  'kamatis': 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=800&h=800&fit=crop',
  'bawang': 'https://images.unsplash.com/photo-1587573578329-3e5e8dbf5c0e?w=800&h=800&fit=crop',
  'sibuyas': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop',
  'talong': 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&h=800&fit=crop',
  'kangkong': 'https://images.unsplash.com/photo-1515023115894-1e07e3de8d4a?w=800&h=800&fit=crop',
  'ampalaya': 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=800&h=800&fit=crop',
  'sayote': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&h=800&fit=crop',
  'repolyo': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&h=800&fit=crop',
  'luya': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&h=800&fit=crop',
  'labanos': 'https://images.unsplash.com/photo-1590005176489-db2e714711fc?w=800&h=800&fit=crop',
  'mustasa': 'https://images.unsplash.com/photo-1515023115894-1e07e3de8d4a?w=800&h=800&fit=crop',
  'sitaw': 'https://images.unsplash.com/photo-1515023115894-1e07e3de8d4a?w=800&h=800&fit=crop',
  'patola': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&h=800&fit=crop',
  'market-tour': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=800&fit=crop',
  
  // Meat & Seafood - Pork
  'pork-kasim': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop',
  'pork-liempo': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop',
  'pork-chop': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop',
  
  // Meat & Seafood - Chicken
  'chicken-legs': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&h=800&fit=crop',
  'chicken-wings': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&h=800&fit=crop',
  
  // Meat & Seafood - Beef
  'beef-bulalo': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=800&fit=crop',
  'beef-tapa': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=800&fit=crop',
  
  // Meat & Seafood - Seafood
  'hipon': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=800&fit=crop',
  'pusit': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=800&fit=crop',
  'tahong': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=800&fit=crop',
  'alimasag': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=800&fit=crop',
  
  // Meat & Seafood - Processed
  'frozen-hotdog': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=800&fit=crop',
  'frozen-meatballs': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=800&fit=crop',
  
  // Meat & Seafood - Fish
  'bangus-belly': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&h=800&fit=crop',
  'tuna-belly': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&h=800&fit=crop',
  
  // Rice & Groceries - Rice
  'sinandomeng-5kg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
  'jasponica-5kg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
  
  // Rice & Groceries - Condiments
  'datu-puti-vinegar': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop',
  'soy-sauce': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop',
  'cooking-oil': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop',
  'tomato-sauce': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop',
  
  // Rice & Groceries - Dry Goods
  'brown-sugar': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'refined-sugar': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'iodized-salt': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'flour': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'cornstarch': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'oatmeal': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'coffee-creamer': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'peanut-butter': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  'mayonnaise': 'https://images.unsplash.com/photo-1581526073911-b9c37aab8865?w=800&h=800&fit=crop',
  
  // Coffee & Drinks - Coffee
  'davao-arabica': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop',
  'barako-coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop',
  'benguet-arabica': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop',
  
  // Coffee & Drinks - Cacao
  'tablea': 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&h=800&fit=crop',
  'cacao-nibs': 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&h=800&fit=crop',
  
  // Coffee & Drinks - Beverages
  'pandan-iced-tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop',
  'buko-juice': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=800&fit=crop',
  'lemongrass-tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop',
  'calamansi-juice': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop',
  'guyabano-juice': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop',
  
  // Coffee & Drinks - Service
  'coffee-cupping': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop',
  
  // Home & Kitchen - Bamboo
  'bamboo-board': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  'bamboo-utensils': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  'bamboo-straw': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  
  // Home & Kitchen - Shell
  'capiz-lamp': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  'coconut-bowl': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  
  // Home & Kitchen - Woven
  'abaca-placemat': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'bayong-bag': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'rattan-basket': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'buri-hat': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'coir-doormat': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  
  // Home & Kitchen - Wooden
  'wooden-ladle': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  'banana-leaf-plate': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  
  // Local Delicacies - Meat
  'pampanga-tocino': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=800&fit=crop',
  'vigan-longganisa': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=800&fit=crop',
  
  // Local Delicacies - Dried
  'dried-mangoes': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop',
  'banana-chips': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop',
  'cassava-chips': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop',
  
  // Local Delicacies - Pastries
  'piaya': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
  'otap': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
  'puto-cheese': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
  'polvoron': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
  
  // Local Delicacies - Cacao
  'tablea-tsokolate': 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&h=800&fit=crop',
  
  // Local Delicacies - Pastries
  'buko-pie': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
  
  // Local Delicacies - Spreads
  'ube-halaya': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&h=800&fit=crop',
  'yema-spread': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&h=800&fit=crop',
  
  // Local Delicacies - Dessert
  'saging-con-yelo': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop',
  'mais-con-yelo': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop',
  
  // Crafts & Souvenirs - Shell
  'shell-keychain': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  'capiz-earrings': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  'coconut-ashtray': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  
  // Crafts & Souvenirs - Bamboo
  'bamboo-tumbler': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  'bamboo-wind-chime': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  
  // Crafts & Souvenirs - Woven
  'abaca-coin-purse': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'woven-bilao': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'abaca-sling-bag': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'buri-fan': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'banig-mat': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  'handwoven-basket': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
  
  // Crafts & Souvenirs - Wooden
  'mini-jeepney': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  'wooden-spoon-set': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
  
  // Category covers
  'fresh-produce': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop',
  'meat-seafood': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&h=800&fit=crop',
  'rice-groceries': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=800&fit=crop',
  'coffee-drinks': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=800&fit=crop',
  'home-kitchen': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&h=800&fit=crop',
  'local-delicacies': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=800&fit=crop',
  'crafts-souvenirs': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200&h=800&fit=crop',
  
  // Vendor avatars
  'mang-juan': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'rose': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'davao': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'cebu': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'pampanga': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
};

// Download image from URL
function downloadImage(url, filename, outputDir) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, filename, outputDir)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${filename}: HTTP ${res.statusCode}`);
        resolve(false);
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve(true);
      });
      
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {}); // Delete incomplete file
        reject(error);
      });
    }).on('error', (error) => {
      console.error(`Error downloading ${filename}:`, error.message);
      resolve(false);
    });
  });
}

// Main function
async function main() {
  console.log('Starting manual image download...');
  console.log(`Found ${Object.keys(MANUAL_IMAGES).length} images to download`);
  
  // Ensure output directories exist
  [PRODUCTS_DIR, CATEGORIES_DIR, AVATARS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Process each image
  for (const [slug, url] of Object.entries(MANUAL_IMAGES)) {
    // Determine output directory
    let outputDir;
    let filename;
    
    if (slug.startsWith('fresh-produce') || slug.startsWith('meat-seafood') || 
        slug.startsWith('rice-groceries') || slug.startsWith('coffee-drinks') ||
        slug.startsWith('home-kitchen') || slug.startsWith('local-delicacies') ||
        slug.startsWith('crafts-souvenirs')) {
      // Category covers
      outputDir = CATEGORIES_DIR;
      filename = `${slug}.jpg`;
    } else if (['mang-juan', 'rose', 'davao', 'cebu', 'pampanga'].includes(slug)) {
      // Vendor avatars
      outputDir = AVATARS_DIR;
      filename = `${slug}.jpg`;
    } else {
      // Product images
      outputDir = PRODUCTS_DIR;
      filename = `${slug}.jpg`;
    }
    
    const filePath = path.join(outputDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (already exists)`);
      continue;
    }
    
    console.log(`Downloading: ${slug} from ${url}`);
    
    // Download the image
    const success = await downloadImage(url, filename, outputDir);
    
    if (!success) {
      console.log(`Failed to download: ${slug}`);
    }
    
    // Add delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\nImage download complete!');
  console.log('Please check the public/products, public/categories, and public/avatars directories.');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MANUAL_IMAGES, downloadImage };
