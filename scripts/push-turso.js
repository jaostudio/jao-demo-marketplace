const { createClient } = require('@libsql/client/web')

async function main() {
  const client = createClient({
    url: 'libsql://jao-marketplace-jamesonolitoquit.aws-us-east-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA5MDE2NzIsImlkIjoiMDE5ZThlYmMtN2UwMS03NTBhLTk1ZDQtMWRlZjhkNmZmODM5IiwicmlkIjoiMDIxZWM3YTEtZTkxMC00NjVjLWIwMTQtZTBjNzc5Yzg3MjdjIn0.b9LqU_cbkVJFIxvAFf96dH8PDMrXiZSFRFB-_3d0T36rPdU32aLOSpYwkMZZbunjsKaan2yO43amCQi4d6GzCQ',
  })

  await client.execute(`CREATE TABLE IF NOT EXISTS Bundle (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discountPct INTEGER NOT NULL DEFAULT 10,
    active INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL
  )`)

  await client.execute(`CREATE TABLE IF NOT EXISTS BundleItem (
    id TEXT NOT NULL PRIMARY KEY,
    bundleId TEXT NOT NULL,
    listingId TEXT NOT NULL,
    FOREIGN KEY (bundleId) REFERENCES Bundle(id) ON DELETE CASCADE,
    FOREIGN KEY (listingId) REFERENCES Listing(id) ON DELETE CASCADE
  )`)

  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS BundleItem_bundleId_listingId_key ON BundleItem(bundleId, listingId)`)

  await client.execute(`CREATE TABLE IF NOT EXISTS ListingVariant (
    id TEXT NOT NULL PRIMARY KEY,
    listingId TEXT NOT NULL,
    label TEXT NOT NULL,
    priceAdj INTEGER NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (listingId) REFERENCES Listing(id) ON DELETE CASCADE
  )`)

  await client.execute(`CREATE INDEX IF NOT EXISTS ListingVariant_listingId_idx ON ListingVariant(listingId)`)

  // NextAuth models
  await client.execute(`CREATE TABLE IF NOT EXISTS Account (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )`)

  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS Account_provider_providerAccountId_key ON Account(provider, providerAccountId)`)

  await client.execute(`CREATE TABLE IF NOT EXISTS Session (
    id TEXT NOT NULL PRIMARY KEY,
    sessionToken TEXT NOT NULL UNIQUE,
    userId TEXT NOT NULL,
    expires TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )`)

  await client.execute(`CREATE TABLE IF NOT EXISTS VerificationToken (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TEXT NOT NULL
  )`)

  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS VerificationToken_identifier_token_key ON VerificationToken(identifier, token)`)

  console.log('Tables created successfully')
}

main().catch(console.error)
