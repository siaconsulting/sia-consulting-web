import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>SIA Consulting — administration</h4>
      </Banner>
      <p>Gérez le contenu du site depuis cet espace.</p>
      <ul className={`${baseClass}__instructions`}>
        {isDevelopment && (
          <li>
            <SeedButton />
            {' pour charger les données de démonstration en développement.'}
          </li>
        )}
        <li>Utilisez les workflows éditoriaux existants pour administrer le site.</li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
