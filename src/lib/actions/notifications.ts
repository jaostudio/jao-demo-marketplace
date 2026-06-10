'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  link: string | null
  createdAt: Date
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const user = await getSessionUser()
  if (!user) return []

  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, type: true, title: true, message: true, isRead: true, link: true, createdAt: true },
  })
}

export async function getUnreadCount(): Promise<number> {
  const user = await getSessionUser()
  if (!user) return 0

  return prisma.notification.count({
    where: { userId: user.id, isRead: false },
  })
}

export async function markAsRead(id: string) {
  const user = await getSessionUser()
  if (!user) return

  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { isRead: true },
  })
}

export async function markAllAsRead() {
  const user = await getSessionUser()
  if (!user) return

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  })
}
