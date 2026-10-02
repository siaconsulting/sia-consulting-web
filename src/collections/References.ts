import type { CollectionConfig } from 'payload'

import { editorialAfterChange, editorialAfterDelete } from '@/hooks/revalidateEditorial'
import { editorialOrganizationFields, editorialSlugField } from './shared/editorialFields'
import {
  editorialAccess,
  editorialAdmin,
  editorialLabels,
  editorialVersions,
} from './shared/editorialConfig'

export const References: CollectionConfig<'references'> = {
  slug: 'references',
  defaultSort: 'order',
  labels: editorialLabels('Référence', 'Références'),
  access: editorialAccess,
  admin: editorialAdmin({ group: 'Organisation', titleField: 'name', defaultColumns: ['name', 'type', 'featured', '_status'] }),
  defaultPopulate: { name: true, slug: true, logo: true, type: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Organisation',
          fields: [
            { name: 'name', type: 'text', label: 'Nom publiable', required: true },
            editorialSlugField('name'),
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
            {
              name: 'website',
              type: 'text',
              label: 'Site web',
              validate: (value: string | null | undefined) => !value || /^https:\/\//.test(value) || 'Utilisez une URL HTTPS complète.',
            },
            { name: 'shortDescription', type: 'textarea', label: 'Présentation courte', maxLength: 280 },
            {
              name: 'type',
              type: 'select',
              label: 'Nature de la relation',
              required: true,
              options: [
                { label: 'Client', value: 'client' },
                { label: 'Partenaire', value: 'partner' },
                { label: 'Institution', value: 'institution' },
              ],
            },
            { name: 'sectors', type: 'relationship', relationTo: 'sectors', hasMany: true, label: 'Secteurs associés' },
          ],
        },
        { label: 'Classement', fields: [...editorialOrganizationFields()] },
      ],
    },
    {
      name: 'caseStudies',
      type: 'join',
      collection: 'case-studies',
      on: 'clientReference',
      label: 'Études de cas publiées avec cette référence',
      admin: {
        allowCreate: false,
        defaultColumns: ['title', 'publishedAt', '_status'],
        description: 'La référence est associée depuis chaque étude; les études anonymisées ne figurent pas ici.',
      },
    },
  ],
  hooks: {
    afterChange: [editorialAfterChange('references')],
    afterDelete: [editorialAfterDelete('references')],
  },
  versions: editorialVersions(),
}
