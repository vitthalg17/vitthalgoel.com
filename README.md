# vitthalgoel.com

Personal website of Vitthal Goel, built with [Next.js](https://nextjs.org) (App Router), React, TypeScript and Tailwind CSS v3, deployed on Vercel.

## Getting started

Requires Node.js 24.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Layout

- `app/` — the page, root layout (metadata, fonts, theme, analytics) and stylesheets
  - `globals.css` — Tailwind, the site's own styles, the BB-8 toggle and the Star Wars easter egg
  - `cursors.css` — the site-wide arrow and hand cursors
  - `venom-button.css` — the goo "Available For Internships" button
- `components/` — one component per section, plus the interactive pieces
  (`BB8Toggle`, `StarWarsProvider`, `Hyperspace`, `VenomButton`, `ContactForm`, …)
- `lib/venom-button.js` — the WebGL scene behind the Venom button
- `public/` — images, `robots.txt`, `sitemap.xml`
- `legacy_vitthalgoel.com/` — the previous static HTML site, kept for reference; it isn't built or served

## Easter eggs

- Hover the profile picture to preview the Star Wars theme, click to keep it, click again (or press Escape) to leave. Typing `star` toggles it too.
- The BB-8 switch toggles light and dark mode, and also exits the Star Wars theme.
