const { createClient } = require('@libsql/client/web')

async function main() {
  const client = createClient({
    url: 'libsql://jao-marketplace-jamesonolitoquit.aws-us-east-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA5MDE2NzIsImlkIjoiMDE5ZThlYmMtN2UwMS03NTBhLTk1ZDQtMWRlZjhkNmZmODM5IiwicmlkIjoiMDIxZWM3YTEtZTkxMC00NjVjLWIwMTQtZTBjNzc5Yzg3MjdjIn0.b9LqU_cbkVJFIxvAFf96dH8PDMrXiZSFRFB-_3d0T36rPdU32aLOSpYwkMZZbunjsKaan2yO43amCQi4d6GzCQ',
  })

  // Get listing IDs by slug
  const inabel = await client.execute("SELECT id FROM Listing WHERE slug = 'inabel-blanket-twin'")
  if (inabel.rows.length === 0) { console.log('inabel-blanket-twin not found'); return }
  const inabelId = inabel.rows[0].id

  const bag = await client.execute("SELECT id FROM Listing WHERE slug = 'cordillera-shoulder-bag'")
  if (bag.rows.length === 0) { console.log('cordillera-shoulder-bag not found'); return }
  const bagId = bag.rows[0].id

  // Create variants
  await client.execute(`INSERT INTO ListingVariant (id, listingId, label, priceAdj, stock) VALUES ('var_inabel_twin', '${inabelId}', 'Twin', 0, 5)`)
  await client.execute(`INSERT INTO ListingVariant (id, listingId, label, priceAdj, stock) VALUES ('var_inabel_queen', '${inabelId}', 'Queen', 80000, 3)`)
  await client.execute(`INSERT INTO ListingVariant (id, listingId, label, priceAdj, stock) VALUES ('var_inabel_king', '${inabelId}', 'King', 150000, 2)`)

  await client.execute(`INSERT INTO ListingVariant (id, listingId, label, priceAdj, stock) VALUES ('var_bag_brown', '${bagId}', 'Brown', 0, 10)`)
  await client.execute(`INSERT INTO ListingVariant (id, listingId, label, priceAdj, stock) VALUES ('var_bag_black', '${bagId}', 'Black', 0, 7)`)
  await client.execute(`INSERT INTO ListingVariant (id, listingId, label, priceAdj, stock) VALUES ('var_bag_tan', '${bagId}', 'Tan', 0, 4)`)

  console.log('Variants seeded to Turso successfully')
}

main().catch(console.error)
