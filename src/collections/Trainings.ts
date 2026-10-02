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

export const Trainings: CollectionConfig<'trainings'> = {
  slug: 'trainings',
  defaultSort: 'order',
  labels: editorialLabels('Formation', 'Formations'),
  access: editorialAccess,
  admin: editorialAdmin(),
  defaultPopulate: { title: true, slug: true, summary: true, heroImage: true, code: true },
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
              name: 'code',
              type: 'text',
              label: 'Code formation',
              unique: true,
              index: true,
              admin: { description: 'Référence catalogue facultative, distincte de l’identifiant Payload.' },
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Résumé',
              required: true,
              maxLength: 280,
              admin: { description: 'Résumé pour les listes et les cartes (280 caractères maximum).' },
            },
            editorialHeroImageField(),
            { name: 'description', type: 'richText', label: 'Description détaillée', required: true },
          ],
        },
        {
          label: 'Programme',
          fields: [
            {
              name: 'objectives',
              type: 'array',
              label: 'Objectifs pédagogiques',
              labels: { singular: 'Objectif', plural: 'Objectifs' },
              fields: [{ name: 'objective', type: 'text', label: 'Objectif', required: true }],
            },
            {
              name: 'targetAudience',
              type: 'array',
              label: 'Public cible',
              labels: { singular: 'Public', plural: 'Publics' },
              fields: [{ name: 'audience', type: 'text', label: 'Public cible', required: true }],
            },
            {
              name: 'prerequisites',
              type: 'textarea',
              label: 'Prérequis',
              admin: { description: 'Laisser vide si aucun prérequis ne s’applique.' },
            },
            {
              name: 'program',
              type: 'array',
              label: 'Modules du programme',
              labels: { singular: 'Module', plural: 'Modules' },
              fields: [
                { name: 'title', type: 'text', label: 'Intitulé du module', required: true },
                { name: 'description', type: 'textarea', label: 'Contenu du module' },
              ],
            },
          ],
        },
        {
          label: 'Modalités et classement',
          fields: [
            {
              name: 'duration',
              type: 'text',
              label: 'Durée indicative',
              admin: { description: 'Ex. « 2 jours », « 14 heures » ou une durée à convenir.' },
            },
            {
              name: 'format',
              type: 'select',
              label: 'Format proposé',
              options: [
                { label: 'Présentiel', value: 'in_person' },
                { label: 'À distance', value: 'remote' },
                { label: 'Hybride', value: 'hybrid' },
              ],
            },
            {
              name: 'location',
              type: 'text',
              label: 'Lieu indicatif',
              admin: { description: 'Facultatif; le lieu peut dépendre de la session.' },
            },
            ...editorialOrganizationFields(),
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: 'Expertises associées',
            },
            {
              name: 'sectors',
              type: 'relationship',
              relationTo: 'sectors',
              hasMany: true,
              label: 'Secteurs concernés',
              admin: {
                description: 'Association éditoriale directe, indépendante du secteur des expertises liées.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [editorialAfterChange('trainings')],
    afterDelete: [editorialAfterDelete('trainings')],
  },
  versions: editorialVersions(),
}
