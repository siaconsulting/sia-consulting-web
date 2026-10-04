import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactSubmissionForm } from '@/components/sia/PublicSubmissionForms.client'
import { Container } from '@/components/sia/Container'
import { Section } from '@/components/sia/Section'
import { getContactInformation, getSiteSettings } from '@/data/globals'
import { getSubmissionFormRuntime } from '@/services/submissions/formRuntime'
import { getPublicRoutePath } from '@/utilities/publicRoutes'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || settings.shortName || 'SIA Consulting'
  return {
    title: `Contact | ${siteName}`,
    description: `Coordonnées publiques et formulaire de contact de ${siteName}.`,
    alternates: { canonical: new URL(getPublicRoutePath('contact'), getServerSideURL()).toString() },
  }
}

function telHref(value: string) {
  const safe = value.replace(/[^+\d().-]/g, '')
  return safe ? `tel:${safe}` : null
}

export default async function ContactPage() {
  const [contact, settings, security] = await Promise.all([
    getContactInformation(), getSiteSettings(), getSubmissionFormRuntime('contact'),
  ])
  const address = [contact.streetAddress, contact.addressComplement, contact.poBox, [contact.postalCode, contact.city].filter(Boolean).join(' '), contact.region, contact.country].filter(Boolean)
  const socials = (settings.socialNetworks ?? []).filter((item) => item?.url && item.platform)
  const siteName = settings.siteName || settings.shortName || 'SIA Consulting'

  return <div className="sia-request-page sia-contact-page">
    <header className="sia-request-hero"><Container>
      <p className="sia-editorial-eyebrow">Échanger avec {siteName}</p>
      <h1>Contact</h1>
      <p>Transmettez votre demande à notre équipe.</p>
    </Container></header>
    <Section className="sia-contact-content"><Container>
      <div className="sia-contact-layout">
        <aside className="sia-contact-details" aria-label="Coordonnées publiques">
          <h2>Coordonnées</h2>
          {contact.generalEmail && <p><span>E-mail</span><a href={`mailto:${contact.generalEmail}`}>{contact.generalEmail}</a></p>}
          {[contact.primaryPhone, contact.secondaryPhone].filter((phone): phone is string => Boolean(phone?.trim())).map((phone, index) => {
            const href = telHref(phone)
            return <p key={`${phone}-${index}`}><span>{index ? 'Téléphone secondaire' : 'Téléphone'}</span>{href ? <a href={href}>{phone}</a> : <span>{phone}</span>}</p>
          })}
          {address.length > 0 && <div className="sia-contact-address"><h3>Adresse</h3><address>{address.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</address>
            {contact.mapUrl && <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">Voir le plan <span className="sia-visually-hidden">(ouvre un nouvel onglet)</span><span aria-hidden="true"> ↗</span></a>}
          </div>}
          {contact.hours?.trim() && <div className="sia-contact-hours"><h3>Horaires</h3><p>{contact.hours}</p></div>}
          {socials.length > 0 && <nav className="sia-contact-socials" aria-label="Réseaux sociaux">
            <h3>Réseaux sociaux</h3><ul>{socials.map((item) => <li key={`${item.platform}-${item.url}`}><a href={item.url!} target="_blank" rel="noopener noreferrer">{item.platform === 'x' ? 'X' : item.platform[0].toUpperCase() + item.platform.slice(1)} <span className="sia-visually-hidden">(ouvre un nouvel onglet)</span><span aria-hidden="true">↗</span></a></li>)}</ul>
          </nav>}
          <p className="sia-contact-route-note">Vous souhaitez préciser une demande métier ?</p>
          <ul className="sia-contact-request-links">
            <li><Link href={getPublicRoutePath('serviceRequest')}>Demande de prestation</Link></li>
            <li><Link href={getPublicRoutePath('trainingRequest')}>Demande de formation</Link></li>
          </ul>
        </aside>
        <div className="sia-contact-form-wrap"><div className="sia-form-heading"><p className="sia-editorial-eyebrow">Formulaire</p><h2>Votre message</h2></div><ContactSubmissionForm security={security} /></div>
      </div>
    </Container></Section>
  </div>
}
