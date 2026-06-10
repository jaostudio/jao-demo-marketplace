import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const PRODUCTS_DIR = join(process.cwd(), 'public', 'products')
if (!existsSync(PRODUCTS_DIR)) mkdirSync(PRODUCTS_DIR, { recursive: true })

// Brand palette — assign by category
const COLORS = {
  'fresh-produce': '#FF8C42',
  'meat-seafood':   '#C45F2A',
  'rice-groceries': '#8B5A2B',
  'coffee-drinks':  '#2E7D32',
  'home-kitchen':   '#A08858',
  'local-delicacies': '#E87A38',
  'crafts-souvenirs': '#DCD2C4',
}
const BG = '#F8F6F2'

// Pull all product slugs from seed to generate only needed images.
// We derive the list from the seed data inline here.
const PRODUCT_FILENAMES = [
  // Fresh Produce (20)
  'galunggong.jpg','bangus.jpg','tilapia.jpg','saging-saba.jpg','carabao-mango.jpg',
  'siling-labuyo.jpg','kamatis.jpg','bawang.jpg','sibuyas.jpg','talong.jpg',
  'kangkong.jpg','calamansi.jpg','ampalaya.jpg','sayote.jpg','repolyo.jpg',
  'luya.jpg','labanos.jpg','mustasa.jpg','sitaw.jpg','patola.jpg',
  // Meat & Seafood (15)
  'pork-kasim.jpg','pork-liempo.jpg','chicken-legs.jpg','beef-bulalo.jpg','hipon.jpg',
  'pusit.jpg','tahong.jpg','alimasag.jpg','frozen-hotdog.jpg','frozen-meatballs.jpg',
  'beef-tapa.jpg','pork-chop.jpg','chicken-wings.jpg','bangus-belly.jpg','tuna-belly.jpg',
  // Rice & Groceries (15)
  'sinandomeng-5kg.jpg','jasponica-5kg.jpg','datu-puti-vinegar.jpg','soy-sauce.jpg','cooking-oil.jpg',
  'brown-sugar.jpg','refined-sugar.jpg','iodized-salt.jpg','flour.jpg','cornstarch.jpg',
  'oatmeal.jpg','coffee-creamer.jpg','peanut-butter.jpg','mayonnaise.jpg','tomato-sauce.jpg',
  // Coffee & Drinks (10)
  'davao-arabica.jpg','barako-coffee.jpg','benguet-arabica.jpg','tablea.jpg','cacao-nibs.jpg',
  'pandan-iced-tea.jpg','buko-juice.jpg','lemongrass-tea.jpg','calamansi-juice.jpg','guyabano-juice.jpg',
  // Home & Kitchen (12)
  'bamboo-board.jpg','capiz-lamp.jpg','abaca-placemat.jpg','coconut-bowl.jpg','bamboo-utensils.jpg',
  'wooden-ladle.jpg','banana-leaf-plate.jpg','bayong-bag.jpg','rattan-basket.jpg','buri-hat.jpg',
  'coir-doormat.jpg','bamboo-straw.jpg',
  // Local Delicacies (15)
  'pampanga-tocino.jpg','vigan-longganisa.jpg','dried-mangoes.jpg','piaya.jpg','otap.jpg',
  'tablea-tsokolate.jpg','puto-cheese.jpg','buko-pie.jpg','ube-halaya.jpg','yema-spread.jpg',
  'polvoron.jpg','banana-chips.jpg','cassava-chips.jpg','saging-con-yelo.jpg','mais-con-yelo.jpg',
  // Crafts & Souvenirs (13)
  'shell-keychain.jpg','bamboo-tumbler.jpg','abaca-coin-purse.jpg','woven-bilao.jpg','mini-jeepney.jpg',
  'capiz-earrings.jpg','wooden-spoon-set.jpg','abaca-sling-bag.jpg','buri-fan.jpg','coconut-ashtray.jpg',
  'bamboo-wind-chime.jpg','banig-mat.jpg','handwoven-basket.jpg',
]

// Helper to pick colour deterministically by category prefix
function pickColor(filename) {
  if (filename.startsWith('galunggong')||filename.startsWith('bangus')||filename.startsWith('tilapia')||filename.startsWith('saging')||filename.startsWith('carabao')||filename.startsWith('siling')||filename.startsWith('kamatis')||filename.startsWith('bawang')||filename.startsWith('sibuyas')||filename.startsWith('talong')||filename.startsWith('kangkong')||filename.startsWith('calamansi')||filename.startsWith('ampalaya')||filename.startsWith('sayote')||filename.startsWith('repolyo')||filename.startsWith('luya')||filename.startsWith('labanos')||filename.startsWith('mustasa')||filename.startsWith('sitaw')||filename.startsWith('patola')) return COLORS['fresh-produce']
  if (filename.startsWith('pork')||filename.startsWith('chicken')||filename.startsWith('beef')||filename.startsWith('hipon')||filename.startsWith('pusit')||filename.startsWith('tahong')||filename.startsWith('alimasag')||filename.startsWith('frozen')||filename.startsWith('bangus-belly')||filename.startsWith('tuna-belly')) return COLORS['meat-seafood']
  if (filename.startsWith('sinandomeng')||filename.startsWith('jasponica')||filename.startsWith('datu-puti')||filename.startsWith('soy-sauce')||filename.startsWith('cooking-oil')||filename.startsWith('brown-sugar')||filename.startsWith('refined-sugar')||filename.startsWith('iodized')||filename.startsWith('flour')||filename.startsWith('cornstarch')||filename.startsWith('oatmeal')||filename.startsWith('coffee-creamer')||filename.startsWith('peanut-butter')||filename.startsWith('mayonnaise')||filename.startsWith('tomato-sauce')) return COLORS['rice-groceries']
  if (filename.startsWith('davao')||filename.startsWith('barako')||filename.startsWith('benguet')||filename.startsWith('tablea')||filename.startsWith('cacao-nibs')||filename.startsWith('pandan')||filename.startsWith('buko-juice')||filename.startsWith('lemongrass')||filename.startsWith('calamansi-juice')||filename.startsWith('guyabano')) return COLORS['coffee-drinks']
  if (filename.startsWith('bamboo-board')||filename.startsWith('capiz-lamp')||filename.startsWith('abaca-placemat')||filename.startsWith('coconut-bowl')||filename.startsWith('bamboo-utensils')||filename.startsWith('wooden-ladle')||filename.startsWith('banana-leaf')||filename.startsWith('bayong')||filename.startsWith('rattan')||filename.startsWith('buri-hat')||filename.startsWith('coir')||filename.startsWith('bamboo-straw')) return COLORS['home-kitchen']
  if (filename.startsWith('pampanga')||filename.startsWith('vigan')||filename.startsWith('dried-mangoes')||filename.startsWith('piaya')||filename.startsWith('otap')||filename.startsWith('tablea-tsokolate')||filename.startsWith('puto')||filename.startsWith('buko-pie')||filename.startsWith('ube')||filename.startsWith('yema')||filename.startsWith('polvoron')||filename.startsWith('banana-chips')||filename.startsWith('cassava-chips')||filename.startsWith('saging-con')||filename.startsWith('mais-con')) return COLORS['local-delicacies']
  return COLORS['crafts-souvenirs']
}

// Generate an SVG badge
function makeSvg(name, color) {
  const lines = []
  let current = ''
  for (const word of name.split(' ')) {
    const test = current ? current + ' ' + word : word
    if (test.length > 18 && current) { lines.push(current); current = word }
    else current = test
  }
  if (current) lines.push(current)
  const fontSize = lines.length > 2 ? 28 : 36
  const lineH = fontSize + 8
  const totalH = lines.length * lineH
  const startY = Math.max(200, 300 - totalH/2 + fontSize/2)
  const textElements = lines.map((l, i) =>
    `<text x="400" y="${startY + i * lineH}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">${escapeXml(l)}</text>`
  ).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="${color}"/>
    <rect width="800" height="800" fill="url(#g)"/>
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0.15)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>
      </linearGradient>
    </defs>
    <circle cx="400" cy="400" r="240" fill="rgba(255,255,255,0.08)"/>
    <text x="400" y="200" font-family="sans-serif" font-size="60" font-weight="bold" fill="rgba(255,255,255,0.2)" text-anchor="middle">PALENGKEE</text>
    ${textElements}
  </svg>`
}

function escapeXml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

let count = 0
for (const filename of PRODUCT_FILENAMES) {
  const name = filename.replace(/\.jpg$/,'').replace(/-/g,' ')
  const color = pickColor(filename)
  const svg = makeSvg(name, color)
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(join(PRODUCTS_DIR, filename))
  count++
  if (count % 20 === 0) console.log(`  Generated ${count}/${PRODUCT_FILENAMES.length}`)
}
console.log(`✅ ${count} product images generated`)
