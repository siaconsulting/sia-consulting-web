import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { PublicationDetailPage } from '@/components/sia/ContentDetails'
import { getSiteSettings } from '@/data/globals'
import { getPublicationBySlug } from '@/data/publications'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getServerSideURL } from '@/utilities/getURL'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const publication = await getPublicationBySlug(slug, isEnabled)
  return createEditorialMetadata({
    title: publication?.meta?.title || publication?.title,
    description: publication?.meta?.description || publication?.excerpt,
    path: getCollectionDetailPath('publications', slug)!,
    image: publication?.meta?.image || publication?.coverImage, settings, noIndex: isEnabled,
  })
}

export default async function PublicationPage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const publication = await getPublicationBySlug(slug, isEnabled)
  if (!publication) return <PayloadRedirects url={getCollectionDetailPath('publications', slug)!} />
  return <>
    <PayloadRedirects disableNotFound url={getCollectionDetailPath('publications', slug)!} />
    {isEnabled && <LivePreviewListener />}
    <PublicationDetailPage publication={publication} canonical={`${getServerSideURL().replace(/\/$/, '')}${getCollectionDetailPath('publications', slug)!}`} />
  </>
}
