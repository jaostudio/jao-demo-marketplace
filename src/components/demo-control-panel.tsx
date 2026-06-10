'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useDemoControl, type DemoUserId } from '@/lib/store/demo-control'
import { DEMO_USERS } from '@/lib/demo-users'
import { Sun, Moon, Zap, X, User as UserIcon, Monitor } from 'lucide-react'
import { toast } from 'sonner'

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=86400`
}

function clearCookie() {
  document.cookie = 'demo_user_email=; path=/; max-age=0'
}

export function DemoControlPanel() {
  const { simulatedUserId, setSimulatedUser, simulatedLabel } = useDemoControl()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem('demo_tooltip_seen')) {
      localStorage.setItem('demo_tooltip_seen', '1')
      setTimeout(() => {
        toast.info('Demo mode - tap the orange button to switch users, change theme, or try Tagalog.')
      }, 1500)
      setPulse(true)
      setTimeout(() => setPulse(false), 10000)
    }
  }, [])

  const handleUserSwitch = (email: DemoUserId) => {
    setSimulatedUser(email)
    if (email) {
      setCookie('demo_user_email', email)
    } else {
      clearCookie()
    }
    window.location.reload()
  }

  const collapsedLabel = simulatedLabel()

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {expanded ? (
        <div className="w-64 rounded-2xl border border-neutral-200 bg-white shadow-warm-lg dark:border-neutral-700 dark:bg-neutral-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              <Zap className="h-4 w-4 text-amber-500" />
              Demo Controls
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Current state badge */}
          {mounted && collapsedLabel !== 'Not logged in' && (
            <div className="border-b border-neutral-100 px-4 py-2 dark:border-neutral-800">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Zap className="h-3 w-3" />
                {collapsedLabel}
              </span>
            </div>
          )}

          {/* User simulation */}
          <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <UserIcon className="h-4 w-4 text-primary-500" />
              Simulate User
            </div>
            <select
              value={simulatedUserId ?? ''}
              onChange={(e) => handleUserSwitch((e.target.value || null) as DemoUserId)}
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {DEMO_USERS.filter((u) => u.label !== 'Not logged in').map((u) => (
                <option key={u.label} value={u.email ?? ''}>
                  {u.label}
                </option>
              ))}
              <option value="">Not logged in</option>
            </select>
          </div>

          {/* Quick theme toggle */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <Monitor className="h-4 w-4 text-primary-500" />
                Theme
              </div>
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 block dark:hidden" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className={`flex items-center gap-2 rounded-xl bg-primary-500 px-3 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg ${pulse ? 'animate-pulse' : ''}`}
        >
          <Zap className="h-3.5 w-3.5" />
          {mounted && collapsedLabel !== 'Not logged in' ? collapsedLabel : 'Demo'}
        </button>
      )}
    </div>
  )
}
