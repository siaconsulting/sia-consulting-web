import type { CollectionConfig } from 'payload'

import { editorialAfterChange, editorialAfterDelete } from '@/hooks/revalidateEditorial'
import {
  editorialHeroImageField,
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
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Publications: CollectionConfig<'publications'> = {
  slug: 'publications',
  defaultSort: '-publishedAt',
  labels: editorialLabels('Publication', 'Publications'),
  access: editorialAccess,
  admin: {
    ...editorialAdmin({ group: 'Contenus', defaultColumns: ['title', 'type', 'publishedAt', '_status'] }),
    livePreview: { url: ({ data, req }) => generatePreviewPath({ collection: 'publications', slug: data?.slug as string, req }) },
    preview: (data, { req }) => generatePreviewPath({ collection: 'publications', slug: data?.slug as string, req }),
  },
  defaultPopulate: { title: true, slug: true, excerpt: true, type: true, coverImage: true, publishedAt: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', required: true },
            editorialSlugField(),
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Résumé',
              required: true,
              maxLength: 320,
              admin: { description: 'Résumé affiché dans les listes (320 caractères maximum).' },
            },
            {
              name: 'type',
              type: 'select',
              label: 'Type de publication',
              required: true,
              options: [
                { label: 'Article', value: 'article' },
                { label: 'Analyse', value: 'analysis' },
                { label: 'Note technique', value: 'technical_note' },
                { label: 'Actualité', value: 'news' },
                { label: 'Opinion', value: 'opinion' },
                { label: 'Étude réglementaire', value: 'regulatory_study' },
              ],
            },
            editorialHeroImageField('coverImage'),
            { name: 'content', type: 'richText', label: 'Texte', required: true },
            {
              name: 'topics',
              type: 'array',
              label: 'Sujets',
              labels: { singular: 'Sujet', plural: 'Sujets' },
              maxRows: 12,
              fields: [{ name: 'label', type: 'text', label: 'Sujet', required: true, maxLength: 60 }],
              admin: { description: 'Libellés simples, sans taxonomie partagée pour le moment.' },
            },
          ],
        },
        {
          label: 'Auteurs et liens',
          fields: [
            {
              name: 'authors',
              type: 'relationship',
              relationTo: 'team-members',
              hasMany: true,
              label: 'Auteurs',
              admin: { description: 'Facultatif; seuls les profils publics pourront être affichés sur le site.' },
            },
            { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, label: 'Expertises liées' },
            { name: 'sectors', type: 'relationship', relationTo: 'sectors', hasMany: true, label: 'Secteurs liés' },
          ],
        },
        {
          label: 'Classement',
          fields: [
            ...editorialOrganizationFields(),
          ],
        },
      ],
    },
    editorialPublishedAtField(),
  ],
  hooks: {
    afterChange: [editorialAfterChange('publications')],
    afterDelete: [editorialAfterDelete('publications')],
  },
  versions: editorialVersions(),
}
