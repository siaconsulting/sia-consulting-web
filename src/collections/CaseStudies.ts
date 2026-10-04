import { ValidationError, type CollectionConfig, type CollectionBeforeChangeHook } from 'payload'
import type { CaseStudy } from '@/payload-types'

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

const validateClientDisclosure: CollectionBeforeChangeHook<CaseStudy> = async ({ data, originalDoc, req }) => {
  const disclosure = data.clientDisclosure ?? originalDoc?.clientDisclosure
  if ((data._status ?? originalDoc?._status) !== 'published') return data

  const reference = data.clientReference ?? originalDoc?.clientReference
  const neutralLabel = data.anonymousClientLabel ?? originalDoc?.anonymousClientLabel
  const invalid = disclosure === 'named'
    ? !reference || Boolean(neutralLabel)
    : disclosure === 'anonymous'
      ? Boolean(reference) || typeof neutralLabel !== 'string' || neutralLabel.trim().length === 0
      : true

  if (invalid) {
    throw new ValidationError({
      collection: 'case-studies',
      errors: [{
        path: 'clientDisclosure',
        message: 'Pour publier, choisissez un client nommé avec une référence, ou une étude anonymisée avec un libellé neutre sans référence liée.',
      }],
      req,
    }, req.t)
  }

  if (disclosure === 'named' && reference) {
    const id = typeof reference === 'object' ? reference.id : reference
    const referenceDoc = await req.payload.findByID({
      collection: 'references',
      id,
      depth: 0,
      overrideAccess: true,
      select: { _status: true },
      req,
    })

    if (referenceDoc._status !== 'published') {
      throw new ValidationError({
        collection: 'case-studies',
        errors: [{ path: 'clientReference', message: 'La référence doit être publiée avant de pouvoir être citée.' }],
        req,
      }, req.t)
    }
  }

  return data
}

export const CaseStudies: CollectionConfig<'case-studies'> = {
  slug: 'case-studies',
  defaultSort: '-publishedAt',
  labels: editorialLabels("Étude de cas", 'Études de cas'),
  access: editorialAccess,
  admin: {
    ...editorialAdmin({ group: 'Contenus', defaultColumns: ['title', 'clientDisclosure', 'publishedAt', '_status'] }),
    livePreview: { url: ({ data, req }) => generatePreviewPath({ collection: 'case-studies', slug: data?.slug as string, req }) },
    preview: (data, { req }) => generatePreviewPath({ collection: 'case-studies', slug: data?.slug as string, req }),
  },
  defaultPopulate: { title: true, slug: true, shortDescription: true, coverImage: true, clientDisclosure: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', required: true },
            editorialSlugField(),
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Résumé court',
              required: true,
              maxLength: 320,
            },
            editorialHeroImageField('coverImage'),
            {
              name: 'clientDisclosure',
              type: 'select',
              label: 'Visibilité du client',
              options: [
                { label: 'Organisation nommée (autorisation obtenue)', value: 'named' },
                { label: 'Étude anonymisée', value: 'anonymous' },
              ],
              admin: { description: 'La publication est bloquée tant que les informations client ne correspondent pas au mode choisi.' },
            },
            {
              name: 'clientReference',
              type: 'relationship',
              relationTo: 'references',
              label: 'Référence publiable',
              admin: { condition: (_, siblingData) => siblingData?.clientDisclosure === 'named' },
            },
            {
              name: 'anonymousClientLabel',
              type: 'text',
              label: 'Libellé client neutre',
              maxLength: 120,
              admin: {
                condition: (_, siblingData) => siblingData?.clientDisclosure === 'anonymous',
                description: 'Ex. « Compagnie d’assurance régionale ». Ne saisissez aucun nom réel.'
              },
            },
          ],
        },
        {
          label: 'Mission et résultats',
          fields: [
            { name: 'context', type: 'richText', label: 'Contexte', required: true },
            { name: 'challenge', type: 'richText', label: 'Problématique', required: true },
            { name: 'approach', type: 'richText', label: 'Approche et intervention', required: true },
            { name: 'results', type: 'richText', label: 'Résultats', required: true },
            {
              name: 'metrics',
              type: 'array',
              label: 'Indicateurs publiables',
              labels: { singular: 'Indicateur', plural: 'Indicateurs' },
              fields: [
                { name: 'label', type: 'text', label: 'Libellé', required: true },
                { name: 'value', type: 'text', label: 'Valeur', required: true },
                { name: 'unit', type: 'text', label: 'Unité', admin: { description: 'Facultatif (%, jours, etc.).' } },
              ],
            },
          ],
        },
        {
          label: 'Liens et classement',
          fields: [
            { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, label: 'Expertises mobilisées' },
            { name: 'sectors', type: 'relationship', relationTo: 'sectors', hasMany: true, label: 'Secteurs concernés' },
            ...editorialOrganizationFields(),
          ],
        },
      ],
    },
    editorialPublishedAtField(),
  ],
  hooks: {
    beforeChange: [validateClientDisclosure],
    afterChange: [editorialAfterChange('case-studies')],
    afterDelete: [editorialAfterDelete('case-studies')],
  },
  versions: editorialVersions(),
}
