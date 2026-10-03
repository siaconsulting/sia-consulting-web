import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/adminOrEditor'
import { link } from '@/fields/link'
import { revalidatePublicGlobal } from '@/hooks/revalidateGlobal'

export const AboutSettings: GlobalConfig = {
  slug: 'about-settings',
  label: 'À propos',
  access: { read: anyone, update: adminOrEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          fields: [
            { name: 'hero', type: 'group', label: 'Présentation principale', fields: [
              { name: 'eyebrow', type: 'text', label: 'Sur-titre' },
              { name: 'title', type: 'text', label: 'Titre' },
              { name: 'introduction', type: 'textarea', label: 'Introduction' },
              { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Image principale' },
            ] },
            { name: 'body', type: 'richText', label: 'Présentation institutionnelle' },
          ],
        },
        {
          label: 'Mission, vision et valeurs',
          fields: [
            { name: 'mission', type: 'group', label: 'Mission', fields: [
              { name: 'title', type: 'text', label: 'Titre' },
              { name: 'content', type: 'richText', label: 'Contenu' },
            ] },
            { name: 'vision', type: 'group', label: 'Vision', fields: [
              { name: 'title', type: 'text', label: 'Titre' },
              { name: 'content', type: 'richText', label: 'Contenu' },
            ] },
            { name: 'values', type: 'array', label: 'Valeurs', labels: { singular: 'Valeur', plural: 'Valeurs' }, fields: [
              { name: 'title', type: 'text', label: 'Titre', required: true },
              { name: 'description', type: 'textarea', label: 'Description', required: true },
            ] },
          ],
        },
        { label: 'Appel à l’action', fields: [link({ name: 'cta', appearances: false, required: false })] },
        { label: 'Référencement', fields: [
          { name: 'metaTitle', type: 'text', label: 'Titre SEO' },
          { name: 'metaDescription', type: 'textarea', label: 'Description SEO', maxLength: 300 },
          { name: 'metaImage', type: 'upload', relationTo: 'media', label: 'Image Open Graph' },
        ] },
      ],
    },
  ],
  hooks: { afterChange: [revalidatePublicGlobal('about-settings')] },
}
