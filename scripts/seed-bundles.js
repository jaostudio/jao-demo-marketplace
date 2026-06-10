const { createClient } = require('@libsql/client/web')

async function main() {
  const client = createClient({
    url: 'libsql://jao-marketplace-jamesonolitoquit.aws-us-east-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA5MDE2NzIsImlkIjoiMDE5ZThlYmMtN2UwMS03NTBhLTk1ZDQtMWRlZjhkNmZmODM5IiwicmlkIjoiMDIxZWM3YTEtZTkxMC00NjVjLWIwMTQtZTBjNzc5Yzg3MjdjIn0.b9LqU_cbkVJFIxvAFf96dH8PDMrXiZSFRFB-_3d0T36rPdU32aLOSpYwkMZZbunjsKaan2yO43amCQi4d6GzCQ',
  })

  // Find listing IDs by slug
  const listings = await client.execute("SELECT id, slug, title FROM Listing WHERE slug IN ('inabel-blanket-twin', 'kalinga-wrap-skirt', 'tboli-tnalak-cloth', 'sagada-arabica-250g', 'barako-250g', 'benguet-250g')")
  const listingMap = new Map()
  for (const row of listings.rows) {
    listingMap.set(row.slug, row.id)
  }

  // Bundle 1: Textile Lover's Bundle
  const b1 = await client.execute("INSERT INTO Bundle (id, title, description, discountPct, active, createdAt, updatedAt) VALUES (lower(hex(randomblob(16))), 'Textile Lover''s Bundle', 'Save 15% when you buy the Inabel Blanket, Kalinga Wrap Skirt, and T''boli T''nalak Cloth together. Perfect for bringing Filipino weaving traditions into your home.', 15, 1, datetime('now'), datetime('now')) RETURNING id")
  const b1Id = b1.rows[0].id
  for (const slug of ['inabel-blanket-twin', 'kalinga-wrap-skirt', 'tboli-tnalak-cloth']) {
    const lid = listingMap.get(slug)
    if (lid) await client.execute("INSERT INTO BundleItem (id, bundleId, listingId) VALUES (lower(hex(randomblob(16))), ?, ?)", [b1Id, lid])
  }
  console.log('Bundle 1 created:', b1Id)

  // Bundle 2: Coffee Connoisseur Bundle
  const b2 = await client.execute("INSERT INTO Bundle (id, title, description, discountPct, active, createdAt, updatedAt) VALUES (lower(hex(randomblob(16))), 'Coffee Connoisseur Bundle', 'Taste three of the Philippines'' finest single-origin coffees — Sagada Arabica, Batangas Barako, and Benguet — at 12% off the individual prices.', 12, 1, datetime('now'), datetime('now')) RETURNING id")
  const b2Id = b2.rows[0].id
  for (const slug of ['sagada-arabica-250g', 'barako-250g', 'benguet-250g']) {
    const lid = listingMap.get(slug)
    if (lid) await client.execute("INSERT INTO BundleItem (id, bundleId, listingId) VALUES (lower(hex(randomblob(16))), ?, ?)", [b2Id, lid])
  }
  console.log('Bundle 2 created:', b2Id)

  console.log('Seeding complete')
}

main().catch(console.error)
