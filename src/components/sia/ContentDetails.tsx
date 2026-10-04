import Image from 'next/image'
import Link from 'next/link'
import type { CaseStudyDetail } from '@/data/caseStudies'
import type { PublicationDetail } from '@/data/publications'
import type { ResourceDetail } from '@/data/resources'
import { ActionLink } from '@/components/sia/Action'
import { Breadcrumbs } from '@/components/sia/Breadcrumbs'
import { Container } from '@/components/sia/Container'
import { Section } from '@/components/sia/Section'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getCollectionDetailPath, getCollectionListingPath, getPublicRoutePath } from '@/utilities/publicRoutes'
import { editorialDate, publicationTypeLabels, resourceTypeLabels } from '@/components/sia/ContentListings'

function hasLexicalText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const node = value as { root?: unknown; children?: unknown; text?: unknown; type?: unknown }
  if (typeof node.text === 'string' && node.text.trim()) return true
  if (node.type === 'upload' || node.type === 'block') return true
  if (Array.isArray(node.children) && node.children.some(hasLexicalText)) return true
  return node.root ? hasLexicalText(node.root) : false
}

function Cover({ media, alt, variant = '' }: { media: PublicationDetail['coverImage'] | CaseStudyDetail['coverImage'] | ResourceDetail['coverImage']; alt: string; variant?: string }) {
  const image = media && typeof media === 'object' && 'url' in media ? media : null
  return <div className={`sia-content-cover ${variant}`}>
    {image?.url ? <Image src={getMediaUrl(image.url, image.updatedAt)} alt={image.alt || alt} fill priority sizes="(max-width: 48rem) 100vw, (max-width: 80rem) 90vw, 1200px" /> : <span className="sia-content-cover-geometry" aria-hidden="true"><i /><i /></span>}
  </div>
}

function RichSection({ title, data, className = '' }: { title?: string; data: unknown; className?: string }) {
  if (!hasLexicalText(data)) return null
  return <Section className={`sia-content-rich-section ${className}`}>
    <Container className="sia-content-rich-layout">
      {title && <h2>{title}</h2>}
      <div className="sia-content-rich-body"><RichText data={data as Parameters<typeof RichText>[0]['data']} enableGutter={false} enableProse={false} /></div>
    </Container>
  </Section>
}

function RelatedLinks({ title, links }: { title: string; links: { id: number; title: string; description?: string | null; href: string }[] }) {
  if (!links.length) return null
  return <Section className="sia-content-related"><Container>
    <div className="sia-content-related-heading"><p className="sia-editorial-eyebrow">Pour aller plus loin</p><h2>{title}</h2></div>
    <ul>{links.map((item) => <li key={item.id}><Link href={item.href}><span><strong>{item.title}</strong>{item.description && <small>{item.description}</small>}</span><span aria-hidden="true">↗</span></Link></li>)}</ul>
  </Container></Section>
}

function DateLine({ date }: { date: string | null }) {
  return date ? <time className="sia-content-date">{date}</time> : null
}

function ArticleJsonLd({ publication, canonical }: { publication: PublicationDetail; canonical: string }) {
  const date = publication.publishedAt || publication.createdAt
  const schema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: publication.title,
    description: publication.excerpt, datePublished: date, dateModified: publication.updatedAt,
    mainEntityOfPage: canonical,
    ...(publication.authors.length ? { author: publication.authors.map((author) => {
      const url = getCollectionDetailPath('team-members', author.slug)
      return { '@type': 'Person', name: author.name, ...(url ? { url } : {}) }
    }) } : {}),
    ...(publication.topics?.length ? { keywords: publication.topics.map((topic) => topic.label).filter(Boolean) } : {}),
    ...(publication.coverImage && typeof publication.coverImage === 'object' && 'url' in publication.coverImage && publication.coverImage.url ? { image: getMediaUrl(publication.coverImage.url, publication.coverImage.updatedAt) } : {}),
  }
  const json = JSON.stringify(schema).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export function PublicationDetailPage({ publication, canonical }: { publication: PublicationDetail; canonical: string }) {
  const date = editorialDate(publication.publishedAt, publication.createdAt)
  const topics = publication.topics?.filter((topic) => topic.label.trim()) ?? []
  return <article className="sia-content-detail sia-publication-detail">
    <ArticleJsonLd publication={publication} canonical={canonical} />
    <header className="sia-publication-article-header"><Container>
      <Breadcrumbs items={[{ label: 'Publications', href: getCollectionListingPath('publications') }, { label: publication.title }]} />
      <p className="sia-content-type">{publicationTypeLabels[publication.type]}</p>
      <h1>{publication.title}</h1><p className="sia-publication-lead">{publication.excerpt}</p>
      <div className="sia-publication-byline"><DateLine date={date} />{publication.authors.length > 0 && <span>Par {publication.authors.map((author, index) => {
        const href = getCollectionDetailPath('team-members', author.slug)
        return <span key={author.id}>{index ? ', ' : ''}{href ? <Link href={href}>{author.name}</Link> : author.name}</span>
      })}</span>}</div>
    </Container></header>
    {publication.coverImage && <Container className="sia-publication-cover-wrap"><Cover media={publication.coverImage} alt={publication.title} variant="sia-publication-cover" /></Container>}
    <RichSection data={publication.content} className="sia-publication-rich" />
    {(topics.length > 0 || publication.services.length > 0 || publication.sectors.length > 0) && <Section className="sia-publication-taxonomy"><Container>
      {topics.length > 0 && <div><h2>Sujets</h2><ul>{topics.map((topic, index) => <li key={topic.id ?? `${topic.label}-${index}`}>{topic.label}</li>)}</ul></div>}
    </Container></Section>}
    <RelatedLinks title="Expertises liées" links={publication.services.map((service) => ({ id: service.id, title: service.title, description: service.shortDescription, href: getCollectionDetailPath('services', service.slug)! }))} />
    <RelatedLinks title="Secteurs liés" links={publication.sectors.map((sector) => ({ id: sector.id, title: sector.title, description: sector.shortDescription, href: getCollectionDetailPath('sectors', sector.slug)! }))} />
  </article>
}

function hasRichContent(data: unknown) { return hasLexicalText(data) }

const studySections = [
  ['context', 'Contexte'], ['challenge', 'Problématique'], ['approach', 'Approche et intervention'], ['results', 'Résultats'],
] as const

export function CaseStudyDetailPage({ study }: { study: CaseStudyDetail }) {
  const clientLabel = study.clientDisclosure === 'anonymous'
    ? study.anonymousClientLabel?.trim()
    : study.clientDisclosure === 'named' ? study.clientReference?.name : null
  const steps = studySections.flatMap(([key, label], index) => hasRichContent(study[key]) ? [{ key, label, index: index + 1, data: study[key] }] : [])
  return <article className="sia-content-detail sia-case-detail">
    <header className="sia-case-article-header"><Container>
      <Breadcrumbs items={[{ label: 'Études de cas', href: getCollectionListingPath('case-studies') }, { label: study.title }]} />
      <p className="sia-content-type">{clientLabel || 'Étude de cas'}</p><h1>{study.title}</h1><p className="sia-case-lead">{study.shortDescription}</p>
    </Container></header>
    <Container className="sia-case-cover-wrap"><Cover media={study.coverImage} alt={study.title} variant="sia-case-cover" />{clientLabel && <p className="sia-case-client-label">{study.clientDisclosure === 'anonymous' ? 'Organisation anonymisée' : 'Organisation citée'} <strong>{clientLabel}</strong></p>}</Container>
    {steps.length > 0 && <Section className="sia-case-story"><Container>
      <ol>{steps.map((step) => <li key={step.key}><span>{String(step.index).padStart(2, '0')}</span><div><h2>{step.label}</h2><div className="sia-case-rich"><RichText data={step.data as Parameters<typeof RichText>[0]['data']} enableGutter={false} enableProse={false} /></div></div></li>)}</ol>
    </Container></Section>}
    {!!study.metrics?.length && <Section className="sia-case-metrics"><Container><h2>Indicateurs publiables</h2><ul>{study.metrics.map((metric, index) => <li key={metric.id ?? `${metric.label}-${index}`}><strong>{metric.value}{metric.unit || ''}</strong><span>{metric.label}</span></li>)}</ul></Container></Section>}
    <RelatedLinks title="Expertises mobilisées" links={study.services.map((service) => ({ id: service.id, title: service.title, description: service.shortDescription, href: getCollectionDetailPath('services', service.slug)! }))} />
    <RelatedLinks title="Secteurs concernés" links={study.sectors.map((sector) => ({ id: sector.id, title: sector.title, description: sector.shortDescription, href: getCollectionDetailPath('sectors', sector.slug)! }))} />
    <Section className="sia-detail-cta"><Container><div><p className="sia-editorial-eyebrow">Échanger avec SIA Consulting</p><h2>Parlons de votre besoin.</h2></div><ActionLink href={getPublicRoutePath('contact')} variant="outline">Nous contacter <span aria-hidden="true">↗</span></ActionLink></Container></Section>
  </article>
}

function fileSize(bytes: number | null | undefined) {
  return typeof bytes === 'number' && bytes >= 0 ? `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(bytes / 1_000_000)} Mo` : null
}

export function ResourceDetailPage({ resource }: { resource: ResourceDetail }) {
  const media = resource.coverImage && typeof resource.coverImage === 'object' && 'url' in resource.coverImage ? resource.coverImage : null
  const fileUrl = getMediaUrl(resource.file.url, resource.file.updatedAt)
  const localFile = fileUrl.startsWith('/')
  return <article className="sia-content-detail sia-resource-detail">
    <header className="sia-resource-article-header"><Container>
      <Breadcrumbs items={[{ label: 'Ressources', href: getCollectionListingPath('resources') }, { label: resource.title }]} />
      <p className="sia-content-type">{resourceTypeLabels[resource.type]}</p><h1>{resource.title}</h1><p className="sia-resource-lead">{resource.shortDescription}</p>
      <ActionLink href={fileUrl} {...(localFile && resource.file.filename ? { download: resource.file.filename } : {})} className="sia-resource-download">Télécharger le document <span aria-hidden="true">↓</span></ActionLink>
      <p className="sia-resource-file-meta">{resource.file.mimeType?.split('/').pop()?.toUpperCase() || 'Document'}{fileSize(resource.file.filesize) ? ` · ${fileSize(resource.file.filesize)}` : ''}</p>
    </Container></header>
    {media?.url && <Container className="sia-resource-cover-wrap"><Cover media={media} alt={media.alt || resource.title} variant="sia-resource-cover" /></Container>}
    <RelatedLinks title="Expertises associées" links={resource.services.map((service) => ({ id: service.id, title: service.title, description: service.shortDescription, href: getCollectionDetailPath('services', service.slug)! }))} />
    <RelatedLinks title="Secteurs associés" links={resource.sectors.map((sector) => ({ id: sector.id, title: sector.title, description: sector.shortDescription, href: getCollectionDetailPath('sectors', sector.slug)! }))} />
  </article>
}
