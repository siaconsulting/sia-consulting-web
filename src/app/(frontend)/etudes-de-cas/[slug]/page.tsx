import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { CaseStudyDetailPage } from '@/components/sia/ContentDetails'
import { getSiteSettings } from '@/data/globals'
import { getCaseStudyBySlug } from '@/data/caseStudies'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const study = await getCaseStudyBySlug(slug, isEnabled)
  // Metadata deliberately uses only the case-study document. Reference data is never a fallback.
  return createEditorialMetadata({
    title: study?.meta?.title || study?.title,
    description: study?.meta?.description || study?.shortDescription,
    path: getCollectionDetailPath('case-studies', slug)!,
    image: study?.meta?.image || study?.coverImage, settings, noIndex: isEnabled,
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const study = await getCaseStudyBySlug(slug, isEnabled)
  if (!study) return <PayloadRedirects url={getCollectionDetailPath('case-studies', slug)!} />
  return <>
    <PayloadRedirects disableNotFound url={getCollectionDetailPath('case-studies', slug)!} />
    {isEnabled && <LivePreviewListener />}
    <CaseStudyDetailPage study={study} />
  </>
}
