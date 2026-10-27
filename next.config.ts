import type { NextConfig } from 'next'

// Everything on this site is static content or client-side interactivity, so
// the page is prerendered at build time and Vercel serves it as static HTML.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The old static site was served from /index.html. Keep sending that URL
      // (and /index) to the homepage, as the old vercel.json cleanUrls did, so
      // Google never sees a second copy of the page.
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      // The project's default Vercel domain served a full duplicate of the
      // site, which Search Console reported as an alternate page. Send it to
      // the real domain instead. Preview deployments use other hostnames, so
      // they are unaffected.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vitthalgoel-com.vercel.app' }],
        destination: 'https://vitthalgoel.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
