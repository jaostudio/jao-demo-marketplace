const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\Jaoce\\OneDrive\\Documents\\Portfolio contents\\marketplace-demo\\public\\products';

const missing = [
  { slug: 'galunggong-per-kg', color: '#FF8C42', name: 'Galunggong per kg' },
  { slug: 'bangus-deboned', color: '#FF8C42', name: 'Bangus deboned per kg' },
  { slug: 'fresh-tilapia', color: '#FF8C42', name: 'Fresh Tilapia per kg' },
  { slug: 'market-tour', color: '#2E7D32', name: 'Market Tour' },
];

function makeSvg(name, color) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">' +
    '<rect width="800" height="800" fill="' + color + '"/>' +
    '<rect width="800" height="800" fill="url(#g)"/>' +
    '<defs>' +
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="rgba(0,0,0,0.15)"/>' +
    '<stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<circle cx="400" cy="400" r="240" fill="rgba(255,255,255,0.08)"/>' +
    '<text x="400" y="200" font-family="sans-serif" font-size="60" font-weight="bold" fill="rgba(255,255,255,0.2)" text-anchor="middle">PALENGKEE</text>' +
    '<text x="400" y="400" font-family="sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">' + name + '</text>' +
    '</svg>';
}

(async () => {
  for (const m of missing) {
    const svg = makeSvg(m.name, m.color);
    await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(path.join(dir, m.slug + '.jpg'));
    console.log('Generated:', m.slug + '.jpg');
  }
  console.log('Done');
})();
