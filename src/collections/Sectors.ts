import type { CollectionConfig } from 'payload'

import {
  editorialHeroImageField,
  editorialOrganizationFields,
  editorialSlugField,
} from './shared/editorialFields'
import {
  editorialAccess,
  editorialAdmin,
  editorialLabels,
  editorialVersions,
} from './shared/editorialConfig'
import { editorialAfterChange, editorialAfterDelete } from '@/hooks/revalidateEditorial'

export const Sectors: CollectionConfig<'sectors'> = {
  slug: 'sectors',
  defaultSort: 'order',
  labels: editorialLabels('Secteur', 'Secteurs'),
  access: editorialAccess,
  admin: editorialAdmin(),
  defaultPopulate: { title: true, slug: true, shortDescription: true, heroImage: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          fields: [
            { name: 'title', type: 'text', label: 'Intitulé', required: true },
            editorialSlugField(),
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Résumé court',
              required: true,
              maxLength: 280,
              admin: { description: 'Résumé pour les listes et les cartes (280 caractères maximum).' },
            },
            editorialHeroImageField(),
            { name: 'introduction', type: 'richText', label: 'Introduction' },
            { name: 'body', type: 'richText', label: 'Contenu détaillé', required: true },
          ],
        },
        {
          label: 'Classement et contenus liés',
          fields: [
            ...editorialOrganizationFields(),
            {
              name: 'services',
              type: 'join',
              collection: 'services',
              on: 'sectors',
              label: 'Expertises associées',
              admin: {
                allowCreate: false,
                defaultColumns: ['title', 'slug', 'featured', 'order'],
                description: 'Ces liens sont gérés depuis chaque expertise.',
              },
            },
            {
              name: 'trainings',
              type: 'join',
              collection: 'trainings',
              on: 'sectors',
              label: 'Formations associées',
              admin: {
                allowCreate: false,
                defaultColumns: ['title', 'code', 'featured', 'order'],
                description: 'Ces liens sont gérés depuis chaque formation.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [editorialAfterChange('sectors')],
    afterDelete: [editorialAfterDelete('sectors')],
  },
  versions: editorialVersions(),
}
