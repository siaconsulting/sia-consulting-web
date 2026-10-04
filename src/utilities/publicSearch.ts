import { SIA_SEARCH_COLLECTIONS } from '@/search/fieldOverrides'

export type PublicSearchType = (typeof SIA_SEARCH_COLLECTIONS)[number]

export const PUBLIC_SEARCH_TYPE_LABELS: Record<PublicSearchType, string> = {
  services: 'Expertise',
  sectors: 'Secteur',
  trainings: 'Formation',
  publications: 'Publication',
  'case-studies': 'Étude de cas',
  resources: 'Ressource',
}

export const SEARCH_QUERY_MAX_LENGTH = 120
export const SEARCH_QUERY_MIN_LENGTH = 2
export const SEARCH_RESULTS_PER_PAGE = 10

export function normalizeSearchQuery(value: string | string[] | undefined): { query: string; truncated: boolean } {
  const raw = Array.isArray(value) ? value[0] : value
  const normalized = typeof raw === 'string' ? raw.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/gu, ' ').trim() : ''
  const characters = Array.from(normalized)

  return {
    query: characters.slice(0, SEARCH_QUERY_MAX_LENGTH).join(''),
    truncated: characters.length > SEARCH_QUERY_MAX_LENGTH,
  }
}

export function parsePublicSearchType(value: string | string[] | undefined): PublicSearchType | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  return SIA_SEARCH_COLLECTIONS.find((type) => type === raw)
}

export function parseSearchPage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw || !/^\d{1,4}$/.test(raw)) return 1
  const parsed = Number(raw)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1
}
