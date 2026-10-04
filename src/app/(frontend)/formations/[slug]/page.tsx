import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { TrainingDetailPage } from '@/components/sia/CatalogDetails'
import { getSiteSettings } from '@/data/globals'
import { getTrainingBySlug } from '@/data/trainings'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const training = await getTrainingBySlug(slug, isEnabled)
  return createEditorialMetadata({
    title: training?.meta?.title || training?.title,
    description: training?.meta?.description || training?.summary,
    path: getCollectionDetailPath('trainings', slug)!,
    image: training?.meta?.image || training?.heroImage,
    settings,
    noIndex: isEnabled,
  })
}

export default async function TrainingPage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const training = await getTrainingBySlug(slug, isEnabled)
  if (!training) return <PayloadRedirects url={getCollectionDetailPath('trainings', slug)!} />
  return <>
    <PayloadRedirects disableNotFound url={getCollectionDetailPath('trainings', slug)!} />
    {isEnabled && <LivePreviewListener />}
    <TrainingDetailPage training={training} />
  </>
}
