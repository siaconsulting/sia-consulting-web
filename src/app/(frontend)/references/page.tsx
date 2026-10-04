import type { Metadata } from 'next'
import { CatalogPageIntro } from '@/components/sia/CatalogPageIntro'
import { ReferencesListing } from '@/components/sia/PeopleReferences'
import { getSiteSettings } from '@/data/globals'
import { getPublicReferences } from '@/data/references'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionListingPath } from '@/utilities/publicRoutes'

// The listing is small and must reflect editorial publication changes immediately.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return createEditorialMetadata({
    title: 'Références',
    description: 'Organisations présentées publiquement par SIA Consulting.',
    path: getCollectionListingPath('references'),
    settings,
  })
}

export default async function ReferencesPage() {
  const references = await getPublicReferences()
  return <>
    <CatalogPageIntro eyebrow="Organisations présentées publiquement" title="Références" description="Les organisations présentées ici le sont selon la nature de la relation indiquée." />
    <ReferencesListing references={references} />
  </>
}
