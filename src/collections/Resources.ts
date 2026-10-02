import type { CollectionConfig } from 'payload'

import { editorialAfterChange, editorialAfterDelete } from '@/hooks/revalidateEditorial'
import {
  editorialOrganizationFields,
  editorialPublishedAtField,
  editorialSlugField,
} from './shared/editorialFields'
import {
  editorialAccess,
  editorialAdmin,
  editorialLabels,
  editorialVersions,
} from './shared/editorialConfig'

export const Resources: CollectionConfig<'resources'> = {
  slug: 'resources',
  defaultSort: '-publishedAt',
  labels: editorialLabels('Ressource', 'Ressources'),
  access: editorialAccess,
  admin: editorialAdmin({ group: 'Contenus', defaultColumns: ['title', 'type', 'publishedAt', '_status'] }),
  defaultPopulate: { title: true, slug: true, shortDescription: true, type: true, coverImage: true, file: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ressource publique',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', required: true },
            editorialSlugField(),
            {
              name: 'type',
              type: 'select',
              label: 'Type de ressource',
              required: true,
              options: [
                { label: 'Brochure', value: 'brochure' },
                { label: 'Catalogue', value: 'catalogue' },
                { label: 'Rapport', value: 'report' },
                { label: 'Note', value: 'note' },
                { label: 'Document institutionnel', value: 'institutional' },
              ],
            },
            { name: 'shortDescription', type: 'textarea', label: 'Résumé', required: true, maxLength: 320 },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Fichier public à télécharger',
              admin: { description: 'Le fichier et son URL seront publiquement accessibles après publication de cette ressource.' },
            },
            { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Vignette' },
            { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, label: 'Expertises associées' },
            { name: 'sectors', type: 'relationship', relationTo: 'sectors', hasMany: true, label: 'Secteurs associés' },
          ],
        },
        { label: 'Classement', fields: [...editorialOrganizationFields()] },
      ],
    },
    editorialPublishedAtField(),
  ],
  hooks: {
    afterChange: [editorialAfterChange('resources')],
    afterDelete: [editorialAfterDelete('resources')],
  },
  versions: editorialVersions(),
}
