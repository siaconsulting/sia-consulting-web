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
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Services: CollectionConfig<'services'> = {
  slug: 'services',
  defaultSort: 'order',
  labels: editorialLabels('Expertise', 'Expertises'),
  access: editorialAccess,
  admin: {
    ...editorialAdmin(),
    livePreview: { url: ({ data, req }) => generatePreviewPath({ collection: 'services', slug: data?.slug as string, req }) },
    preview: (data, { req }) => generatePreviewPath({ collection: 'services', slug: data?.slug as string, req }),
  },
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
          label: 'Valeur proposée',
          fields: [
            {
              name: 'keyBenefits',
              type: 'array',
              label: 'Bénéfices clés',
              labels: { singular: 'Bénéfice', plural: 'Bénéfices' },
              fields: [{ name: 'benefit', type: 'text', label: 'Bénéfice', required: true }],
            },
            {
              name: 'deliverables',
              type: 'array',
              label: 'Livrables',
              labels: { singular: 'Livrable', plural: 'Livrables' },
              fields: [{ name: 'deliverable', type: 'text', label: 'Livrable', required: true }],
            },
          ],
        },
        {
          label: 'Classement et secteurs',
          fields: [
            ...editorialOrganizationFields(),
            {
              name: 'sectors',
              type: 'relationship',
              relationTo: 'sectors',
              hasMany: true,
              label: 'Secteurs concernés',
              admin: { description: 'Secteurs auxquels cette expertise est rattachée.' },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [editorialAfterChange('services')],
    afterDelete: [editorialAfterDelete('services')],
  },
  versions: editorialVersions(),
}
