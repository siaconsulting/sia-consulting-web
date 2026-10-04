import type { Metadata } from 'next'
import { getHomePageData } from '@/data/home'
import { getSiteSettings } from '@/data/globals'
import { getServerSideURL } from '@/utilities/getURL'
import { HomeCaseStudy, HomeExpertises, HomeFinalCTA, HomeHero, HomeIntroduction, HomePublications, HomeReferences, HomeResources, HomeSectors, HomeTrainings } from '@/components/sia/HomePageSections'

function mediaURL(media: unknown): string | undefined {
  if (!media || typeof media !== 'object' || !('url' in media) || typeof media.url !== 'string') return undefined
  return media.url.startsWith('http') ? media.url : new URL(media.url, getServerSideURL()).toString()
}

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHomePageData(), getSiteSettings()])
  const siteName = site.siteName || site.shortName || 'SIA Consulting'
  const rawTitle = site.defaultMetaTitle?.trim() || home.settings.hero?.title?.trim() || siteName
  const suffix = site.titleSuffix?.trim()
  const title = suffix && !rawTitle.endsWith(suffix) ? `${rawTitle} | ${suffix}` : rawTitle
  const description = (site.defaultMetaDescription?.trim() || home.settings.hero?.description?.trim() || 'Site institutionnel de SIA Consulting.').slice(0, 300)
  const image = mediaURL(site.defaultSocialImage) || mediaURL(home.settings.hero?.image)
  const canonical = new URL('/', getServerSideURL()).toString()

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName,
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, ...(image ? { images: [image] } : {}) },
  }
}

export default async function HomePage() {
  const [data, site] = await Promise.all([getHomePageData(), getSiteSettings()])
  const siteName = site.siteName || site.shortName || 'SIA Consulting'

  return (
    <>
      <HomeHero settings={data.settings} siteName={siteName} />
      <HomeIntroduction text={data.settings.introduction} keyFigures={data.settings.keyFigures} />
      <HomeExpertises services={data.services} />
      <HomeSectors sectors={data.sectors} />
      <HomeTrainings trainings={data.trainings} />
      <HomeReferences references={data.references} />
      <HomePublications publications={data.publications} />
      <HomeCaseStudy studies={data.caseStudies} />
      <HomeResources resources={data.resources} />
      <HomeFinalCTA value={data.settings.finalCTA} />
    </>
  )
}
