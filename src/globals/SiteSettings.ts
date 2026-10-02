import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/adminOrEditor'
import { validateHTTPSURL } from '@/utilities/links'
import { revalidatePublicGlobal } from '@/hooks/revalidateGlobal'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  access: { read: anyone, update: adminOrEditor },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Identité', fields: [
        { name: 'siteName', type: 'text', label: 'Nom du site' },
        { name: 'legalName', type: 'text', label: 'Raison sociale' },
        { name: 'shortName', type: 'text', label: 'Nom court' },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
        { name: 'logoDark', type: 'upload', relationTo: 'media', label: 'Logo sur fond clair', admin: { description: 'À renseigner uniquement si une variante est nécessaire.' } },
        { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
        { name: 'defaultSocialImage', type: 'upload', relationTo: 'media', label: 'Image Open Graph par défaut' },
        { name: 'copyrightName', type: 'text', label: 'Nom affiché pour le copyright' },
      ] },
      { label: 'Référencement', fields: [
        { name: 'defaultMetaTitle', type: 'text', label: 'Titre SEO par défaut' },
        { name: 'titleSuffix', type: 'text', label: 'Suffixe des titres' },
        { name: 'defaultMetaDescription', type: 'textarea', label: 'Description SEO par défaut', maxLength: 300 },
      ] },
      { label: 'Réseaux sociaux', fields: [
        { name: 'socialNetworks', type: 'array', label: 'Réseaux sociaux', labels: { singular: 'Réseau', plural: 'Réseaux' }, fields: [
          { name: 'platform', type: 'select', label: 'Plateforme', required: true, options: [
            { label: 'LinkedIn', value: 'linkedin' }, { label: 'Facebook', value: 'facebook' },
            { label: 'X', value: 'x' }, { label: 'YouTube', value: 'youtube' }, { label: 'Instagram', value: 'instagram' },
          ] },
          { name: 'url', type: 'text', label: 'URL HTTPS', required: true, validate: (value: unknown) => typeof value === 'string' ? validateHTTPSURL(value) : 'Utilisez une URL HTTPS valide.' },
        ] },
      ] },
    ] },
  ],
  hooks: { afterChange: [revalidatePublicGlobal('site-settings')] },
}
