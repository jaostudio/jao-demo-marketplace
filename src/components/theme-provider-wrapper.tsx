'use client'

import { ThemeProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

if (!(console as any)._themeSuppressed) {
  ;(console as any)._themeSuppressed = true
  const _origError = console.error
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Encountered a script tag while rendering React component')
    ) {
      return
    }
    _origError.apply(console, args)
  }
}

export function ThemeProviderWrapper(props: ThemeProviderProps) {
  return <ThemeProvider {...props} />
}
