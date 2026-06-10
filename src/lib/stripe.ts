export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: 'php'
  status: 'requires_payment_method' | 'succeeded' | 'canceled'
  createdAt: number
}

const intents = new Map<string, PaymentIntent>()

function newId(): string {
  return 'pi_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export async function createPaymentIntent(amount: number): Promise<PaymentIntent> {
  const id = newId()
  const intent: PaymentIntent = {
    id,
    clientSecret: `${id}_secret_${Math.random().toString(36).slice(2, 10)}`,
    amount,
    currency: 'php',
    status: 'requires_payment_method',
    createdAt: Date.now(),
  }
  intents.set(id, intent)
  return intent
}

export async function confirmPaymentIntent(
  intentId: string,
  cardNumber: string,
): Promise<{ ok: boolean; error?: string; intent?: PaymentIntent }> {
  const intent = intents.get(intentId)
  if (!intent) return { ok: false, error: 'Payment intent not found' }
  if (intent.status !== 'requires_payment_method') {
    return { ok: false, error: 'Payment already processed' }
  }
  const clean = cardNumber.replace(/\s+/g, '')
  if (clean.length < 13) {
    return { ok: false, error: 'Invalid card number' }
  }
  if (clean === '4000000000000002') {
    return { ok: false, error: 'Your card was declined.' }
  }
  if (clean === '4000000000009995') {
    return { ok: false, error: 'Insufficient funds.' }
  }
  intent.status = 'succeeded'
  intents.set(intent.id, intent)
  return { ok: true, intent }
}

export async function cancelPaymentIntent(intentId: string): Promise<void> {
  const intent = intents.get(intentId)
  if (intent && intent.status === 'requires_payment_method') {
    intent.status = 'canceled'
    intents.set(intent.id, intent)
  }
}

export function getTestCardHints() {
  return {
    success: '4242 4242 4242 4242',
    declined: '4000 0000 0000 0002',
    insufficient: '4000 0000 0000 9995',
  }
}
