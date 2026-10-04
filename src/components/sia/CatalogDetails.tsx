import Link from 'next/link'
import type { SectorDetail } from '@/data/sectors'
import type { ServiceDetail } from '@/data/services'
import type { TrainingDetail } from '@/data/trainings'
import { ActionLink } from '@/components/sia/Action'
import { Container } from '@/components/sia/Container'
import { EditorialBody } from '@/components/sia/EditorialBody'
import { EditorialPageHero } from '@/components/sia/EditorialPageHero'
import { Section } from '@/components/sia/Section'
import RichText from '@/components/RichText'
import { getCollectionDetailPath, getCollectionListingPath, getPublicRoutePath } from '@/utilities/publicRoutes'

function populated<T extends { _status?: string | null }>(value: number | T): value is T {
  return typeof value === 'object' && value !== null && value._status === 'published'
}

function hasRichTextContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const node = value as { root?: unknown; children?: unknown; text?: unknown; type?: unknown }
  if (typeof node.text === 'string' && node.text.trim()) return true
  if (node.type === 'upload' || node.type === 'block') return true
  if (Array.isArray(node.children) && node.children.some(hasRichTextContent)) return true
  if (node.root) return hasRichTextContent(node.root)
  return false
}

function RichSection({ data, id, title }: { data: Parameters<typeof RichText>[0]['data'] | null | undefined; id?: string; title?: string }) {
  if (!hasRichTextContent(data)) return null
  return <EditorialBody id={id}>{title && <h2>{title}</h2>}<RichText data={data!} enableGutter={false} enableProse={false} /></EditorialBody>
}

function RelatedLinks({ title, links }: { title: string; links: { id: number; title: string; slug: string; description?: string | null; href: string }[] }) {
  if (!links.length) return null
  return <Section className="sia-related-section"><Container>
    <div className="sia-related-heading"><p className="sia-editorial-eyebrow">Pour aller plus loin</p><h2>{title}</h2></div>
    <ul className="sia-related-list">{links.map((link) => <li key={link.id}><Link href={link.href}><span><strong>{link.title}</strong>{link.description && <small>{link.description}</small>}</span><span aria-hidden="true">↗</span></Link></li>)}</ul>
  </Container></Section>
}

function DetailCTA({ title, href = getPublicRoutePath('contact'), label = 'Nous contacter' }: { title: string; href?: string; label?: string }) {
  return <Section className="sia-detail-cta"><Container><div><p className="sia-editorial-eyebrow">Échanger avec SIA Consulting</p><h2>{title}</h2></div><ActionLink href={href} variant="outline">{label} <span aria-hidden="true">↗</span></ActionLink></Container></Section>
}

export function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  const sectors = service.sectors?.filter(populated) ?? []
  const benefits = service.keyBenefits?.filter((item) => item.benefit?.trim()) ?? []
  const deliverables = service.deliverables?.filter((item) => item.deliverable?.trim()) ?? []
  return <article className="sia-detail-page">
    <EditorialPageHero eyebrow="Expertise" title={service.title} description={service.shortDescription} image={service.heroImage} detail breadcrumbs={[{ label: 'Expertises', href: getCollectionListingPath('services') }, { label: service.title }]} />
    {service.introduction && <RichSection data={service.introduction} title="" />}
    <RichSection data={service.body} id="contenu-expertise" />
    {benefits.length > 0 && <Section className="sia-benefits-section"><Container><div className="sia-related-heading"><p className="sia-editorial-eyebrow">Ce que l’intervention vise à apporter</p><h2>Bénéfices clés</h2></div><ul className="sia-benefit-list">{benefits.map((item, index) => <li key={item.id ?? `${item.benefit}-${index}`}><span aria-hidden="true">—</span><p>{item.benefit}</p></li>)}</ul></Container></Section>}
    {deliverables.length > 0 && <Section className="sia-deliverables-section"><Container><div className="sia-related-heading"><p className="sia-editorial-eyebrow">Éléments de mission</p><h2>Livrables</h2></div><ol className="sia-deliverable-list">{deliverables.map((item, index) => <li key={item.id ?? `${item.deliverable}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.deliverable}</strong></li>)}</ol></Container></Section>}
    <RelatedLinks title="Secteurs concernés" links={sectors.map((sector) => ({ id: sector.id, title: sector.title, description: sector.shortDescription, slug: sector.slug, href: getCollectionDetailPath('sectors', sector.slug)! }))} />
    <DetailCTA title="Parlons de votre besoin." href={`${getPublicRoutePath('serviceRequest')}?service=${encodeURIComponent(service.slug)}`} label="Décrire mon besoin" />
  </article>
}

export function SectorDetailPage({ sector }: { sector: SectorDetail }) {
  return <article className="sia-detail-page sia-sector-detail">
    <EditorialPageHero eyebrow="Secteur d’intervention" title={sector.title} description={sector.shortDescription} image={sector.heroImage} detail breadcrumbs={[{ label: 'Secteurs', href: getCollectionListingPath('sectors') }, { label: sector.title }]} />
    {sector.introduction && <RichSection data={sector.introduction} />}
    <RichSection data={sector.body} id="contenu-secteur" />
    <RelatedLinks title="Expertises mobilisées" links={sector.relatedServices.map((service) => ({ id: service.id, title: service.title, description: service.shortDescription, slug: service.slug, href: getCollectionDetailPath('services', service.slug)! }))} />
    <RelatedLinks title="Formations associées" links={sector.relatedTrainings.map((training) => ({ id: training.id, title: training.title, description: training.summary, slug: training.slug, href: getCollectionDetailPath('trainings', training.slug)! }))} />
    <DetailCTA title="Échanger sur ce secteur." />
  </article>
}

const formatLabels: Record<NonNullable<TrainingDetail['format']>, string> = { in_person: 'Présentiel', remote: 'À distance', hybrid: 'Hybride' }

export function TrainingDetailPage({ training }: { training: TrainingDetail }) {
  const services = training.services.filter(populated)
  const sectors = training.sectors.filter(populated)
  const objectives = training.objectives?.filter((item) => item.objective?.trim()) ?? []
  const audiences = training.targetAudience?.filter((item) => item.audience?.trim()) ?? []
  const modules = training.program?.filter((item) => item.title?.trim()) ?? []
  const hasInformation = Boolean(training.code || training.duration || training.format || training.location)

  return <article className="sia-detail-page sia-training-detail">
    <EditorialPageHero eyebrow="Catalogue de formations" title={training.title} description={training.summary} image={training.heroImage} detail breadcrumbs={[{ label: 'Formations', href: getCollectionListingPath('trainings') }, { label: training.title }]} />
    {hasInformation && <Section className="sia-training-facts"><Container><dl>
      {training.code && <div><dt>Code catalogue</dt><dd>{training.code}</dd></div>}
      {training.duration && <div><dt>Durée indicative</dt><dd>{training.duration}</dd></div>}
      {training.format && <div><dt>Format proposé</dt><dd>{formatLabels[training.format]}</dd></div>}
      {training.location && <div><dt>Lieu indicatif</dt><dd>{training.location}</dd></div>}
    </dl><p>Les dates et modalités d’une session sont définies avec l’équipe, selon le besoin.</p></Container></Section>}
    <RichSection data={training.description} id="description-formation" />
    {objectives.length > 0 && <Section className="sia-training-list-section"><Container><div className="sia-related-heading"><p className="sia-editorial-eyebrow">À l’issue de la formation</p><h2>Objectifs</h2></div><ul className="sia-training-bullet-list">{objectives.map((item, index) => <li key={item.id ?? `${item.objective}-${index}`}>{item.objective}</li>)}</ul></Container></Section>}
    {audiences.length > 0 && <Section className="sia-training-audience"><Container><div className="sia-related-heading"><p className="sia-editorial-eyebrow">Public concerné</p><h2>À qui s’adresse cette formation</h2></div><ul>{audiences.map((item, index) => <li key={item.id ?? `${item.audience}-${index}`}>{item.audience}</li>)}</ul></Container></Section>}
    {training.prerequisites?.trim() && <Section className="sia-training-prerequisites"><Container><p className="sia-editorial-eyebrow">Avant la formation</p><h2>Prérequis</h2><p>{training.prerequisites}</p></Container></Section>}
    {modules.length > 0 && <Section className="sia-training-program"><Container><div className="sia-related-heading"><p className="sia-editorial-eyebrow">Contenu pédagogique</p><h2>Programme</h2></div><ol>{modules.map((item, index) => <li key={item.id ?? `${item.title}-${index}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3>{item.description?.trim() && <p>{item.description}</p>}</div></li>)}</ol></Container></Section>}
    <RelatedLinks title="Expertises associées" links={services.map((service) => ({ id: service.id, title: service.title, description: service.shortDescription, slug: service.slug, href: getCollectionDetailPath('services', service.slug)! }))} />
    <RelatedLinks title="Secteurs concernés" links={sectors.map((sector) => ({ id: sector.id, title: sector.title, description: sector.shortDescription, slug: sector.slug, href: getCollectionDetailPath('sectors', sector.slug)! }))} />
    <DetailCTA title="Parlons de votre besoin en formation." href={`${getPublicRoutePath('trainingRequest')}?formation=${encodeURIComponent(training.slug)}`} label="Demander cette formation" />
  </article>
}
