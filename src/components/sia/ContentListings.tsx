import Image from 'next/image'
import Link from 'next/link'
import type { CaseStudyListingItem } from '@/data/caseStudies'
import type { PublicationListingItem } from '@/data/publications'
import type { ResourceListingItem } from '@/data/resources'
import { Container } from '@/components/sia/Container'
import { EditorialPagination } from '@/components/sia/EditorialPagination'
import { Section } from '@/components/sia/Section'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getCollectionDetailPath, getCollectionListingPath } from '@/utilities/publicRoutes'

export const publicationTypeLabels = {
  article: 'Article', analysis: 'Analyse', technical_note: 'Note technique', news: 'Actualité', opinion: 'Opinion', regulatory_study: 'Étude réglementaire',
} as const

export const resourceTypeLabels = {
  brochure: 'Brochure', catalogue: 'Catalogue', report: 'Rapport', note: 'Note', institutional: 'Document institutionnel',
} as const

export function editorialDate(value?: string | null, fallback?: string | null) {
  const date = value || fallback
  if (!date) return null
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(parsed)
}

function ListingMedia({ image, alt, className = '' }: { image: PublicationListingItem['coverImage'] | CaseStudyListingItem['coverImage'] | ResourceListingItem['coverImage']; alt: string; className?: string }) {
  const media = typeof image === 'object' && image && 'url' in image ? image : null
  return media?.url ? <span className={`sia-content-listing-media ${className}`}>
    <Image src={getMediaUrl(media.url, media.updatedAt)} alt={media.alt || alt} fill sizes="(max-width: 48rem) 100vw, (max-width: 80rem) 50vw, 38vw" />
  </span> : <span className={`sia-content-listing-media sia-content-listing-media--empty ${className}`} aria-hidden="true"><i /><i /></span>
}

function Authors({ authors }: { authors: PublicationListingItem['authors'] }) {
  if (!authors.length) return null
  return <span className="sia-content-authors">{authors.map((author, index) => {
    const href = getCollectionDetailPath('team-members', author.slug)
    return <span key={author.id}>{index > 0 ? ', ' : ''}{href ? <Link href={href}>{author.name}</Link> : author.name}</span>
  })}</span>
}

export function PublicationsListing({ docs, page, totalPages }: { docs: PublicationListingItem[]; page: number; totalPages: number }) {
  const featured = page === 1 ? docs.find((doc) => doc.featured) : undefined
  const secondary = featured ? docs.filter((doc) => doc.id !== featured.id) : docs
  return <>
    <Section className="sia-content-list-section sia-publications-list" aria-label="Publications">
      <Container>
        {!docs.length ? <p className="sia-catalog-empty">Aucune publication n’est actuellement disponible.</p> : <>
          {featured && <article className="sia-publication-featured">
            <Link href={getCollectionDetailPath('publications', featured.slug)!} className="sia-publication-featured-art" aria-label={`Lire : ${featured.title}`}>
              <ListingMedia image={featured.coverImage} alt={featured.title} />
              <span>{publicationTypeLabels[featured.type]}</span>
            </Link>
            <div className="sia-publication-featured-copy">
              <p className="sia-content-meta">{publicationTypeLabels[featured.type]}{editorialDate(featured.publishedAt, featured.createdAt) ? ` · ${editorialDate(featured.publishedAt, featured.createdAt)}` : ''}</p>
              <h2><Link href={getCollectionDetailPath('publications', featured.slug)!}>{featured.title}</Link></h2>
              <p>{featured.excerpt}</p><Authors authors={featured.authors} />
              <Link className="sia-content-read-link" href={getCollectionDetailPath('publications', featured.slug)!}>Lire la publication <span aria-hidden="true">↗</span></Link>
            </div>
          </article>}
          {secondary.length > 0 && <ol className="sia-publication-index">
            {secondary.map((publication) => <li key={publication.id}>
              <article>
                <Link className="sia-publication-index-art" href={getCollectionDetailPath('publications', publication.slug)!} aria-label={`Lire : ${publication.title}`}><ListingMedia image={publication.coverImage} alt={publication.title} /></Link>
                <div className="sia-publication-index-copy">
                  <p className="sia-content-meta">{publicationTypeLabels[publication.type]}{editorialDate(publication.publishedAt, publication.createdAt) ? ` · ${editorialDate(publication.publishedAt, publication.createdAt)}` : ''}</p>
                  <h2><Link href={getCollectionDetailPath('publications', publication.slug)!}>{publication.title}</Link></h2>
                  <p>{publication.excerpt}</p><Authors authors={publication.authors} />
                </div>
              </article>
            </li>)}
          </ol>}
        </>}
      </Container>
    </Section>
    <EditorialPagination path={getCollectionListingPath('publications')} page={page} totalPages={totalPages} />
  </>
}

function visibleClient(study: CaseStudyListingItem) {
  if (study.clientDisclosure === 'anonymous') return study.anonymousClientLabel?.trim() || null
  if (study.clientDisclosure === 'named') return study.clientReference?.name || null
  return null
}

export function CaseStudiesListing({ docs, page, totalPages }: { docs: CaseStudyListingItem[]; page: number; totalPages: number }) {
  return <>
    <Section className="sia-content-list-section sia-case-list" aria-label="Études de cas">
      <Container>
        {!docs.length ? <p className="sia-catalog-empty">Aucune étude de cas n’est actuellement disponible.</p> : <ol>
          {docs.map((study, index) => {
            const client = visibleClient(study)
            const href = getCollectionDetailPath('case-studies', study.slug)!
            return <li key={study.id}><article>
              <span className="sia-case-list-number" aria-hidden="true">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
              <Link href={href} className="sia-case-list-media" aria-label={`Découvrir : ${study.title}`}><ListingMedia image={study.coverImage} alt={study.title} /></Link>
              <div className="sia-case-list-copy">
                {client && <p className="sia-content-meta">{client}</p>}
                <h2><Link href={href}>{study.title}</Link></h2><p>{study.shortDescription}</p>
                {(study.services.length > 0 || study.sectors.length > 0) && <p className="sia-case-taxonomy">{[...study.services.map((item) => item.title), ...study.sectors.map((item) => item.title)].join(' · ')}</p>}
              </div>
              <Link href={href} className="sia-case-list-arrow" aria-label={`Lire l’étude de cas : ${study.title}`}>↗</Link>
            </article></li>
          })}
        </ol>}
      </Container>
    </Section>
    <EditorialPagination path={getCollectionListingPath('case-studies')} page={page} totalPages={totalPages} />
  </>
}

function formatSize(bytes?: number | null) {
  if (typeof bytes !== 'number' || bytes < 0) return null
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(bytes / 1_000_000)} Mo`
}

export function ResourcesListing({ docs, page, totalPages }: { docs: ResourceListingItem[]; page: number; totalPages: number }) {
  return <>
    <Section className="sia-content-list-section sia-resource-list" aria-label="Ressources publiques">
      <Container>
        {!docs.length ? <p className="sia-catalog-empty">Aucune ressource n’est actuellement disponible.</p> : <ol>
          {docs.map((resource) => {
            const href = getCollectionDetailPath('resources', resource.slug)!
            return <li key={resource.id}><article>
              <Link className="sia-resource-list-art" href={href} aria-label={`Consulter : ${resource.title}`}><ListingMedia image={resource.coverImage} alt={resource.title} /></Link>
              <div className="sia-resource-list-copy"><p className="sia-content-meta">{resourceTypeLabels[resource.type]}</p><h2><Link href={href}>{resource.title}</Link></h2><p>{resource.shortDescription}</p></div>
              <div className="sia-resource-file-meta"><span>{resource.file.mimeType?.split('/').pop()?.toUpperCase() || 'Document'}</span>{formatSize(resource.file.filesize) && <span>{formatSize(resource.file.filesize)}</span>}</div>
              <Link className="sia-resource-open" href={href}>Détails <span aria-hidden="true">↗</span></Link>
            </article></li>
          })}
        </ol>}
      </Container>
    </Section>
    <EditorialPagination path={getCollectionListingPath('resources')} page={page} totalPages={totalPages} />
  </>
}
