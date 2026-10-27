import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'
import './cursors.css'
import './venom-button.css'

// Self-hosted at build time, so the old fonts.googleapis.com request is gone.
// These variables are what tailwind.config.ts points `font-inter` and
// `font-inter-tight` at.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const DESCRIPTION =
  "Personal website of Vitthal Goel, an AI student pursuing a Bachelor's degree in Noida, India. Explore my projects, skills, and journey in the field of Artificial Intelligence."

export const metadata: Metadata = {
  metadataBase: new URL('https://vitthalgoel.com/'),
  title: 'Vitthal Goel',
  description: DESCRIPTION,
  keywords: [
    'Vitthal Goel',
    'AI student',
    'Artificial Intelligence',
    'Noida',
    'India',
    'personal website',
    "Bachelor's degree",
  ],
  authors: [{ name: 'Vitthal Goel' }],
  alternates: { canonical: 'https://vitthalgoel.com/' },
  icons: {
    icon: [
      { url: '/images/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/v.png', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Vitthal Goel | AI Student & Aspiring Professional',
    description:
      "Explore the personal website of Vitthal Goel, an AI student pursuing a Bachelor's degree in Noida, India. Discover my projects, skills, and passion for Artificial Intelligence.",
    type: 'website',
    url: 'https://vitthalgoel.com/',
    locale: 'en_IN',
    siteName: "Vitthal Goel's Personal Website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitthal Goel | AI Student & Aspiring Professional',
    description:
      "Discover the journey of Vitthal Goel, an AI student pursuing a Bachelor's degree in Noida, India. Explore projects and insights in Artificial Intelligence.",
  },
}

// Carried over verbatim from the <script type="application/ld+json"> block.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vitthal Goel',
  url: 'https://vitthalgoel.com/',
  image: 'https://vitthalgoel.com/images/unnamed.jpg',
  jobTitle: 'Software & AI Engineer',
  description:
    "Personal website of Vitthal Goel, an AI student pursuing a Bachelor's degree in Noida, India.",
  sameAs: [
    'https://github.com/vitthalg17',
    'https://www.linkedin.com/in/vitthalgoel/',
    'https://twitter.com/vitthal_goel',
  ],
}

// The old site stored the theme as '0' | '1' under `theme-mode`; next-themes
// stores 'light' | 'dark' under the same key. Without this translation every
// returning visitor's saved preference would be unreadable and silently reset
// on first load. Runs in <head>, ahead of the script next-themes renders into
// <body>, so it lands before that value is read — and it is a no-op once the
// key holds a next-themes value.
const LEGACY_THEME_MIGRATION = `try{var k='theme-mode',v=localStorage.getItem(k);if(v==='0'||v==='1'){localStorage.setItem(k,v==='1'?'dark':'light')}}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is required by next-themes: it writes the theme
    // class onto <html> before React hydrates, which would otherwise be
    // reported as a server/client mismatch.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LEGACY_THEME_MIGRATION }} />
      </head>
      <body
        className={`${inter.variable} ${interTight.variable} font-inter antialiased bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100 tracking-tight`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-QWXZFZKFRB" />
    </html>
  )
}
