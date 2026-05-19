/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

// Extract { protocol, hostname } from a URL string without throwing
function urlParts(raw) {
  try {
    const u = new URL(raw)
    return { protocol: u.protocol.replace(':', ''), hostname: u.hostname }
  } catch {
    return null
  }
}

// Build remotePatterns dynamically so any VPS domain set in env vars is allowed
const apiUrl     = process.env.NEXT_PUBLIC_API_URL     || 'http://localhost:8000/api'
const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''

const seen = new Set()
const dynamicPatterns = []

for (const url of [apiUrl, storageUrl].filter(Boolean)) {
  const parts = urlParts(url)
  if (parts && parts.hostname !== 'localhost' && !seen.has(parts.hostname)) {
    seen.add(parts.hostname)
    dynamicPatterns.push(parts)
  }
}

const nextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    // Tree-shake large icon/animation packages — reduces bundle by ~30–50 kB
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // Third-party image hosts
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      // Local development
      { protocol: 'http',  hostname: 'localhost' },
      // Any hostname derived from NEXT_PUBLIC_API_URL / NEXT_PUBLIC_STORAGE_URL
      ...dynamicPatterns,
    ],
  },
  async headers() {
    if (isDev) return []
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/:file(favicon.ico|robots.txt|sitemap.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL:           process.env.NEXT_PUBLIC_API_URL           || 'http://localhost:8000/api',
    NEXT_PUBLIC_STORAGE_URL:       process.env.NEXT_PUBLIC_STORAGE_URL       || '',
    NEXT_PUBLIC_HEALTHENGINE_URL:  process.env.NEXT_PUBLIC_HEALTHENGINE_URL  || '',
    NEXT_PUBLIC_GOOGLE_MAPS_KEY:   process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY   || '',
  },
}

module.exports = nextConfig
