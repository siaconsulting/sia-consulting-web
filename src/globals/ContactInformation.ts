import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/adminOrEditor'
import { validateHTTPSURL } from '@/utilities/links'
import { revalidatePublicGlobal } from '@/hooks/revalidateGlobal'

export const ContactInformation: GlobalConfig = {
  slug: 'contact-information',
  label: 'Coordonnées',
  access: { read: anyone, update: adminOrEditor },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Contact', fields: [
        { name: 'generalEmail', type: 'email', label: 'Adresse e-mail générale', admin: { description: 'Cette adresse est destinée à être affichée publiquement.' } },
        { name: 'primaryPhone', type: 'text', label: 'Téléphone principal' },
        { name: 'secondaryPhone', type: 'text', label: 'Téléphone secondaire' },
      ] },
      { label: 'Adresse', fields: [
        { name: 'streetAddress', type: 'text', label: 'Adresse' },
        { name: 'addressComplement', type: 'text', label: "Complément d'adresse" },
        { name: 'poBox', type: 'text', label: 'Boîte postale' },
        { name: 'postalCode', type: 'text', label: 'Code postal' },
        { name: 'city', type: 'text', label: 'Ville' },
        { name: 'region', type: 'text', label: 'Région' },
        { name: 'country', type: 'text', label: 'Pays' },
        { name: 'mapUrl', type: 'text', label: 'Lien cartographique', validate: (value: unknown) => !value ? true : typeof value === 'string' ? validateHTTPSURL(value) : 'Utilisez une URL HTTPS valide.' },
      ] },
      { label: 'Horaires', fields: [{ name: 'hours', type: 'textarea', label: 'Horaires publics' }] },
    ] },
  ],
  hooks: { afterChange: [revalidatePublicGlobal('contact-information')] },
}
