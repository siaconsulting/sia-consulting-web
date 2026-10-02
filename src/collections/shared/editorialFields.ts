import type { Field, RowField, TextFieldSingleValidation } from 'payload'
import { slugField } from 'payload'

export const editorialSlugField = (): RowField =>
  slugField({
    required: true,
    overrides: (field) => {
      const slug = field.fields.find((candidate) => 'name' in candidate && candidate.name === 'slug')

      if (slug && slug.type === 'text') {
        slug.label = 'Identifiant URL'
        slug.validate = ((value) => {
          if (typeof value !== 'string' || value.length === 0) return true
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
            ? true
            : 'Utilisez uniquement des lettres minuscules, des chiffres et des tirets.'
        }) as TextFieldSingleValidation
      }

      return field
    },
  })

export const editorialHeroImageField = (): Field => ({
  name: 'heroImage',
  type: 'upload',
  relationTo: 'media',
  label: 'Image principale',
  admin: {
    description: 'Image facultative utilisée pour illustrer la fiche.',
  },
})

export const editorialOrganizationFields = (): Field[] => [
  {
    name: 'featured',
    type: 'checkbox',
    label: 'À la une',
    defaultValue: false,
  },
  {
    name: 'order',
    type: 'number',
    label: "Ordre d'affichage",
    defaultValue: 0,
    min: 0,
    index: true,
    admin: {
      description: 'Les fiches avec le plus petit nombre apparaissent en premier.',
    },
  },
]
