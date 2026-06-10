export type DemoEmail = 'admin@palengkee.ph' | 'nena@palengkee.ph' | 'isabel@test.ph' | null

export interface DemoUserInfo {
  email: DemoEmail
  label: string
  name: string
  role: string
  avatarUrl: string | null
}

export const DEMO_USERS: DemoUserInfo[] = [
  { email: null, label: 'Not logged in', name: '', role: '', avatarUrl: null },
  { email: 'admin@palengkee.ph', label: 'Admin', name: 'Admin', role: 'ADMIN', avatarUrl: null },
  { email: 'nena@palengkee.ph', label: "Aling Nena (Vendor)", name: "Aling Nena's Fish & Veggies", role: 'VENDOR', avatarUrl: '/avatars/aling-nena.jpg' },
  { email: 'isabel@test.ph', label: 'Isabel (Buyer)', name: 'Isabel Reyes', role: 'BUYER', avatarUrl: null },
]

export function findDemoUser(email: DemoEmail): DemoUserInfo | undefined {
  return DEMO_USERS.find((u) => u.email === email)
}
