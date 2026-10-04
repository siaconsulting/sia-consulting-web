import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ServiceDetailPage } from '@/components/sia/CatalogDetails'
import { getSiteSettings } from '@/data/globals'
import { getServiceBySlug } from '@/data/services'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const service = await getServiceBySlug(slug, isEnabled)
  return createEditorialMetadata({
    title: service?.meta?.title || service?.title,
    description: service?.meta?.description || service?.shortDescription,
    path: getCollectionDetailPath('services', slug)!,
    image: service?.meta?.image || service?.heroImage,
    settings,
    noIndex: isEnabled,
  })
}

export default async function ServicePage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const service = await getServiceBySlug(slug, isEnabled)
  if (!service) return <PayloadRedirects url={getCollectionDetailPath('services', slug)!} />
  return <>
    <PayloadRedirects disableNotFound url={getCollectionDetailPath('services', slug)!} />
    {isEnabled && <LivePreviewListener />}
    <ServiceDetailPage service={service} />
  </>
}
