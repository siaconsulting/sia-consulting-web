import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { PublicationsListing } from '@/components/sia/ContentListings'
import { getSiteSettings } from '@/data/globals'
import { getPublicationsPage } from '@/data/publications'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionListingPath } from '@/utilities/publicRoutes'

type Props = { searchParams: Promise<{ page?: string | string[] }> }
function parsePage(value?: string | string[]) {
  if (value === undefined) return 1
  if (Array.isArray(value) || !/^[1-9]\d*$/.test(value)) notFound()
  return Number(value)
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [settings, query] = await Promise.all([getSiteSettings(), searchParams])
  const page = parsePage(query.page)
  return createEditorialMetadata({
    title: page > 1 ? `Publications — page ${page}` : 'Publications',
    description: 'Articles, analyses et notes publiés par SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('publications')}?page=${page}` : getCollectionListingPath('publications'), settings,
  })
}

export default async function PublicationsPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getPublicationsPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()
  return <>
    <CatalogPageIntro eyebrow="Analyses et perspectives" title="Publications" description="Articles, analyses et notes publiés par SIA Consulting." />
    <PublicationsListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
