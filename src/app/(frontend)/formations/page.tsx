import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { TrainingsListing } from '@/components/sia/CatalogListings'
import { getSiteSettings } from '@/data/globals'
import { getTrainingsPage } from '@/data/trainings'
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
    title: page > 1 ? `Formations — page ${page}` : 'Formations',
    description: 'Catalogue des formations publiées par SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('trainings')}?page=${page}` : getCollectionListingPath('trainings'),
    settings,
  })
}

export default async function TrainingsPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getTrainingsPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()

  return <>
    <CatalogPageIntro eyebrow="Catalogue" title="Formations" description="Catalogue des formations proposées. Les dates et modalités de session sont définies selon le besoin." />
    <TrainingsListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
