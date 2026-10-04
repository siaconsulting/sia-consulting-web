import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/next/preview', '/next/exit-preview'] },
    ],
    sitemap: `${getServerSideURL().replace(/\/$/, '')}/sitemap.xml`,
  }
}
