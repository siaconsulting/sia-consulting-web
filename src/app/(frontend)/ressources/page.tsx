import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { ResourcesListing } from '@/components/sia/ContentListings'
import { getSiteSettings } from '@/data/globals'
import { getResourcesPage } from '@/data/resources'
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
    title: page > 1 ? `Ressources — page ${page}` : 'Ressources',
    description: 'Documents et ressources publics de SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('resources')}?page=${page}` : getCollectionListingPath('resources'), settings,
  })
}

export default async function ResourcesPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getResourcesPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()
  return <>
    <CatalogPageIntro eyebrow="Documents publics" title="Ressources" description="Consultez les documents rendus publics par SIA Consulting." />
    <ResourcesListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
