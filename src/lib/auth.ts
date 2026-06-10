import type { NextAuthOptions } from 'next-auth'
import type { UserRole } from '@prisma/marketplace-client'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { getDemoSession } from './demo-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null
        if (user.suspended) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const t = token as any
        t.id = user.id
        t.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any
        const t = token as any
        u.id = t.id
        u.role = t.role
      }
      return session
    },
  },
}

// =====================================================
// Auth helpers - used by every protected server action
// =====================================================

export type SessionUser = {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string | null
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    const u = session.user as any
    const dbUser = await prisma.user.findUnique({
      where: { id: u.id },
      select: { suspended: true },
    })
    if (dbUser?.suspended) return null
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      image: u.image,
    }
  }
  return getDemoSession()
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireRole(role: UserRole | UserRole[]): Promise<SessionUser> {
  const user = await requireUser()
  const allowed = Array.isArray(role) ? role : [role]
  if (!allowed.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireBuyer(): Promise<SessionUser> {
  return requireRole('BUYER')
}

export async function requireVendor(): Promise<SessionUser> {
  return requireRole('VENDOR')
}

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole('ADMIN')
}

export async function requireVendorOrAdmin(): Promise<SessionUser> {
  return requireRole(['VENDOR', 'ADMIN'])
}
