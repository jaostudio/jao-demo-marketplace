import Link from 'next/link'
import Image from 'next/image'
import { getSessionUser } from '@/lib/auth'
import { getUserConversations } from '@/lib/actions/messages'
import { MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Messages | Palengkee',
  description: 'Your conversations with vendors and buyers.',
  robots: { index: false, follow: false },
}

export default async function MessagesPage() {
  const user = await getSessionUser()
  if (!user) return <p className="p-8 text-center text-neutral-500">Sign in to view messages.</p>

  const conversations = await getUserConversations() as any[]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100">Messages</h1>
        <p className="mt-1 text-sm text-neutral-500">{conversations.length} conversations</p>
      </div>
      <div className="space-y-2">
        {conversations.map((conv) => {
          const other = conv.participantAId === user.id ? conv.participantB : conv.participantA
          const lastMsg = conv.messages[0]
          return (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                {other.avatarUrl ? (
                  <Image src={other.avatarUrl} alt={other.name} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg font-bold text-neutral-500">
                    {other.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-semibold text-neutral-800 dark:text-neutral-100">
                    {other.name}
                  </p>
                  {lastMsg && (
                    <span className="shrink-0 text-xs text-neutral-400">
                      {new Date(lastMsg.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {lastMsg ? (
                  <p className="mt-1 truncate text-sm text-neutral-600 dark:text-neutral-400">
                    {lastMsg.senderId === user.id && 'You: '}
                    {lastMsg.content}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-neutral-400 italic">No messages yet</p>
                )}
              </div>
            </Link>
          )
        })}
        {conversations.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <MessageSquare className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-4 font-serif text-xl font-semibold text-neutral-700 dark:text-neutral-300">
              No conversations yet
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Visit a vendor storefront or product page to start a conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
