import Link from 'next/link'

export type BreadcrumbItem = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="sia-breadcrumbs" aria-label="Fil d’Ariane">
      <ol>
        <li><Link href="/">Accueil</Link></li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <span aria-hidden="true">/</span>
            {item.href && index !== items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
