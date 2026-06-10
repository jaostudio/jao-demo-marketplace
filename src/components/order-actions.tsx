'use client'

import { useState } from 'react'
import { FileText, Truck, X, Check } from 'lucide-react'

interface OrderActionsProps {
  orderNumber: string
  orderDate: string
  total: number
  name: string | null
  address: string | null
  email: string | null
  paymentState: string
  fulfillmentState: string
  items: { productName: string; quantity: number; priceAtPurchase: number }[]
  vendorName: string
}

function openInvoice(data: OrderActionsProps) {
  const date = new Date(data.orderDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  const totalPhp = (data.total / 100).toFixed(2)
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice #${data.orderNumber}</title><style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 8px 4px; border-bottom: 2px solid #e5e5e5; font-size: 12px; text-transform: uppercase; color: #666; }
    td { padding: 10px 4px; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 8px; }
    .footer { margin-top: 32px; font-size: 12px; color: #999; border-top: 1px solid #e5e5e5; padding-top: 16px; }
  </style></head><body>
    <h1>Invoice</h1>
    <p>Order #${data.orderNumber}</p>
    <p class="meta">${date} &middot; ${data.vendorName}</p>
    <p><strong>Bill to:</strong> ${data.name ?? ' - '}<br>${data.address ?? ''}</p>
    <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>
    ${data.items.map(i => `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>₱${(i.priceAtPurchase / 100).toFixed(2)}</td><td>₱${((i.priceAtPurchase * i.quantity) / 100).toFixed(2)}</td></tr>`).join('')}
    </tbody></table>
    <p class="total">Total: ₱${totalPhp}</p>
    <p><strong>Payment:</strong> ${data.paymentState.replace(/_/g, ' ')}</p>
    <p><strong>Fulfillment:</strong> ${data.fulfillmentState.replace(/_/g, ' ')}</p>
    <div class="footer"><p>Palengkee &middot; Demo invoice &middot; Not a real document</p></div>
  </body></html>`

  const w = window.open('', '_blank')
  if (w) { w.document.write(html); w.document.close() }
}

const TRACKING_STEPS = [
  { label: 'Order confirmed', done: true },
  { label: 'Packing your order', done: true },
  { label: 'Shipped', done: false },
  { label: 'Out for delivery', done: false },
  { label: 'Delivered', done: false },
]

export function OrderActions(props: OrderActionsProps) {
  const [trackingOpen, setTrackingOpen] = useState(false)
  const trackingNum = `PLG-${props.orderNumber.slice(-6).toUpperCase()}`

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => openInvoice(props)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          <FileText className="h-4 w-4" />
          Download Invoice
        </button>
        <button
          onClick={() => setTrackingOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <Truck className="h-4 w-4" />
          Track Order
        </button>
      </div>

      {trackingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setTrackingOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-warm-lg dark:bg-neutral-900" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-100">Tracking</h2>
              <button onClick={() => setTrackingOpen(false)} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 mb-5">
              Tracking #: <span className="font-mono font-medium text-neutral-800 dark:text-neutral-100">{trackingNum}</span>
            </p>
            <div className="space-y-0">
              {TRACKING_STEPS.map((step, i) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      step.done ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                    }`}>
                      {step.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    {i < TRACKING_STEPS.length - 1 && <div className={`w-0.5 flex-1 ${step.done ? 'bg-green-200 dark:bg-green-800' : 'bg-neutral-200 dark:bg-neutral-700'}`} />}
                  </div>
                  <div className={`pb-6 pt-0.5 text-sm ${step.done ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-500'}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-400">* Simulated tracking for demo purposes.</p>
          </div>
        </div>
      )}
    </>
  )
}
