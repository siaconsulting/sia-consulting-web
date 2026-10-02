import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/adminOrEditor'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pied de page',
  access: {
    read: anyone,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        hidden: true,
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'navigationColumns',
      type: 'array',
      label: 'Colonnes de navigation',
      labels: { singular: 'Colonne', plural: 'Colonnes' },
      fields: [
        { name: 'title', type: 'text', label: 'Titre de la colonne', required: true },
        { name: 'links', type: 'array', label: 'Liens', fields: [link({ appearances: false })] },
      ],
    },
    { name: 'legalLinks', type: 'array', label: 'Liens légaux', fields: [link({ appearances: false })] },
    { name: 'showContactInformation', type: 'checkbox', label: 'Afficher les coordonnées publiques', defaultValue: true },
    { name: 'showSocialNetworks', type: 'checkbox', label: 'Afficher les réseaux sociaux', defaultValue: true },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
