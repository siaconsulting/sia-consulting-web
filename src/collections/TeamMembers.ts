import type { CollectionConfig } from 'payload'

import { editorialAfterChange, editorialAfterDelete } from '@/hooks/revalidateEditorial'
import { editorialOrganizationFields, editorialSlugField } from './shared/editorialFields'
import {
  editorialAccess,
  editorialAdmin,
  editorialLabels,
  editorialVersions,
} from './shared/editorialConfig'

export const TeamMembers: CollectionConfig<'team-members'> = {
  slug: 'team-members',
  defaultSort: 'order',
  labels: editorialLabels('Membre de l’équipe', 'Équipe'),
  access: editorialAccess,
  admin: editorialAdmin({ group: 'Organisation', titleField: 'name', defaultColumns: ['name', 'jobTitle', 'featured', '_status'] }),
  defaultPopulate: { name: true, slug: true, jobTitle: true, photo: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profil public',
          fields: [
            { name: 'name', type: 'text', label: 'Nom public', required: true },
            editorialSlugField('name'),
            { name: 'jobTitle', type: 'text', label: 'Fonction', required: true, maxLength: 120 },
            { name: 'shortBio', type: 'textarea', label: 'Présentation courte', required: true, maxLength: 280 },
            { name: 'bio', type: 'richText', label: 'Biographie' },
            { name: 'photo', type: 'upload', relationTo: 'media', label: 'Photo' },
            {
              name: 'linkedin',
              type: 'text',
              label: 'Profil LinkedIn',
              validate: (value: string | null | undefined) => !value || /^https:\/\/(www\.)?linkedin\.com\//.test(value) || 'Saisissez une URL LinkedIn HTTPS valide.',
            },
            {
              name: 'publicEmail',
              type: 'email',
              label: 'Adresse e-mail publique',
              admin: { description: 'Cette adresse sera destinée à être affichée publiquement.' },
            },
            { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, label: 'Expertises associées' },
          ],
        },
        {
          label: 'Classement',
          fields: [...editorialOrganizationFields()],
        },
      ],
    },
    {
      name: 'publications',
      type: 'join',
      collection: 'publications',
      on: 'authors',
      label: 'Publications de ce membre',
      admin: {
        allowCreate: false,
        defaultColumns: ['title', 'type', 'publishedAt', '_status'],
        description: 'Les auteurs sont affectés depuis chaque publication.',
      },
    },
  ],
  hooks: {
    afterChange: [editorialAfterChange('team-members')],
    afterDelete: [editorialAfterDelete('team-members')],
  },
  versions: editorialVersions(),
}
