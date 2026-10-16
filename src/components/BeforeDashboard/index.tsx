import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import './index.scss'

const BeforeDashboard: React.FC = () => (
  <section className="sia-admin-welcome" aria-labelledby="sia-admin-welcome-title">
    <div>
      <p className="sia-admin-kicker">SIA Consulting</p>
      <h1 id="sia-admin-welcome-title">Votre site, votre espace.</h1>
      <p>Retrouvez vos contenus, vos paramètres et les demandes de vos visiteurs dans le menu. Sélectionnez une rubrique pour commencer.</p>
      <Link href="/" target="_blank" rel="noopener noreferrer">Consulter le site <ArrowUpRight size={18} aria-hidden="true" /><span className="sia-admin-sr-only"> (nouvel onglet)</span></Link>
    </div>
    <span className="sia-admin-welcome-mark" aria-hidden="true">SIA</span>
  </section>
)

export default BeforeDashboard
