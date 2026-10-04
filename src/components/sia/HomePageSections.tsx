import Image from 'next/image'
import Link from 'next/link'
import type { HomeCaseStudy as HomeCaseStudyData, HomePublication as HomePublicationData, HomeReference as HomeReferenceData, HomeResource as HomeResourceData, HomeSector as HomeSectorData, HomeService as HomeServiceData, HomeTraining as HomeTrainingData } from '@/data/home'
import type { CaseStudy, HomeSetting, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { Container } from '@/components/sia/Container'
import { Eyebrow } from '@/components/sia/Eyebrow'
import { Section } from '@/components/sia/Section'
import { PayloadLink, type PayloadLinkData } from '@/components/Link/PayloadLink'
import { HomeExpertiseShowcase } from '@/components/sia/HomeExpertiseShowcase.client'
import { HomeHeroMotion } from '@/components/sia/HomeHeroMotion.client'
import { Reveal } from '@/components/sia/Reveal.client'
import { populatedMedia } from '@/data/home'
import { getCollectionDetailPath, getCollectionListingPath, type PublicCollection } from '@/utilities/publicRoutes'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getPublicCaseStudyClientLabel } from '@/utilities/homePresentation'

type CTA = NonNullable<NonNullable<HomeSetting['hero']>['primaryCTA']>

const detailHref = (collection: Exclude<PublicCollection, 'references'>, slug: string) =>
  getCollectionDetailPath(collection, slug) ?? getCollectionListingPath(collection)

function HomeCTA({ value, variant = 'solid' }: { value: CTA | null | undefined; variant?: 'solid' | 'outline' }) {
  if (!value?.label) return null
  return <PayloadLink link={value as PayloadLinkData} className={`sia-action sia-action--${variant}`}>
    <span>{value.label}</span><span aria-hidden="true">↗</span>
  </PayloadLink>
}

function HomeMedia({ media, alt, className, priority = false }: { media: number | Media | null | undefined; alt: string; className: string; priority?: boolean }) {
  const image = populatedMedia(media)
  if (!image?.url) return null
  return <div className={`sia-home-media ${className}`}>
    <Image
      src={getMediaUrl(image.url, image.updatedAt)}
      alt={image.alt || alt}
      fill
      sizes="(max-width: 48rem) 100vw, (max-width: 90rem) 55vw, 760px"
      priority={priority}
      className="sia-home-media-image"
    />
  </div>
}

function hasLexicalText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  if ('text' in value && typeof value.text === 'string' && value.text.trim()) return true
  if ('children' in value && Array.isArray(value.children)) return value.children.some(hasLexicalText)
  if ('root' in value) return hasLexicalText(value.root)
  return false
}

function RichContent({ value, className = '' }: { value: CaseStudy['context']; className?: string }) {
  if (!hasLexicalText(value)) return null
  return <div className={`sia-home-rich-text ${className}`}><RichText data={value} enableGutter={false} enableProse={false} /></div>
}

export function HomeHero({ settings, siteName }: { settings: HomeSetting; siteName: string }) {
  const hero = settings.hero
  const title = hero?.title?.trim() || siteName
  const image = populatedMedia(hero?.image)

  return (
    <section className="sia-home-hero" data-home-hero aria-labelledby="home-hero-title">
      <HomeHeroMotion />
      <Container className="sia-home-hero-content">
        {hero?.eyebrow && <Eyebrow className="sia-home-hero-eyebrow">{hero.eyebrow}</Eyebrow>}
        <h1 id="home-hero-title" className="sia-home-hero-title"><span>{title}</span></h1>
        {hero?.description && <p className="sia-home-hero-description">{hero.description}</p>}
        {(hero?.primaryCTA?.label || hero?.secondaryCTA?.label) && (
          <div className="sia-home-hero-actions">
            <HomeCTA value={hero.primaryCTA} />
            <HomeCTA value={hero.secondaryCTA} variant="outline" />
          </div>
        )}
        <span className="sia-home-hero-scroll" aria-hidden="true">Défiler <span>↓</span></span>
      </Container>
      {image?.url && <HomeMedia media={image} alt={title} className="sia-home-hero-image" priority />}
    </section>
  )
}

export function HomeIntroduction({ text, keyFigures }: { text?: string | null; keyFigures?: HomeSetting['keyFigures'] }) {
  const figures = (keyFigures ?? []).filter((figure) => figure.value?.trim() && figure.label?.trim())
  if (!text?.trim() && !figures.length) return null
  return (
    <Section className="sia-home-introduction" aria-label="Présentation de SIA Consulting">
      <Container>
        {text?.trim() && <Reveal className="sia-home-introduction-copy"><Eyebrow>À propos de SIA</Eyebrow><p>{text}</p></Reveal>}
        {figures.length > 0 && <dl className="sia-home-figures">{figures.map((figure, index) => <div key={figure.id ?? `${figure.value}-${index}`}><dt>{figure.label}</dt><dd>{figure.prefix}{figure.value}{figure.suffix}</dd></div>)}</dl>}
      </Container>
    </Section>
  )
}

export function HomeExpertises({ services }: { services: HomeServiceData[] }) {
  if (!services.length) return null
  return (
    <Section id="home-expertises" className="sia-home-expertises" aria-labelledby="home-expertises-title">
      <Container>
        <div className="sia-home-section-heading"><div><Eyebrow>Domaines d’intervention</Eyebrow><h2 id="home-expertises-title">Expertises</h2></div><Link className="sia-text-link" href={getCollectionListingPath('services')}>Toutes les expertises <span aria-hidden="true">↗</span></Link></div>
        <HomeExpertiseShowcase services={services} />
      </Container>
    </Section>
  )
}

export function HomeSectors({ sectors }: { sectors: HomeSectorData[] }) {
  if (!sectors.length) return null
  return (
    <Section id="home-secteurs" className="sia-home-sectors" aria-labelledby="home-sectors-title">
      <Container>
        <div className="sia-home-sector-heading"><Eyebrow>Champs d’intervention</Eyebrow><h2 id="home-sectors-title">Secteurs</h2><p>Les secteurs présentés sont ceux sélectionnés par l’équipe SIA.</p></div>
        <ul className="sia-home-sector-list">{sectors.map((sector, index) => <li key={sector.id}><Link href={detailHref('sectors', sector.slug)}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{sector.title}</strong><span>{sector.shortDescription}</span><span aria-hidden="true">↗</span></Link></li>)}</ul>
      </Container>
    </Section>
  )
}

const formatLabels = { in_person: 'Présentiel', remote: 'À distance', hybrid: 'Hybride' } as const

export function HomeTrainings({ trainings }: { trainings: HomeTrainingData[] }) {
  if (!trainings.length) return null
  return (
    <Section id="home-formations" className="sia-home-trainings" aria-labelledby="home-trainings-title">
      <Container>
        <div className="sia-home-section-heading"><div><Eyebrow>Catalogue</Eyebrow><h2 id="home-trainings-title">Formations</h2></div><Link className="sia-text-link" href={getCollectionListingPath('trainings')}>Voir les formations <span aria-hidden="true">↗</span></Link></div>
        <ul className="sia-home-training-list">{trainings.map((training, index) => <li key={training.id}><Link href={detailHref('trainings', training.slug)}><span className="sia-training-order">{String(index + 1).padStart(2, '0')}</span><span className="sia-training-title">{training.title}</span><span className="sia-training-summary">{training.summary}</span><span className="sia-training-meta">{[training.duration, training.format ? formatLabels[training.format] : null].filter(Boolean).join(' · ')}</span><span className="sia-training-arrow" aria-hidden="true">↗</span></Link></li>)}</ul>
        <p className="sia-home-catalogue-note">Les modalités précises dépendent de la demande et de l’organisation de chaque formation.</p>
      </Container>
    </Section>
  )
}

export function HomeReferences({ references }: { references: HomeReferenceData[] }) {
  const visible = references.filter((reference) => populatedMedia(reference.logo)?.url)
  if (!visible.length) return null
  return (
    <Section id="home-references" className="sia-home-references" aria-labelledby="home-references-title">
      <Container>
        <div className="sia-home-references-heading"><Eyebrow>Organisations présentées publiquement</Eyebrow><h2 id="home-references-title">Références</h2></div>
        <ul className="sia-home-reference-list">{visible.map((reference) => {
          const logo = populatedMedia(reference.logo)!
          return <li key={reference.id}><Image src={getMediaUrl(logo.url, logo.updatedAt)} alt={logo.alt || reference.name} fill sizes="(max-width: 40rem) 42vw, 18vw" className="sia-home-reference-logo" /></li>
        })}</ul>
        <Link className="sia-text-link" href={getCollectionListingPath('references')}>Voir les références <span aria-hidden="true">↗</span></Link>
      </Container>
    </Section>
  )
}

function publicationType(type: HomePublicationData['type']) {
  return ({ article: 'Article', analysis: 'Analyse', technical_note: 'Note technique', news: 'Actualité', opinion: 'Opinion', regulatory_study: 'Étude réglementaire' })[type]
}

function formattedDate(date?: string | null) {
  if (!date) return null
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(parsed)
}

function authorsLabel(authors: HomePublicationData['authors']) {
  const names = (authors ?? []).flatMap((author) => typeof author === 'object' && author && 'name' in author ? [author.name] : [])
  return names.length ? names.join(', ') : null
}

export function HomePublications({ publications }: { publications: HomePublicationData[] }) {
  if (!publications.length) return null
  const [featured, ...secondary] = publications
  const image = populatedMedia(featured.coverImage)
  return (
    <Section id="home-publications" className="sia-home-publications" aria-labelledby="home-publications-title">
      <Container>
        <div className="sia-home-section-heading"><div><Eyebrow>Analyses et perspectives</Eyebrow><h2 id="home-publications-title">Publications</h2></div><Link className="sia-text-link" href={getCollectionListingPath('publications')}>Toutes les publications <span aria-hidden="true">↗</span></Link></div>
        <article className="sia-home-featured-publication">
          <Reveal className="sia-home-publication-art" aria-label={image?.alt || undefined}>
            {image?.url ? <Image src={getMediaUrl(image.url, image.updatedAt)} alt={image.alt || featured.title} fill sizes="(max-width: 64rem) 100vw, 52vw" className="sia-home-publication-image" /> : <span className="sia-home-publication-geometry" aria-hidden="true"><i /><i /></span>}
            <span className="sia-home-publication-type">{publicationType(featured.type)}</span>
          </Reveal>
          <div className="sia-home-publication-copy">
            <p className="sia-home-publication-meta">{[formattedDate(featured.publishedAt), authorsLabel(featured.authors), ...(featured.topics ?? []).map((topic) => topic.label)].filter(Boolean).join(' · ')}</p>
            <h3><Link href={detailHref('publications', featured.slug)}>{featured.title}</Link></h3>
            <p>{featured.excerpt}</p>
            <Link className="sia-text-link" href={detailHref('publications', featured.slug)}>Lire la publication <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
        {secondary.length > 0 && <ol className="sia-home-publication-secondary">{secondary.map((publication) => <li key={publication.id}><Link href={detailHref('publications', publication.slug)}><span>{publicationType(publication.type)}{formattedDate(publication.publishedAt) ? ` · ${formattedDate(publication.publishedAt)}` : ''}</span><strong>{publication.title}</strong><span aria-hidden="true">↗</span></Link></li>)}</ol>}
      </Container>
    </Section>
  )
}

const caseSteps = [
  { key: 'context', label: 'Contexte' },
  { key: 'challenge', label: 'Enjeu' },
  { key: 'approach', label: 'Intervention' },
  { key: 'results', label: 'Résultats' },
] as const

export function HomeCaseStudy({ studies }: { studies: HomeCaseStudyData[] }) {
  const study = studies[0]
  if (!study) return null
  const media = populatedMedia(study.coverImage)
  const clientLabel = getPublicCaseStudyClientLabel(study)
  const visibleSteps = caseSteps.flatMap((step) => hasLexicalText(study[step.key]) ? [step] : [])
  if (!visibleSteps.length) return null
  return (
    <Section id="home-etude-de-cas" className="sia-home-case" aria-labelledby="home-case-title">
      <Container>
        <div className="sia-home-case-header"><div><Eyebrow>Étude de cas</Eyebrow><h2 id="home-case-title">Une mission, du contexte aux résultats.</h2></div><Link className="sia-text-link" href={getCollectionListingPath('case-studies')}>Toutes les études de cas <span aria-hidden="true">↗</span></Link></div>
        <article className="sia-home-case-feature">
          <Reveal className="sia-home-case-visual">
            {media?.url ? <Image src={getMediaUrl(media.url, media.updatedAt)} alt={media.alt || study.title} fill sizes="(max-width: 64rem) 100vw, 42vw" className="sia-home-case-image" /> : <span className="sia-home-case-geometry" aria-hidden="true"><i /><i /></span>}
            {clientLabel && <span className="sia-home-case-client">{clientLabel}</span>}
          </Reveal>
          <div className="sia-home-case-story">
            <h3><Link href={detailHref('case-studies', study.slug)}>{study.title}</Link></h3>
            <p className="sia-home-case-summary">{study.shortDescription}</p>
            {visibleSteps.map(({ key, label }, index) => <Reveal className="sia-home-case-step" key={key}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h4>{label}</h4><RichContent value={study[key]} /></div>
            </Reveal>)}
            {study.metrics?.length ? <ul className="sia-home-case-metrics" aria-label="Indicateurs publiables">{study.metrics.map((metric) => <li key={metric.id ?? `${metric.label}-${metric.value}`}><strong>{metric.value}{metric.unit}</strong><span>{metric.label}</span></li>)}</ul> : null}
            <Link className="sia-text-link" href={detailHref('case-studies', study.slug)}>Découvrir l’étude de cas <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
      </Container>
    </Section>
  )
}

const resourceTypes: Record<HomeResourceData['type'], string> = { brochure: 'Brochure', catalogue: 'Catalogue', report: 'Rapport', note: 'Note', institutional: 'Document institutionnel' }

export function HomeResources({ resources }: { resources: HomeResourceData[] }) {
  if (!resources.length) return null
  return (
    <Section id="home-ressources" className="sia-home-resources" aria-labelledby="home-resources-title">
      <Container>
        <div className="sia-home-section-heading"><div><Eyebrow>À consulter</Eyebrow><h2 id="home-resources-title">Ressources</h2></div><Link className="sia-text-link" href={getCollectionListingPath('resources')}>Toutes les ressources <span aria-hidden="true">↗</span></Link></div>
        <ul className="sia-home-resource-list">{resources.map((resource) => <li key={resource.id}><Link href={detailHref('resources', resource.slug)}><span>{resourceTypes[resource.type]}</span><strong>{resource.title}</strong><span>{resource.shortDescription}</span><span aria-hidden="true">↗</span></Link></li>)}</ul>
      </Container>
    </Section>
  )
}

export function HomeFinalCTA({ value }: { value: HomeSetting['finalCTA'] }) {
  const link = value?.cta
  if (!value?.title && !value?.description && !link?.label) return null
  return (
    <Section className="sia-home-final-cta" aria-labelledby="home-final-cta-title">
      <Container>
        {value?.title && <h2 id="home-final-cta-title">{value.title}</h2>}
        {value?.description && <p>{value.description}</p>}
        {link && <HomeCTA value={link} />}
      </Container>
    </Section>
  )
}
