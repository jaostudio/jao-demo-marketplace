import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL?.startsWith('file:') ? process.env.DATABASE_URL : 'file:./dev.db',
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
