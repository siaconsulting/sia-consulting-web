import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function AdminIcon() {
  return <Image className="sia-admin-icon" src="/sia-icon.svg" alt="SIA Consulting" width={24} height={24} unoptimized />
}

export function AdminLogo() {
  return <div className="sia-admin-brand"><Image src="/sia-logo.png" alt="SIA Consulting" width={364} height={223} unoptimized priority /><small>Espace d’administration</small></div>
}

export function AdminSiteLink() {
  return <Link className="sia-admin-site-link" href="/" target="_blank" rel="noopener noreferrer">Voir le site <ArrowUpRight size={17} aria-hidden="true" /><span className="sia-admin-sr-only"> (nouvel onglet)</span></Link>
}
