import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>SIA Consulting — administration</h4>
      </Banner>
      <p>Gérez le contenu du site depuis cet espace.</p>
      <ul className={`${baseClass}__instructions`}>
        <li>Utilisez les workflows éditoriaux existants pour administrer le site.</li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
