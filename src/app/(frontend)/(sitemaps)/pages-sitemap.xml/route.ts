import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCollectionDetailPath, getCollectionListingPath, getPublicRoutePath } from '@/utilities/publicRoutes'
import { getServerSideURL } from '@/utilities/getURL'

const getPublicSitemap = async () => {
    const payload = await getPayload({ config })
    const siteURL = getServerSideURL().replace(/\/$/, '')
    const collectionSlugs = ['services', 'sectors', 'trainings', 'publications', 'case-studies', 'resources', 'team-members', 'references'] as const
    const [pages, ...collections] = await Promise.all([
      payload.find({
        collection: 'pages', overrideAccess: false, draft: false, depth: 0, limit: 1000, pagination: false,
        where: { _status: { equals: 'published' } }, select: { slug: true, updatedAt: true },
      }),
      ...collectionSlugs.map((collection) => payload.find({
        collection, overrideAccess: false, draft: false, depth: 0, limit: 1000, pagination: false,
        where: { _status: { equals: 'published' } }, select: { slug: true, updatedAt: true },
      })),
    ])

    const existingRoutes = [
      {
        loc: `${siteURL}/posts`,
      },
      { loc: `${siteURL}${getPublicRoutePath('contact')}` },
    ]

    const pageRoutes = pages.docs.flatMap((page) => page.slug ? [{
      loc: `${siteURL}${page.slug === 'home' ? '/' : `/${page.slug}`}`,
      ...(page.updatedAt ? { lastmod: page.updatedAt } : {}),
    }] : [])

    const editorialRoutes = collectionSlugs.flatMap((collection, index) => {
      const docs = collections[index].docs
      const listingLastModified = docs.reduce<string | undefined>((latest, doc) =>
        doc.updatedAt && (!latest || doc.updatedAt > latest) ? doc.updatedAt : latest, undefined)
      const listingPath = getCollectionListingPath(collection)
      return [
        { loc: `${siteURL}${listingPath}`, ...(listingLastModified ? { lastmod: listingLastModified } : {}) },
        ...docs.flatMap((doc) => {
          if (!doc.slug) return []
          const detailPath = getCollectionDetailPath(collection, doc.slug)
          return detailPath ? [{ loc: `${siteURL}${detailPath}`, ...(doc.updatedAt ? { lastmod: doc.updatedAt } : {}) }] : []
        }),
      ]
    })

    const unique = new Map([...existingRoutes, ...pageRoutes, ...editorialRoutes].map((item) => [item.loc, item]))
    return [...unique.values()]
}

export async function GET() {
  const sitemap = await getPublicSitemap()

  return getServerSideSitemap(sitemap)
}
