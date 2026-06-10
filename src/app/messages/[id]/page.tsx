import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getConversation } from '@/lib/actions/messages'
import { MessageForm } from './message-form'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Conversation | Palengkee',
  description: 'View your conversation.',
  robots: { index: false, follow: false },
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return <p className="p-8 text-center text-neutral-500">Sign in to view messages.</p>

  const conversation = await getConversation(id) as any
  if (!conversation) notFound()

  const other = user.id === conversation.participantAId ? conversation.participantB : conversation.participantA

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/messages"
          className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          &larr; Back
        </Link>
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          {other.avatarUrl ? (
            <Image src={other.avatarUrl} alt={other.name} fill sizes="40px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-bold text-neutral-500">
              {other.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-100">{other.name}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        {conversation.messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-400">No messages yet. Send the first message!</p>
        ) : (
          conversation.messages.map((msg: any) => {
            const isMine = msg.senderId === user.id
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`mt-1 text-right text-[10px] ${
                      isMine ? 'text-primary-200' : 'text-neutral-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <MessageForm conversationId={id} />
    </div>
  )
}
