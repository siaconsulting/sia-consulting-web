import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { SectorsListing } from '@/components/sia/CatalogListings'
import { getSiteSettings } from '@/data/globals'
import { getSectorsPage } from '@/data/sectors'
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
    title: page > 1 ? `Secteurs — page ${page}` : 'Secteurs',
    description: 'Secteurs d’intervention présentés par SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('sectors')}?page=${page}` : getCollectionListingPath('sectors'),
    settings,
  })
}

export default async function SectorsPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getSectorsPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()

  return <>
    <CatalogPageIntro eyebrow="Où SIA intervient" title="Secteurs" description="Contextes et secteurs d’intervention présentés au catalogue." />
    <SectorsListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
