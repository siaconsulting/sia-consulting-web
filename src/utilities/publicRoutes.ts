import type { CollectionSlug } from 'payload'

/** V1 public routes: one source of truth for editorial URLs. */
export const PUBLIC_PAGES = {
  home: '/',
  about: '/a-propos',
  contact: '/contact',
  search: '/recherche',
  serviceRequest: '/demande-de-service',
  trainingRequest: '/demande-de-formation',
} as const

export const PUBLIC_COLLECTION_ROUTES = {
  services: { listing: '/expertises', detail: true },
  sectors: { listing: '/secteurs', detail: true },
  trainings: { listing: '/formations', detail: true },
  publications: { listing: '/publications', detail: true },
  'case-studies': { listing: '/etudes-de-cas', detail: true },
  'team-members': { listing: '/equipe', detail: true },
  resources: { listing: '/ressources', detail: true },
  references: { listing: '/references', detail: false },
} as const satisfies Partial<Record<CollectionSlug, { listing: string; detail: boolean }>>

export type PublicCollection = keyof typeof PUBLIC_COLLECTION_ROUTES

export const getCollectionListingPath = (collection: PublicCollection): string =>
  PUBLIC_COLLECTION_ROUTES[collection].listing

export const getCollectionDetailPath = (collection: PublicCollection, slug: string): string | null => {
  const route = PUBLIC_COLLECTION_ROUTES[collection]
  if (!route.detail || !slug) return null
  return `${route.listing}/${encodeURIComponent(slug)}`
}

export const getPublicRoutePath = (route: keyof typeof PUBLIC_PAGES): string => PUBLIC_PAGES[route]

export const PUBLIC_COLLECTION_LINKS = [
  { label: 'Expertises', collection: 'services' },
  { label: 'Secteurs', collection: 'sectors' },
  { label: 'Formations', collection: 'trainings' },
  { label: 'Publications', collection: 'publications' },
  { label: 'Études de cas', collection: 'case-studies' },
  { label: 'Ressources', collection: 'resources' },
  { label: 'Équipe', collection: 'team-members' },
  { label: 'Références', collection: 'references' },
] as const satisfies readonly { label: string; collection: PublicCollection }[]

/** Minimal navigation shown only until the Header Global receives its own links. */
export const PUBLIC_PRIMARY_NAV_FALLBACK = [
  { label: 'Expertises', href: getCollectionListingPath('services') },
  { label: 'Secteurs', href: getCollectionListingPath('sectors') },
  { label: 'Formations', href: getCollectionListingPath('trainings') },
  { label: 'Publications', href: getCollectionListingPath('publications') },
  { label: 'À propos', href: getPublicRoutePath('about') },
] as const
