import Image from 'next/image'
import Link from 'next/link'
import type { SectorListingItem } from '@/data/sectors'
import type { ServiceListingItem } from '@/data/services'
import type { TrainingListingItem } from '@/data/trainings'
import { Container } from '@/components/sia/Container'
import { Section } from '@/components/sia/Section'
import { EditorialPagination } from '@/components/sia/EditorialPagination'
import { getCollectionDetailPath, getCollectionListingPath } from '@/utilities/publicRoutes'
import { getMediaUrl } from '@/utilities/getMediaUrl'

function MediaOrGeometry({ image, label }: { image: ServiceListingItem['heroImage'] | SectorListingItem['heroImage'] | TrainingListingItem['heroImage']; label: string }) {
  const media = typeof image === 'object' && image && 'url' in image ? image : null
  return media?.url ? (
    <span className="sia-catalog-media">
      <Image src={getMediaUrl(media.url, media.updatedAt)} alt={media.alt || ''} fill sizes="(max-width: 48rem) 35vw, 18vw" />
    </span>
  ) : <span className="sia-catalog-media sia-catalog-media--empty" aria-hidden="true"><i />{label}</span>
}

export function ServicesListing({ docs, page, totalPages }: { docs: ServiceListingItem[]; page: number; totalPages: number }) {
  return (
    <>
      <Section className="sia-catalog-section" aria-label="Expertises publiées">
        <Container>
          {docs.length ? <ol className="sia-service-index">
            {docs.map((service, index) => {
              const href = getCollectionDetailPath('services', service.slug)!
              const sectors = (service.sectors ?? []).flatMap((sector) => typeof sector === 'object' && sector?._status === 'published' ? [sector.title] : [])
              return <li key={service.id}>
                <Link href={href} className="sia-service-index-link">
                  <span className="sia-service-index-number" aria-hidden="true">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
                  <div className="sia-service-index-copy"><h2>{service.title}</h2><p>{service.shortDescription}</p>{sectors.length > 0 && <span className="sia-catalog-context">{sectors.join(' · ')}</span>}</div>
                  <MediaOrGeometry image={service.heroImage} label="Expertise" />
                  <span className="sia-service-index-arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            })}
          </ol> : <p className="sia-catalog-empty">Aucune expertise n’est actuellement publiée.</p>}
        </Container>
      </Section>
      <EditorialPagination path={getCollectionListingPath('services')} page={page} totalPages={totalPages} />
    </>
  )
}

export function SectorsListing({ docs, page, totalPages }: { docs: SectorListingItem[]; page: number; totalPages: number }) {
  return (
    <>
      <Section className="sia-catalog-section sia-sector-catalog" aria-label="Secteurs publiés">
        <Container>
          {docs.length ? <ol className="sia-sector-index">
            {docs.map((sector, index) => <li key={sector.id}>
              <Link href={getCollectionDetailPath('sectors', sector.slug)!}>
                <span className="sia-sector-index-count" aria-hidden="true">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
                <MediaOrGeometry image={sector.heroImage} label="Secteur" />
                <div><h2>{sector.title}</h2><p>{sector.shortDescription}</p></div>
                <span className="sia-sector-index-arrow" aria-hidden="true">↗</span>
              </Link>
            </li>)}</ol> : <p className="sia-catalog-empty">Aucun secteur n’est actuellement publié.</p>}
        </Container>
      </Section>
      <EditorialPagination path={getCollectionListingPath('sectors')} page={page} totalPages={totalPages} />
    </>
  )
}

const formats: Record<NonNullable<TrainingListingItem['format']>, string> = {
  in_person: 'Présentiel', remote: 'À distance', hybrid: 'Hybride',
}

export function TrainingsListing({ docs, page, totalPages }: { docs: TrainingListingItem[]; page: number; totalPages: number }) {
  return (
    <>
      <Section className="sia-catalog-section sia-training-catalog" aria-label="Catalogue de formations">
        <Container>
          {docs.length ? <ol className="sia-training-index">
            {docs.map((training, index) => <li key={training.id}>
              <Link href={getCollectionDetailPath('trainings', training.slug)!}>
                <span className="sia-training-index-number" aria-hidden="true">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
                <MediaOrGeometry image={training.heroImage} label="Formation" />
                <div className="sia-training-index-copy"><p className="sia-catalog-context">{[training.code, training.duration, training.format ? formats[training.format] : null].filter(Boolean).join(' · ')}</p><h2>{training.title}</h2><p>{training.summary}</p></div>
                <span className="sia-training-index-arrow" aria-hidden="true">↗</span>
              </Link>
            </li>)}</ol> : <p className="sia-catalog-empty">Aucune formation n’est actuellement publiée.</p>}
          <p className="sia-training-catalog-note">Ce catalogue présente des formations, pas un calendrier de sessions.</p>
        </Container>
      </Section>
      <EditorialPagination path={getCollectionListingPath('trainings')} page={page} totalPages={totalPages} />
    </>
  )
}
