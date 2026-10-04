import Link from 'next/link'

export function EditorialPagination({ path, page, totalPages }: { path: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  const href = (value: number) => value === 1 ? path : `${path}?page=${value}`
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((value) => value > 0 && value <= totalPages))
  return (
    <nav className="sia-pagination" aria-label="Pagination des résultats">
      {page > 1 && <Link rel="prev" href={href(page - 1)}>Page précédente</Link>}
      <ol>
        {[...pages].sort((a, b) => a - b).map((value, index, values) => (
          <li key={value}>
            {index > 0 && values[index - 1] !== value - 1 && <span aria-hidden="true">…</span>}
            <Link href={href(value)} aria-current={value === page ? 'page' : undefined} aria-label={`Page ${value}`}>{value}</Link>
          </li>
        ))}
      </ol>
      {page < totalPages && <Link rel="next" href={href(page + 1)}>Page suivante</Link>}
    </nav>
  )
}
