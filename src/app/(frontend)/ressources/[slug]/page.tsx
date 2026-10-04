import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ResourceDetailPage } from '@/components/sia/ContentDetails'
import { getSiteSettings } from '@/data/globals'
import { getResourceBySlug } from '@/data/resources'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const resource = await getResourceBySlug(slug, isEnabled)
  return createEditorialMetadata({
    title: resource?.meta?.title || resource?.title,
    description: resource?.meta?.description || resource?.shortDescription,
    path: getCollectionDetailPath('resources', slug)!,
    image: resource?.meta?.image || resource?.coverImage, settings, noIndex: isEnabled,
  })
}

export default async function ResourcePage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const resource = await getResourceBySlug(slug, isEnabled)
  if (!resource) return <PayloadRedirects url={getCollectionDetailPath('resources', slug)!} />
  return <>
    <PayloadRedirects disableNotFound url={getCollectionDetailPath('resources', slug)!} />
    {isEnabled && <LivePreviewListener />}
    <ResourceDetailPage resource={resource} />
  </>
}
