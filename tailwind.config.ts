import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

// Ported from the old tailwind.config.js. Kept on Tailwind v3 deliberately:
// the markup being migrated is v3 output, and v4's rewritten engine changes
// enough defaults that a "pixel-identical" port would stop being identical.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        'inter-tight': ['var(--font-inter-tight)', 'sans-serif'],
      },
    },
  },
  plugins: [forms],
}

export default config
