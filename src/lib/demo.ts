// Demo mode - when true, mocks payments, emails, and external services
export const DEMO_MODE = (process.env.DEMO_MODE ?? 'true') === 'true'

export function assertDemo() {
  if (!DEMO_MODE) throw new Error('This feature is only available in demo mode')
}
