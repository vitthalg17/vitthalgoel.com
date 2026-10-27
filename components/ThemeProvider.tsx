'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      // Same key the old site used, so a returning visitor's preference is
      // still found (see the legacy migration script in app/layout.tsx).
      storageKey="theme-mode"
      // The old site read `localStorage['theme-mode'] || '0'` and defaulted to
      // light no matter what the OS preferred, so system detection stays off —
      // enabling it here would change behaviour for anyone on a dark-themed OS
      // who had never touched the toggle.
      defaultTheme="light"
      enableSystem={false}
      // Deliberately NOT using disableTransitionOnChange: it injects a global
      // `transition: none !important` for one frame while the class flips, and
      // the BB8 toggle's whole animation is a transition that fires on exactly
      // that frame — so it would swallow the animation every switch.
    >
      {children}
    </NextThemesProvider>
  )
}
