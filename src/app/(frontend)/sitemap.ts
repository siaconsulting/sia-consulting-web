import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PUBLIC_COLLECTION_ROUTES, PUBLIC_PAGES, type PublicCollection } from '@/utilities/publicRoutes'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

const sitemapCollections = Object.keys(PUBLIC_COLLECTION_ROUTES) as PublicCollection[]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const baseURL = getServerSideURL().replace(/\/$/, '')
  const staticPages = [PUBLIC_PAGES.home, PUBLIC_PAGES.about, PUBLIC_PAGES.contact]
  const collections = await Promise.all(sitemapCollections.map((collection) => payload.find({
    collection,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: { slug: true, updatedAt: true },
  })))

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({ url: `${baseURL}${path}` }))
  const contentEntries: MetadataRoute.Sitemap = sitemapCollections.flatMap((collection, index) => {
    const docs = collections[index].docs
    const latestUpdatedAt = docs.reduce<string | undefined>((latest, doc) =>
      doc.updatedAt && (!latest || doc.updatedAt > latest) ? doc.updatedAt : latest, undefined)
    const listing = {
      url: `${baseURL}${PUBLIC_COLLECTION_ROUTES[collection].listing}`,
      ...(latestUpdatedAt ? { lastModified: latestUpdatedAt } : {}),
    }
    const details = docs.flatMap((doc) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : ''
      if (!slug || !PUBLIC_COLLECTION_ROUTES[collection].detail) return []
      return [{
        url: `${baseURL}${PUBLIC_COLLECTION_ROUTES[collection].listing}/${encodeURIComponent(slug)}`,
        ...(doc.updatedAt ? { lastModified: doc.updatedAt } : {}),
      }]
    })
    return [listing, ...details]
  })

  return [...new Map([...staticEntries, ...contentEntries].map((entry) => [entry.url, entry])).values()]
}
