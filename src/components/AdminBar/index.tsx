'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import './index.scss'

const frontendCollections = [
  { path: '/expertises', slug: 'services' },
  { path: '/secteurs', slug: 'sectors' },
  { path: '/formations', slug: 'trainings' },
  { path: '/publications', slug: 'publications' },
  { path: '/etudes-de-cas', slug: 'case-studies' },
  { path: '/ressources', slug: 'resources' },
  { path: '/equipe', slug: 'team-members' },
  { path: '/references', slug: 'references' },
] as const

export function AdminBar({ adminBarProps }: { adminBarProps?: PayloadAdminBarProps }) {
  const [user, setUser] = useState<PayloadMeUser>(null)
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const collection = frontendCollections.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`))

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/users/me', { signal: controller.signal, credentials: 'same-origin' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (!controller.signal.aborted) setUser(data?.user ?? null) })
      .catch(() => { /* An unavailable session leaves the public page unchanged. */ })
    return () => controller.abort()
  }, [])

  if (!user?.id) return null

  async function exitPreview() {
    setLeaving(true)
    setError(false)
    try {
      const response = await fetch('/next/exit-preview')
      if (!response.ok) throw new Error('Preview exit failed')
      router.refresh()
    } catch {
      setError(true)
    } finally {
      setLeaving(false)
    }
  }

  return <aside className="sia-editor-bar" aria-label="Outils d’administration">
    <div className="container sia-editor-bar-inner">
      <Link className="sia-editor-bar-brand" href="/admin">SIA · Administration</Link>
      <span className="sia-editor-bar-status">{adminBarProps?.preview ? 'Mode aperçu' : 'Vous êtes connecté'}</span>
      <div className="sia-editor-bar-actions">
        {collection && <Link href={`/admin/collections/${collection.slug}`}>Gérer cette rubrique</Link>}
        <Link href="/admin/account">Mon compte</Link>
        {adminBarProps?.preview && <button type="button" onClick={exitPreview} disabled={leaving}>{leaving ? 'Fermeture…' : 'Quitter l’aperçu'}</button>}
      </div>
      {error && <p role="alert">Impossible de fermer l’aperçu. Réessayez.</p>}
    </div>
  </aside>
}
