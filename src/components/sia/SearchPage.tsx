import Link from 'next/link'
import { getPublicRoutePath } from '@/utilities/publicRoutes'
import { PUBLIC_SEARCH_TYPE_LABELS, type PublicSearchType } from '@/utilities/publicSearch'
import type { PublicSearchResponse } from '@/data/search'

const SEARCH_TYPES = Object.entries(PUBLIC_SEARCH_TYPE_LABELS) as [PublicSearchType, string][]

export function SearchForm({ query, type }: { query: string; type?: PublicSearchType }) {
  return (
    <form className="sia-search-form" method="get" action={getPublicRoutePath('search')} role="search">
      <div className="sia-search-field">
        <label htmlFor="public-search-query">Rechercher dans le site</label>
        <input
          id="public-search-query"
          type="search"
          name="q"
          defaultValue={query}
          maxLength={120}
          autoComplete="off"
          placeholder="Ex. actuariat, risque…"
        />
      </div>
      <div className="sia-search-filter">
        <label htmlFor="public-search-type">Type de contenu</label>
        <select id="public-search-type" name="type" defaultValue={type ?? ''}>
          <option value="">Tous les types</option>
          {SEARCH_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <button className="sia-action" type="submit">Rechercher <span aria-hidden="true">→</span></button>
    </form>
  )
}

function buildSearchHref(query: string, type: PublicSearchType | undefined, page: number): string {
  const params = new URLSearchParams({ q: query })
  if (type) params.set('type', type)
  if (page > 1) params.set('page', String(page))
  return `${getPublicRoutePath('search')}?${params.toString()}`
}

export function SearchResults({
  query,
  type,
  data,
}: {
  query: string
  type?: PublicSearchType
  data: PublicSearchResponse
}) {
  if (data.page > data.totalPages && data.totalDocs > 0) {
    return (
      <div className="sia-search-empty" role="status">
        <h2>Cette page de résultats n’existe pas.</h2>
        <p><Link href={buildSearchHref(query, type, 1)}>Revenir à la première page</Link></p>
      </div>
    )
  }

  if (!data.totalDocs || !data.docs.length) {
    return (
      <div className="sia-search-empty" role="status">
        <h2>Aucun résultat pour « {query} »</h2>
        <p>Vérifiez l’orthographe ou essayez des termes plus généraux.</p>
      </div>
    )
  }

  const countLabel = data.totalDocs === 1 ? '1 résultat' : `${data.totalDocs} résultats`
  const pages = new Set([1, data.totalPages, data.page - 1, data.page, data.page + 1]
    .filter((page) => page > 0 && page <= data.totalPages))

  return (
    <section className="sia-search-results" aria-labelledby="search-results-heading">
      <div className="sia-search-results-heading">
        <h2 id="search-results-heading">Résultats</h2>
        <p>{countLabel}</p>
      </div>
      <ol className="sia-search-list">
        {data.docs.map((result) => (
          <li key={result.id}>
            <article>
              <p className="sia-search-meta">
                <span>{PUBLIC_SEARCH_TYPE_LABELS[result.contentType]}</span>
                {result.contentType === 'publications' && result.publishedAt && Number.isFinite(Date.parse(result.publishedAt)) && (
                  <time dateTime={result.publishedAt}>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(result.publishedAt))}</time>
                )}
              </p>
              <h3><Link href={result.url}>{result.title}</Link></h3>
              {result.excerpt && <p className="sia-search-excerpt">{result.excerpt}</p>}
            </article>
          </li>
        ))}
      </ol>
      {data.totalPages > 1 && (
        <nav className="sia-search-pagination" aria-label="Pagination des résultats de recherche">
          {data.page > 1 && <Link rel="prev" href={buildSearchHref(query, type, data.page - 1)}>Page précédente</Link>}
          <ol>
            {[...pages].sort((a, b) => a - b).map((page, index, values) => (
              <li key={page}>
                {index > 0 && values[index - 1] !== page - 1 && <span aria-hidden="true">…</span>}
                <Link href={buildSearchHref(query, type, page)} aria-current={page === data.page ? 'page' : undefined} aria-label={`Page ${page}`}>{page}</Link>
              </li>
            ))}
          </ol>
          {data.page < data.totalPages && <Link rel="next" href={buildSearchHref(query, type, data.page + 1)}>Page suivante</Link>}
        </nav>
      )}
    </section>
  )
}
