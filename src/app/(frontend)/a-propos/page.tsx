import type { Metadata } from 'next'
import { Container } from '@/components/sia/Container'
import { EditorialBody } from '@/components/sia/EditorialBody'
import { EditorialPageHero } from '@/components/sia/EditorialPageHero'
import { Section } from '@/components/sia/Section'
import { PayloadLink, type PayloadLinkData } from '@/components/Link/PayloadLink'
import RichText from '@/components/RichText'
import { getAboutSettings, getSiteSettings } from '@/data/globals'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getPublicRoutePath } from '@/utilities/publicRoutes'

export async function generateMetadata(): Promise<Metadata> {
  const [about, siteSettings] = await Promise.all([getAboutSettings(), getSiteSettings()])
  return createEditorialMetadata({
    title: about.metaTitle || about.hero?.title || 'À propos',
    description: about.metaDescription || about.hero?.introduction,
    image: about.metaImage,
    path: getPublicRoutePath('about'),
    settings: siteSettings,
  })
}

export default async function AboutPage() {
  const about = await getAboutSettings()
  const hero = about.hero
  const values = about.values ?? []
  const pillars = [
    { title: about.mission?.title || 'Mission', content: about.mission?.content },
    { title: about.vision?.title || 'Vision', content: about.vision?.content },
  ].filter((item) => item.content)

  return <>
    <EditorialPageHero
      eyebrow={hero?.eyebrow || 'SIA Consulting'}
      title={hero?.title || 'À propos'}
      description={hero?.introduction}
      image={hero?.heroImage}
    />
    {about.body && <EditorialBody data={about.body} />}
    {pillars.length > 0 && <Section className="sia-about-pillars"><Container>
      {pillars.map((pillar) => <section key={pillar.title}>
        <h2>{pillar.title}</h2>
        <RichText data={pillar.content!} enableGutter={false} enableProse={false} />
      </section>)}
    </Container></Section>}
    {values.length > 0 && <Section className="sia-about-values"><Container>
      <h2>Valeurs</h2>
      <ul>{values.map((value, index) => <li key={value.id ?? `${value.title}-${index}`}>
        <h3>{value.title}</h3><p>{value.description}</p>
      </li>)}</ul>
    </Container></Section>}
    {about.cta && <Section className="sia-about-cta"><Container>
      <PayloadLink link={about.cta as PayloadLinkData} className="sia-action" />
    </Container></Section>}
  </>
}
