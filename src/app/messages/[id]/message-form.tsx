'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage } from '@/lib/actions/messages'
import { Send, Loader2 } from 'lucide-react'

export function MessageForm({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState('')
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || pending) return
    setPending(true)
    try {
      await sendMessage(conversationId, content)
      setContent('')
      router.refresh()
    } catch {
      // ignore
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
      />
      <button
        type="submit"
        disabled={!content.trim() || pending}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
    </form>
  )
}
