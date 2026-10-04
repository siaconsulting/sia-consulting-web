import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const configuredServerURL = process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined)
const NEXT_PUBLIC_SERVER_URL = configuredServerURL || (process.env.NODE_ENV === 'production'
  ? undefined
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000')

if (!NEXT_PUBLIC_SERVER_URL) {
  throw new Error('NEXT_PUBLIC_SERVER_URL must be configured for production builds.')
}

const serverURL = new URL(NEXT_PUBLIC_SERVER_URL)
if (process.env.NODE_ENV === 'production' && serverURL.protocol !== 'https:') {
  throw new Error('Production NEXT_PUBLIC_SERVER_URL must use HTTPS.')
}

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [100],
    remotePatterns: [
      {
        hostname: serverURL.hostname,
        protocol: serverURL.protocol.replace(':', '') as 'http' | 'https',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
