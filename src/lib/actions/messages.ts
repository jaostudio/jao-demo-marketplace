'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getUserConversations() {
  const user = await getSessionUser()
  if (!user) return []

  return prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: user.id }, { participantBId: user.id }],
    },
    include: {
      participantA: { select: { id: true, name: true, avatarUrl: true } },
      participantB: { select: { id: true, name: true, avatarUrl: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getConversation(id: string) {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participantA: { select: { id: true, name: true, avatarUrl: true } },
      participantB: { select: { id: true, name: true, avatarUrl: true } },
      messages: {
        include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  if (!conversation) throw new Error('Conversation not found')
  if (conversation.participantAId !== user.id && conversation.participantBId !== user.id) {
    throw new Error('Forbidden')
  }

  // Mark messages from the other participant as read
  const otherId = conversation.participantAId === user.id ? conversation.participantBId : conversation.participantAId
  await prisma.message.updateMany({
    where: { conversationId: id, senderId: otherId, isRead: false },
    data: { isRead: true },
  })

  return conversation
}

export async function sendMessage(conversationId: string, content: string) {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')
  if (!content.trim()) throw new Error('Message cannot be empty')

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } })
  if (!conversation) throw new Error('Conversation not found')
  if (conversation.participantAId !== user.id && conversation.participantBId !== user.id) {
    throw new Error('Forbidden')
  }

  await prisma.message.create({
    data: { conversationId, senderId: user.id, content: content.trim() },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  })

  const otherId = conversation.participantAId === user.id ? conversation.participantBId : conversation.participantAId

  // Notify the other participant
  await prisma.notification.create({
    data: {
      userId: otherId,
      type: 'message',
      title: `New message from ${user.name}`,
      message: content.trim().length > 100 ? content.trim().slice(0, 97) + '...' : content.trim(),
      link: `/messages/${conversationId}`,
    },
  })

  revalidatePath(`/messages/${conversationId}`)
  return { ok: true }
}

export async function getOrCreateConversation(otherUserId: string, listingId?: string) {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')
  if (otherUserId === user.id) throw new Error('Cannot message yourself')

  // Normalize ordering for unique constraint
  const [aId, bId] = [user.id, otherUserId].sort()

  const existing = await prisma.conversation.findFirst({
    where: {
      participantAId: aId,
      participantBId: bId,
      listingId: listingId ?? null,
    },
  })
  if (existing) return { id: existing.id }

  const conversation = await prisma.conversation.create({
    data: {
      participantAId: aId,
      participantBId: bId,
      listingId: listingId ?? null,
    },
  })

  return { id: conversation.id }
}

export async function getUnreadMessageCount() {
  const user = await getSessionUser()
  if (!user) return 0

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: user.id }, { participantBId: user.id }],
    },
    select: { id: true },
  })

  if (conversations.length === 0) return 0

  const unreadCounts = await prisma.message.groupBy({
    by: ['conversationId'],
    where: {
      conversationId: { in: conversations.map(c => c.id) },
      senderId: { not: user.id },
      isRead: false,
    },
    _count: { id: true },
  })

  return unreadCounts.reduce((sum, g) => sum + g._count.id, 0)
}
