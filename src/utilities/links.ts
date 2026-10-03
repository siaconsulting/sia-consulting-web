import { getCollectionDetailPath, getCollectionListingPath, PUBLIC_COLLECTION_LINKS, PUBLIC_PAGES, PUBLIC_COLLECTION_ROUTES, type PublicCollection } from '@/utilities/publicRoutes'

export const INTERNAL_ROUTES = [
  { label: 'Accueil', value: PUBLIC_PAGES.home },
  { label: 'À propos', value: PUBLIC_PAGES.about },
  { label: 'Contact', value: PUBLIC_PAGES.contact },
  { label: 'Recherche', value: PUBLIC_PAGES.search },
  ...PUBLIC_COLLECTION_LINKS.map(({ label, collection }) => ({ label, value: getCollectionListingPath(collection) })),
] as const

type LinkReference = {
  relationTo: string
  value: { slug?: string | null } | string | number
} | null

export type LinkData = {
  type?: 'route' | 'reference' | 'custom' | null
  route?: string | null
  reference?: LinkReference
  url?: string | null
}

export const validateExternalURL = (value: string | null | undefined): true | string => {
  if (!value) return true

  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && url.hostname && !url.username && !url.password) return true
    if (url.protocol === 'mailto:' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.pathname)) return true
    if (url.protocol === 'tel:' && /^[+\d][\d\s().-]{5,}$/.test(decodeURIComponent(url.pathname))) return true
  } catch {
    // Use one validation message for malformed or unsafe URLs.
  }

  return 'Utilisez une URL HTTPS, une adresse e-mail mailto: ou un numéro tel: valide.'
}

export const validateHTTPSURL = (value: string | null | undefined): true | string => {
  if (!value) return true
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && url.hostname && !url.username && !url.password) return true
  } catch {
    // Return the same validation error for malformed and unsafe input.
  }
  return 'Utilisez une URL HTTPS valide.'
}

const isSafeLegacyPath = (value: string) =>
  value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') && !/[\u0000-\u001f]/.test(value)

export const resolveLinkHref = (link: LinkData): string | null => {
  if (link.type === 'route') {
    return INTERNAL_ROUTES.some(({ value }) => value === link.route) ? link.route ?? null : null
  }

  if (link.type === 'custom') {
    if (validateExternalURL(link.url) === true && link.url) return link.url
    // Keep saved template links working; new Payload input accepts external schemes only.
    if (link.url && isSafeLegacyPath(link.url)) return link.url
    return null
  }

  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = link.reference.value.slug
    if (!slug) return null
    if (link.reference.relationTo === 'pages') return slug === 'home' ? '/' : '/' + slug
    if (link.reference.relationTo === 'posts') return `/posts/${encodeURIComponent(slug)}`
    const collection = link.reference.relationTo as PublicCollection
    return Object.prototype.hasOwnProperty.call(PUBLIC_COLLECTION_ROUTES, collection)
      ? getCollectionDetailPath(collection, slug)
      : null
  }

  return null
}
