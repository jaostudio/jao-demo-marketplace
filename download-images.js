const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const CATEGORIES_DIR = path.join(__dirname, 'public', 'categories');
const AVATARS_DIR = path.join(__dirname, 'public', 'avatars');

// CSV parsing function
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}

// Download image from Unsplash
async function downloadFromUnsplash(query, filename, outputDir) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`;
    
    const options = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };
    
    https.get(searchUrl, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            const imageUrl = result.results[0].urls.regular; // 1080px width
            downloadImage(imageUrl, filename, outputDir)
              .then(resolve)
              .catch(reject);
          } else {
            console.log(`No results for query: ${query}`);
            resolve(false);
          }
        } catch (error) {
          console.error(`Error parsing response for ${query}:`, error.message);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.error(`Error fetching ${query}:`, error.message);
      resolve(false);
    });
  });
}

// Download image from URL
function downloadImage(url, filename, outputDir) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, filename, outputDir)
          .then(resolve)
          .catch(reject);
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
      reject(error);
    });
  });
}

// Main function
async function main() {
  // Read CSV file
  const csvPath = path.join(__dirname, 'image-mapping.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath);
    process.exit(1);
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const mappings = parseCSV(csvContent);
  
  console.log(`Found ${mappings.length} products to process`);
  
  // Ensure output directories exist
  [PRODUCTS_DIR, CATEGORIES_DIR, AVATARS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Process each mapping
  for (const mapping of mappings) {
    const { slug, category, search_keywords, notes } = mapping;
    
    // Determine output directory based on category
    let outputDir;
    if (category === 'fresh-produce' || category === 'meat-seafood' || 
        category === 'rice-groceries' || category === 'coffee-drinks' ||
        category === 'home-kitchen' || category === 'local-delicacies' ||
        category === 'crafts-souvenirs') {
      outputDir = PRODUCTS_DIR;
    } else {
      outputDir = PRODUCTS_DIR; // Default to products
    }
    
    // Create filename
    const filename = `${slug}.jpg`;
    const filePath = path.join(outputDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (already exists)`);
      continue;
    }
    
    console.log(`Processing: ${slug} - ${search_keywords}`);
    
    // Download from Unsplash
    const success = await downloadFromUnsplash(search_keywords, filename, outputDir);
    
    if (!success) {
      console.log(`Failed to download: ${slug}`);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Image download complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { parseCSV, downloadFromUnsplash, downloadImage };
