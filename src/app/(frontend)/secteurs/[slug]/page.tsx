import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { SectorDetailPage } from '@/components/sia/CatalogDetails'
import { getSiteSettings } from '@/data/globals'
import { getSectorBySlug } from '@/data/sectors'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const sector = await getSectorBySlug(slug, isEnabled)
  return createEditorialMetadata({
    title: sector?.meta?.title || sector?.title,
    description: sector?.meta?.description || sector?.shortDescription,
    path: getCollectionDetailPath('sectors', slug)!,
    image: sector?.meta?.image || sector?.heroImage,
    settings,
    noIndex: isEnabled,
  })
}

export default async function SectorPage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const sector = await getSectorBySlug(slug, isEnabled)
  if (!sector) return <PayloadRedirects url={getCollectionDetailPath('sectors', slug)!} />
  return <>
    <PayloadRedirects disableNotFound url={getCollectionDetailPath('sectors', slug)!} />
    {isEnabled && <LivePreviewListener />}
    <SectorDetailPage sector={sector} />
  </>
}
