// scripts/download-all-pexels.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { parse } = require('csv-parse/sync');

const MAPPING_CSV = path.join(process.cwd(), 'pexels-mapping.csv');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'products');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function downloadImages() {
  if (!fs.existsSync(MAPPING_CSV)) {
    console.error(`❌ CSV file not found: ${MAPPING_CSV}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(MAPPING_CSV, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  console.log(`📦 Found ${records.length} product mappings.`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const record of records) {
    const { slug, pexels_id } = record;
    if (!pexels_id || pexels_id.trim() === '') {
      console.warn(`⚠️  Skipping ${slug}: no Pexels ID`);
      skipped++;
      continue;
    }

    const url = `https://images.pexels.com/photos/${pexels_id}/pexels-photo-${pexels_id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`;
    const outputPath = path.join(OUTPUT_DIR, `${slug}.jpg`);

    try {
      await downloadFile(url, outputPath);
      success++;
    } catch (err) {
      console.error(`❌ Failed ${slug} (ID: ${pexels_id}): ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Downloads complete:`);
  console.log(`   Success:  ${success}`);
  console.log(`   Failed:   ${failed}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Total:    ${success + failed + skipped}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

downloadImages().catch(console.error);
