import type { GlobalConfig } from 'payload'
import type { CollectionSlug, Field } from 'payload'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/adminOrEditor'
import { link } from '@/fields/link'
import { revalidatePublicGlobal } from '@/hooks/revalidateGlobal'

const selectedContent = (name: string, label: string, relationTo: CollectionSlug): Field => ({
  name, type: 'relationship' as const, relationTo, hasMany: true, label,
  admin: { description: "La sélection et l'ordre de ces éléments déterminent leur affichage sur l'accueil." },
})

export const HomeSettings: GlobalConfig = {
  slug: 'home-settings',
  label: 'Accueil',
  access: { read: anyone, update: adminOrEditor },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Hero', fields: [
        { name: 'hero', type: 'group', label: 'Présentation principale', fields: [
          { name: 'eyebrow', type: 'text', label: 'Sur-titre' },
          { name: 'title', type: 'text', label: 'Titre principal' },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'image', type: 'upload', relationTo: 'media', label: 'Image principale' },
          link({ name: 'primaryCTA', appearances: false, required: false }),
          link({ name: 'secondaryCTA', appearances: false, required: false }),
        ] },
        { name: 'introduction', type: 'textarea', label: 'Introduction institutionnelle', maxLength: 1000 },
      ] },
      { label: 'Sélections', fields: [
        selectedContent('featuredServices', 'Expertises sélectionnées', 'services'),
        selectedContent('featuredSectors', 'Secteurs sélectionnés', 'sectors'),
        selectedContent('featuredTrainings', 'Formations sélectionnées', 'trainings'),
        selectedContent('featuredCaseStudies', 'Études de cas sélectionnées', 'case-studies'),
        selectedContent('featuredPublications', 'Publications sélectionnées', 'publications'),
        selectedContent('featuredResources', 'Ressources sélectionnées', 'resources'),
        selectedContent('featuredReferences', 'Références sélectionnées', 'references'),
      ] },
      { label: 'Chiffres clés', fields: [{ name: 'keyFigures', type: 'array', label: 'Chiffres clés', labels: { singular: 'Chiffre', plural: 'Chiffres' }, fields: [
        { name: 'prefix', type: 'text', label: 'Préfixe' },
        { name: 'value', type: 'text', label: 'Valeur', required: true },
        { name: 'suffix', type: 'text', label: 'Suffixe' },
        { name: 'label', type: 'text', label: 'Libellé', required: true },
      ] }] },
      { label: 'Appel à l’action', fields: [{ name: 'finalCTA', type: 'group', label: 'Appel à l’action final', fields: [
        { name: 'title', type: 'text', label: 'Titre' },
        { name: 'description', type: 'textarea', label: 'Description courte' },
        link({ name: 'cta', appearances: false, required: false }),
      ] }] },
    ] },
  ],
  hooks: { afterChange: [revalidatePublicGlobal('home-settings')] },
}
