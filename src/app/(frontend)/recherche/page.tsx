import type { Metadata } from 'next'
import { Container } from '@/components/sia/Container'
import { SearchForm, SearchResults } from '@/components/sia/SearchPage'
import { getSiteSettings } from '@/data/globals'
import { searchPublicContent } from '@/data/search'
import { getPublicRoutePath } from '@/utilities/publicRoutes'
import {
  normalizeSearchQuery,
  parsePublicSearchType,
  parseSearchPage,
  SEARCH_QUERY_MIN_LENGTH,
} from '@/utilities/publicSearch'
import { getServerSideURL } from '@/utilities/getURL'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  const siteName = site.siteName || site.shortName || 'SIA Consulting'
  const canonical = new URL(getPublicRoutePath('search'), getServerSideURL()).toString()
  return {
    title: `Recherche | ${siteName}`,
    description: 'Rechercher dans les expertises, secteurs, formations et contenus de SIA Consulting.',
    alternates: { canonical },
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const { query, truncated } = normalizeSearchQuery(params.q)
  const type = parsePublicSearchType(params.type)
  const page = parseSearchPage(params.page)
  const canSearch = Array.from(query).length >= SEARCH_QUERY_MIN_LENGTH
  const results = canSearch ? await searchPublicContent({ query, type, page }) : null

  return (
    <div className="sia-search-page">
      <section className="sia-search-intro">
        <Container>
          <p className="sia-editorial-eyebrow">Explorer SIA</p>
          <h1>Recherche</h1>
          <p className="sia-search-lead">Parcourez les expertises, secteurs, formations et publications.</p>
          <SearchForm query={query} type={type} />
          {truncated && <p className="sia-search-note" role="status">La recherche a été limitée aux 120 premiers caractères.</p>}
          {query && !canSearch && <p className="sia-search-note" role="status">Saisissez au moins deux caractères pour lancer la recherche.</p>}
        </Container>
      </section>
      {results && (
        <Container>
          <SearchResults query={query} type={type} data={results} />
        </Container>
      )}
      {!query && (
        <Container>
          <p className="sia-search-hint">Saisissez au moins deux caractères pour commencer.</p>
        </Container>
      )}
    </div>
  )
}
