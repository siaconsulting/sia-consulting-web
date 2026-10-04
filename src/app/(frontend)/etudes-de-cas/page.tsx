import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { CaseStudiesListing } from '@/components/sia/ContentListings'
import { getSiteSettings } from '@/data/globals'
import { getCaseStudiesPage } from '@/data/caseStudies'
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
    title: page > 1 ? `Études de cas — page ${page}` : 'Études de cas',
    description: 'Études de cas publiées par SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('case-studies')}?page=${page}` : getCollectionListingPath('case-studies'), settings,
  })
}

export default async function CaseStudiesPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getCaseStudiesPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()
  return <>
    <CatalogPageIntro eyebrow="Missions publiables" title="Études de cas" description="Des contextes, des problématiques et des interventions présentés à partir des informations publiables." />
    <CaseStudiesListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
