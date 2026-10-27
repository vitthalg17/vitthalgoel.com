# Migrate vitthalgoel Portfolio to Next.js

## Context
The current portfolio is a single `index.html` page with Tailwind CSS, Alpine.js, and vanilla JS. Migrating to Next.js gives TypeScript support, component organization, automatic image optimization, a proper build pipeline, and the ability to use the React ecosystem going forward. The goal is a pixel-identical rebuild — same design, same animations, same behavior — just in a maintainable React/Next.js structure.

---

## Approach

**Next.js 15 App Router with static export.** No SSR needed — everything is static content or client-side interactivity. `output: 'export'` keeps the same deployment story (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

### Packages to install
```
npx create-next-app@latest vitthalgoel-next --typescript --tailwind --eslint --app
cd vitthalgoel-next
npm install next-themes @next/third-parties @tailwindcss/forms
```

---

## Project Structure

```
vitthalgoel-next/
├── app/
│   ├── layout.tsx          # Root layout: fonts, ThemeProvider, GA, metadata
│   ├── page.tsx            # Single page — assembles all sections
│   ├── globals.css         # Tailwind directives + BB8 CSS + utility classes
│   └── icon.png            # Favicon (copy of v.png)
├── components/
│   ├── BB8Toggle.tsx       # 'use client' — checkbox + next-themes
│   ├── ImageCarousel.tsx   # 'use client' — useEffect setInterval
│   ├── ContactForm.tsx     # 'use client' — Formspree fetch
│   ├── Header.tsx          # Server component
│   ├── Education.tsx       # Server component
│   ├── Projects.tsx        # Server component
│   ├── Languages.tsx       # Server component
│   └── Footer.tsx          # Server component (build-time year)
├── public/images/          # Copy entire images/ directory here
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.js
```

---

## Key Implementation Details

### `next.config.ts`
```ts
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },  // required for static export
}
```

### `app/globals.css`
- Google Fonts `@import` (Inter + Inter Tight)
- `@tailwind base/components/utilities`
- Full BB8 CSS block — cut from `<style>` in `index.html` lines ~48–470, paste verbatim
- `.btn`, `.btn-sm`, `.h1-.h4` from `css/additional-styles/utility-patterns.css`
- Focus ring rules from `css/additional-styles/theme.css`
- `html { scroll-behavior: smooth }` (replaces the JS smooth scroll in `main.js`)

### `tailwind.config.ts`
- Port font families (`inter`, `inter-tight`) from current `tailwind.config.js`
- Keep `darkMode: 'class'`
- Keep `@tailwindcss/forms` plugin

### `app/layout.tsx`
- `next/font/google` for Inter + Inter Tight (eliminates external request)
- `next-themes` `ThemeProvider` with `attribute="class" storageKey="theme-mode"` (same localStorage key as current site — preserves user preference)
- `suppressHydrationWarning` on `<html>` (required for next-themes)
- `GoogleAnalytics` from `@next/third-parties/google` with `gaId="G-QWXZFZKFRB"`
- Full `metadata` export replacing all `<meta>` tags in `index.html`

### `BB8Toggle.tsx` (client)
```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function BB8Toggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div style={{ width: '10.625em', height: '5.625em' }} />

  const isDark = theme === 'dark'
  return (
    <label className="bb8-toggle">
      <input type="checkbox" className="bb8-toggle__checkbox"
        checked={isDark} onChange={() => setTheme(isDark ? 'light' : 'dark')} />
      {/* ...all bb8 divs copied verbatim from index.html... */}
    </label>
  )
}
```
The `mounted` guard prevents hydration mismatch. `next-themes` handles `localStorage` automatically — remove the manual `localStorage.setItem` from `main.js`.

### `ImageCarousel.tsx` (client)
- `useState` for rotation index, `useEffect` with 1500ms interval
- Use `<img>` tags directly (not `next/image`) to avoid `even:`/`odd:` Tailwind selectors breaking on the wrapping `<span>` that `next/image` renders
- Clean up interval on unmount

### `ContactForm.tsx` (client)
- Keep existing Formspree endpoint (`https://formspree.io/f/xblrklqj`)
- `useState` for `'idle' | 'sending' | 'success' | 'error'`
- Same `fetch` POST with `FormData` as current `main.js`
- No Server Actions needed

### `Footer.tsx` (server)
```tsx
export default function Footer() {
  const year = new Date().getFullYear()  // build-time — correct for static deploys
  return <footer>...&copy; {year}...</footer>
}
```

---

## Gotchas

1. **BB8 CSS sibling selectors** (`input:checked + .container .child`) rely on the native checkbox `checked` attribute — these survive the React rewrite unchanged. The BB8 animation and Tailwind dark mode are independent systems wired together only in `BB8Toggle.tsx`.
2. **`suppressHydrationWarning`** on `<html>` is mandatory when using `next-themes`.
3. **Smooth scroll** — add `html { scroll-behavior: smooth }` to `globals.css` and delete the smooth scroll JS from `main.js`. Anchor `href="#contact-section"` just works.
4. **Static export + `next/image`** — set `images: { unoptimized: true }` in `next.config.ts` or builds will fail. Alternatively remove `unoptimized: true` if deploying to Vercel (gets free image optimization).

---

## Implementation Order

1. Scaffold with `create-next-app`, install packages
2. Copy `images/` → `public/images/`
3. Set up `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`
4. Write `app/globals.css` (BB8 CSS block is the bulk of this step)
5. Write `app/layout.tsx` (metadata, ThemeProvider, GA, fonts)
6. Build client components: `BB8Toggle` → `ImageCarousel` → `ContactForm`
7. Build server components: `Header`, `Education`, `Projects`, `Languages`, `Footer`
8. Assemble `app/page.tsx`
9. `npm run dev` — verify theme toggle, carousel, form, GA
10. `npm run build` — verify clean static output in `out/`

---

## Verification

- Theme toggle: switch mode, reload page → preference persists (same localStorage key)
- Carousel: header images cycle every 1.5s
- Dark mode: all sections visually correct in both themes
- Contact form: submit with test data → Formspree dashboard shows submission
- GA: open Network tab → confirm `gtag` requests fire
- Build: `npm run build` succeeds, `out/` directory is a self-contained static site
- Lighthouse: run on both light and dark — aim for same scores as current site
