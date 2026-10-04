import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { ServicesListing } from '@/components/sia/CatalogListings'
import { getSiteSettings } from '@/data/globals'
import { getServicesPage } from '@/data/services'
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
    title: page > 1 ? `Expertises — page ${page}` : 'Expertises',
    description: 'Expertises publiées par SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('services')}?page=${page}` : getCollectionListingPath('services'),
    settings,
  })
}

export default async function ServicesPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getServicesPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()

  return <>
    <CatalogPageIntro eyebrow="Ce que SIA fait" title="Expertises" description="Les expertises publiées par SIA Consulting." />
    <ServicesListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
