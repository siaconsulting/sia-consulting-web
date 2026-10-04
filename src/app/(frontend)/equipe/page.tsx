import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { TeamMembersListing } from '@/components/sia/PeopleReferences'
import { getSiteSettings } from '@/data/globals'
import { getTeamMembersPage } from '@/data/teamMembers'
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
    title: page > 1 ? `Équipe — page ${page}` : 'Équipe',
    description: 'Profils professionnels publiés par SIA Consulting.',
    path: page > 1 ? `${getCollectionListingPath('team-members')}?page=${page}` : getCollectionListingPath('team-members'),
    settings,
  })
}

export default async function TeamPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page)
  const result = await getTeamMembersPage(page)
  if (page > Math.max(result.totalPages, 1)) notFound()
  return <>
    <CatalogPageIntro eyebrow="SIA Consulting" title="Équipe" description="Les profils professionnels de SIA Consulting." />
    <TeamMembersListing docs={result.docs} page={page} totalPages={result.totalPages} />
  </>
}
