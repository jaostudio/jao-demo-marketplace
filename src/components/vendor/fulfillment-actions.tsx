'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { transitionOrderFulfillment } from '@/lib/actions/orders'
import { Loader2, Printer } from 'lucide-react'

interface FulfillmentActionsProps {
  orderId: string
  fulfillmentState: string
  orderNumber: string
  buyerName?: string | null
  buyerEmail?: string | null
  items?: { name: string; quantity: number }[]
}

function openPackingSlip({ orderNumber, buyerName, buyerEmail, items }: { orderNumber: string; buyerName?: string | null; buyerEmail?: string | null; items?: { name: string; quantity: number }[] }) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Packing Slip #${orderNumber}</title><style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 8px 4px; border-bottom: 2px solid #e5e5e5; font-size: 12px; text-transform: uppercase; color: #666; }
    td { padding: 10px 4px; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
    .footer { margin-top: 32px; font-size: 12px; color: #999; border-top: 1px solid #e5e5e5; padding-top: 16px; }
    .checklist { margin-top: 24px; }
    .checklist li { padding: 4px 0; font-size: 14px; }
  </style></head><body>
    <h1>Packing Slip</h1>
    <p>Order #${orderNumber}</p>
    <p class="meta">Ship to: ${buyerName ?? ' - '}${buyerEmail ? ` (${buyerEmail})` : ''}</p>
    <table><thead><tr><th>Item</th><th>Qty</th></tr></thead><tbody>
    ${(items ?? []).map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td></tr>`).join('')}
    </tbody></table>
    <div class="checklist"><p><strong>Packing checklist:</strong></p>
    <ul>${(items ?? []).map(i => `<li>☐ ${i.name} × ${i.quantity}</li>`).join('')}</ul></div>
    <div class="footer"><p>Palengkee &middot; Packing slip &middot; Demo</p></div>
  </body></html>`

  const w = window.open('', '_blank')
  if (w) { w.document.write(html); w.document.close() }
}

export function FulfillmentActions({ orderId, fulfillmentState, orderNumber, buyerName, buyerEmail, items }: FulfillmentActionsProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handle(action: 'process' | 'ship' | 'return_fulfillment') {
    setPending(true)
    try {
      await transitionOrderFulfillment(orderId, action)
      router.refresh()
    } catch {
      setPending(false)
    }
  }

  if (fulfillmentState === 'UNFULFILLED') {
    return (
      <button
        onClick={() => handle('process')}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
      >
        {pending && <Loader2 className="h-3 w-3 animate-spin" />}
        Process
      </button>
    )
  }

  if (fulfillmentState === 'PROCESSING') {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handle('ship')}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3 w-3 animate-spin" />}
          Mark shipped
        </button>
        <button
          onClick={() => openPackingSlip({ orderNumber, buyerName, buyerEmail, items })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Printer className="h-3 w-3" />
          Slip
        </button>
      </div>
    )
  }

  if (fulfillmentState === 'FULFILLED') {
    return (
      <div className="flex items-center gap-1">
        <span className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Delivered
        </span>
        <button
          onClick={() => openPackingSlip({ orderNumber, buyerName, buyerEmail, items })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Printer className="h-3 w-3" />
          Slip
        </button>
      </div>
    )
  }

  if (fulfillmentState === 'RETURNED') {
    return (
      <span className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Returned
      </span>
    )
  }

  return null
}
