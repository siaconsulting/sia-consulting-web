import Image from 'next/image'
import Link from 'next/link'
import type { PublicReference } from '@/data/references'
import type { TeamMemberDetail, TeamMemberItem } from '@/data/teamMembers'
import { Breadcrumbs } from '@/components/sia/Breadcrumbs'
import { Container } from '@/components/sia/Container'
import { EditorialPagination } from '@/components/sia/EditorialPagination'
import { Section } from '@/components/sia/Section'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getCollectionDetailPath, getCollectionListingPath } from '@/utilities/publicRoutes'
import { editorialDate, publicationTypeLabels } from '@/components/sia/ContentListings'
import RichText from '@/components/RichText'

function media(value: TeamMemberItem['photo'] | PublicReference['logo']) {
  return value && typeof value === 'object' && 'url' in value ? value : null
}

export function TeamMembersListing({ docs, page, totalPages }: { docs: TeamMemberItem[]; page: number; totalPages: number }) {
  return <>
    <Section className="sia-team-list-section" aria-label="Membres de l’équipe">
      <Container>
        {!docs.length ? <p className="sia-catalog-empty">Aucun profil public n’est actuellement disponible.</p> : <ol className="sia-team-list">
          {docs.map((person, index) => {
            const href = getCollectionDetailPath('team-members', person.slug)
            const portrait = media(person.photo)
            return <li key={person.id}>
              <article className="sia-team-list-item">
                <span className="sia-team-index" aria-hidden="true">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
                <Link href={href || getCollectionListingPath('team-members')} className="sia-team-portrait" aria-label={`Profil de ${person.name}`}>
                  {portrait?.url ? <Image src={getMediaUrl(portrait.url, portrait.updatedAt)} alt={portrait.alt || person.name} fill sizes="(max-width: 48rem) 70vw, (max-width: 80rem) 32vw, 25vw" /> : <span aria-hidden="true" className="sia-team-portrait-fallback"><i /><i /></span>}
                </Link>
                <div className="sia-team-list-copy">
                  <p className="sia-editorial-eyebrow">{person.jobTitle}</p>
                  <h2>{href ? <Link href={href}>{person.name}</Link> : person.name}</h2>
                  <p>{person.shortBio}</p>
                  {person.services.length > 0 && <ul className="sia-team-service-links" aria-label={`Expertises de ${person.name}`}>
                    {person.services.map((service) => <li key={service.id}><Link href={getCollectionDetailPath('services', service.slug) || getCollectionListingPath('services')}>{service.title}</Link></li>)}
                  </ul>}
                </div>
                {href && <Link className="sia-team-open" href={href} aria-label={`Voir le profil de ${person.name}`}><span aria-hidden="true">↗</span></Link>}
              </article>
            </li>
          })}
        </ol>}
      </Container>
    </Section>
    <EditorialPagination path={getCollectionListingPath('team-members')} page={page} totalPages={totalPages} />
  </>
}

export function TeamMemberProfile({ person, canonical }: { person: TeamMemberDetail; canonical: string }) {
  const portrait = media(person.photo)
  const publications = person.publications
  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person', name: person.name, jobTitle: person.jobTitle,
    description: person.shortBio, url: canonical,
    ...(portrait?.url ? { image: getMediaUrl(portrait.url, portrait.updatedAt) } : {}),
    ...(person.linkedin ? { sameAs: [person.linkedin] } : {}),
  }
  const json = JSON.stringify(personSchema).replace(/</g, '\\u003c')
  return <article className="sia-team-profile">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
    <header className="sia-team-profile-header"><Container>
      <Breadcrumbs items={[{ label: 'Équipe', href: getCollectionListingPath('team-members') }, { label: person.name }]} />
      <div className="sia-team-profile-hero">
        <div><p className="sia-editorial-eyebrow">{person.jobTitle}</p><h1>{person.name}</h1><p className="sia-team-profile-lead">{person.shortBio}</p>
          <div className="sia-team-profile-contact">
            {person.linkedin && <a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span className="sia-visually-hidden">(ouvre un nouvel onglet)</span><span aria-hidden="true"> ↗</span></a>}
            {person.publicEmail && <a href={`mailto:${person.publicEmail}`}>{person.publicEmail}</a>}
          </div>
        </div>
        <div className="sia-team-profile-photo">
          {portrait?.url ? <Image src={getMediaUrl(portrait.url, portrait.updatedAt)} alt={portrait.alt || person.name} fill priority sizes="(max-width: 48rem) 84vw, 38vw" /> : <span className="sia-team-portrait-fallback" aria-hidden="true"><i /><i /></span>}
        </div>
      </div>
    </Container></header>
    {person.bio && <Section className="sia-team-bio"><Container className="sia-content-rich-layout"><h2>Parcours</h2><div className="sia-content-rich-body"><RichText data={person.bio as Parameters<typeof RichText>[0]['data']} enableGutter={false} enableProse={false} /></div></Container></Section>}
    {person.services.length > 0 && <Section className="sia-team-related-services"><Container>
      <div className="sia-content-related-heading"><p className="sia-editorial-eyebrow">Domaines d’intervention</p><h2>Expertises associées</h2></div>
      <ul>{person.services.map((service) => <li key={service.id}><Link href={getCollectionDetailPath('services', service.slug) || getCollectionListingPath('services')}><span><strong>{service.title}</strong>{service.shortDescription && <small>{service.shortDescription}</small>}</span><span aria-hidden="true">↗</span></Link></li>)}</ul>
    </Container></Section>}
    {publications.length > 0 && <Section className="sia-team-publications"><Container>
      <div className="sia-content-related-heading"><p className="sia-editorial-eyebrow">Contributions</p><h2>Publications de {person.name}</h2></div>
      <ol>{publications.map((publication) => <li key={publication.id}><article>
        <p className="sia-content-meta">{publicationTypeLabels[publication.type]}{editorialDate(publication.publishedAt, publication.createdAt) ? ` · ${editorialDate(publication.publishedAt, publication.createdAt)}` : ''}</p>
        <h3><Link href={getCollectionDetailPath('publications', publication.slug) || getCollectionListingPath('publications')}>{publication.title}</Link></h3>
        <Link className="sia-content-read-link" href={getCollectionDetailPath('publications', publication.slug) || getCollectionListingPath('publications')}>Lire la publication <span aria-hidden="true">↗</span></Link>
      </article></li>)}</ol>
    </Container></Section>}
  </article>
}

const referenceTypes = { client: 'Client', partner: 'Partenaire', institution: 'Institution' } as const

export function ReferencesListing({ references }: { references: PublicReference[] }) {
  return <Section className="sia-references-section" aria-label="Organisations présentées publiquement"><Container>
    {!references.length ? <p className="sia-catalog-empty">Aucune référence n’est actuellement publiée.</p> : <ul className="sia-references-list">
      {references.map((reference) => {
        const logo = media(reference.logo)
        return <li key={reference.id}>
          <article className={logo?.url ? 'sia-reference-item sia-reference-item--logo' : 'sia-reference-item'}>
            <p className="sia-editorial-eyebrow">{referenceTypes[reference.type]}</p>
            {logo?.url && <div className="sia-reference-logo"><Image src={getMediaUrl(logo.url, logo.updatedAt)} alt={logo.alt || reference.name} fill sizes="(max-width: 48rem) 68vw, (max-width: 80rem) 30vw, 22vw" /></div>}
            <h2>{reference.name}</h2>
            {reference.shortDescription && <p className="sia-reference-description">{reference.shortDescription}</p>}
            {reference.sectors.length > 0 && <p className="sia-reference-sectors">{reference.sectors.map((sector) => sector.title).join(' · ')}</p>}
            {reference.website && <a className="sia-reference-website" href={reference.website} target="_blank" rel="noopener noreferrer">Visiter le site <span className="sia-visually-hidden">de {reference.name} (ouvre un nouvel onglet)</span><span aria-hidden="true">↗</span></a>}
          </article>
        </li>
      })}
    </ul>}
  </Container></Section>
}
