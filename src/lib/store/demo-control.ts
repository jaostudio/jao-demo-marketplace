import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEMO_USERS, findDemoUser, type DemoEmail } from '@/lib/demo-users'

export type DemoUserId = DemoEmail

interface DemoControlState {
  simulatedUserId: DemoUserId
  demoUserName: string
  demoUserRole: string
  demoUserAvatar: string | null
  setSimulatedUser: (id: DemoUserId) => void
  reset: () => void
  isSimulated: () => boolean
  simulatedLabel: () => string
}

export const useDemoControl = create<DemoControlState>()(
  persist(
    (set, get) => ({
      simulatedUserId: null,
      demoUserName: '',
      demoUserRole: '',
      demoUserAvatar: null,
      setSimulatedUser: (simulatedUserId) => {
        const info = findDemoUser(simulatedUserId)
        set({
          simulatedUserId,
          demoUserName: info?.name ?? '',
          demoUserRole: info?.role ?? '',
          demoUserAvatar: info?.avatarUrl ?? null,
        })
      },
      reset: () => set({ simulatedUserId: null, demoUserName: '', demoUserRole: '', demoUserAvatar: null }),
      isSimulated: () => get().simulatedUserId !== null,
      simulatedLabel: () => {
        const info = findDemoUser(get().simulatedUserId)
        return info?.label ?? 'Not logged in'
      },
    }),
    {
      name: 'likha-demo-control',
      partialize: (state) => ({
        simulatedUserId: state.simulatedUserId,
        demoUserName: state.demoUserName,
        demoUserRole: state.demoUserRole,
        demoUserAvatar: state.demoUserAvatar,
      }),
    },
  ),
)
