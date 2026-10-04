import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import type { ContactInformation, Footer as FooterData, Media } from '@/payload-types'
import { getContactInformation, getFooterData, getSiteSettings } from '@/data/globals'
import { PayloadLink, type PayloadLinkData } from '@/components/Link/PayloadLink'
import { PUBLIC_PAGES } from '@/utilities/publicRoutes'

const platformIcon = {
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
} as const

function mediaValue(media: number | Media | null | undefined): Media | undefined {
  return typeof media === 'object' && media !== null ? media : undefined
}

function addressText(contact: ContactInformation) {
  return [contact.streetAddress, contact.addressComplement, contact.poBox, [contact.postalCode, contact.city].filter(Boolean).join(' '), contact.region, contact.country]
    .filter((value): value is string => Boolean(value?.trim()))
}

function OldFooterLinks({ footer }: { footer: FooterData }) {
  const links = footer.navItems ?? []
  if (!links.length) return null
  return (
    <nav className="sia-footer-nav" aria-label="Navigation de pied de page">
      {links.map(({ link }, index) => <PayloadLink key={`${link.label}-${index}`} link={link as PayloadLinkData} />)}
    </nav>
  )
}

export async function Footer() {
  const [footer, siteSettings, contact] = await Promise.all([
    getFooterData(),
    getSiteSettings(),
    getContactInformation(),
  ])

  const logo = mediaValue(siteSettings.logo ?? siteSettings.logoDark)
  const siteName = siteSettings.siteName || siteSettings.shortName || 'SIA Consulting'
  const address = addressText(contact)
  const networks = footer.showSocialNetworks === false ? [] : siteSettings.socialNetworks ?? []
  const columns = footer.navigationColumns ?? []
  const hasContact = footer.showContactInformation !== false && Boolean(
    contact.generalEmail || contact.primaryPhone || contact.secondaryPhone || address.length || contact.hours,
  )
  const contactTarget = contact.generalEmail
    ? `mailto:${contact.generalEmail}`
    : contact.primaryPhone
      ? `tel:${contact.primaryPhone.replace(/[^+\d]/g, '')}`
      : PUBLIC_PAGES.contact

  return (
    <footer className="sia-footer" aria-labelledby="sia-footer-title">
      <div className="sia-footer-geometry" aria-hidden="true" />
      <div className="sia-footer-shell">
        <div className="sia-footer-topline">
          <Link className="sia-brand-link" href="/" aria-label={`${siteName} — accueil`}>
            {logo?.url ? (
              <Image src={logo.url} alt="" width={logo.width || 180} height={logo.height || 64} unoptimized />
            ) : (
              <span className="sia-wordmark">{siteName}</span>
            )}
          </Link>
          {contact.hours && footer.showContactInformation !== false && <p>{contact.hours}</p>}
        </div>

        <h2 className="sia-footer-title" id="sia-footer-title">Contact</h2>
        <p className="sia-footer-intro">Pour toute demande, retrouvez les coordonnées publiques de SIA Consulting.</p>
        <Link className="sia-footer-action" href={contactTarget} aria-label="Accéder aux coordonnées de contact">
          Nous joindre <span aria-hidden="true">↗</span>
        </Link>

        <div className="sia-footer-lower">
          {hasContact && (
            <address className="sia-footer-contact" id="footer-contact">
              <p className="sia-eyebrow">Coordonnées</p>
              {contact.generalEmail && <p><a href={`mailto:${contact.generalEmail}`}>{contact.generalEmail}</a></p>}
              {contact.primaryPhone && <p><a href={`tel:${contact.primaryPhone.replace(/[^+\d]/g, '')}`}>{contact.primaryPhone}</a></p>}
              {contact.secondaryPhone && <p><a href={`tel:${contact.secondaryPhone.replace(/[^+\d]/g, '')}`}>{contact.secondaryPhone}</a></p>}
              {address.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
              {contact.mapUrl && <p><a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">Voir le plan (nouvel onglet)</a></p>}
            </address>
          )}

          <div className="sia-footer-columns">
            {columns.map((column, index) => (
              <div className="sia-footer-column" key={`${column.title}-${index}`}>
                <h3>{column.title}</h3>
                <nav className="sia-footer-nav" aria-label={column.title}>
                  {(column.links ?? []).map(({ link }, linkIndex) => (
                    <PayloadLink key={`${link.label}-${linkIndex}`} link={link as PayloadLinkData} />
                  ))}
                </nav>
              </div>
            ))}
            {!columns.length && <OldFooterLinks footer={footer} />}
          </div>

          <nav className="sia-footer-social" aria-label="Réseaux sociaux">
            {networks.map(({ platform, url }) => {
              const Icon = platformIcon[platform as keyof typeof platformIcon]
              const label = platform === 'x' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)
              return (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} (nouvel onglet)`}>
                  {Icon ? <Icon aria-hidden="true" size={18} strokeWidth={1.7} /> : <span aria-hidden="true">X</span>}
                  <span className="sia-sr-only">{label}</span>
                </a>
              )
            })}
          </nav>

          {footer.legalLinks?.length ? (
            <nav className="sia-footer-legal" aria-label="Liens légaux">
              {footer.legalLinks.map(({ link }, index) => <PayloadLink key={`${link.label}-${index}`} link={link as PayloadLinkData} />)}
            </nav>
          ) : null}
        </div>

        <div className="sia-footer-bottom">
          <p>© {new Date().getFullYear()} {siteSettings.copyrightName || siteName}</p>
          {networks.length > 0 && <p className="sia-footer-social-label">Réseaux sociaux de SIA Consulting</p>}
        </div>
      </div>
    </footer>
  )
}
