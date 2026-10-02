import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateDescription, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { getServerSideURL } from '@/utilities/getURL'
import { adminOnly } from '@/access/adminOnly'
import { adminOrEditor } from '@/access/adminOrEditor'
import { canManageEditorial, isAdmin } from '@/access/roles'

type SEOContent = {
  title?: string | null
  slug?: string | null
  shortDescription?: string | null
  summary?: string | null
}

const generateTitle: GenerateTitle<SEOContent> = ({ doc }) => {
  return doc?.title ? `${doc.title} | SIA Consulting` : 'SIA Consulting'
}

const generateDescription: GenerateDescription<SEOContent> = ({ doc }) =>
  doc?.shortDescription || doc?.summary || ''

const publicPathByCollection: Record<string, string> = {
  pages: '',
  posts: '/posts',
  services: '/expertises',
  sectors: '/secteurs',
  trainings: '/formations',
}

const generateURL: GenerateURL<SEOContent> = ({ collectionConfig, doc }) => {
  const url = getServerSideURL()
  const prefix = collectionConfig ? publicPathByCollection[collectionConfig.slug] : undefined

  if (!doc?.slug || prefix === undefined) return url
  if (collectionConfig?.slug === 'pages' && doc.slug === 'home') return url

  return `${url}${prefix}/${doc.slug}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
      access: { create: adminOrEditor, delete: adminOnly, update: adminOrEditor },
      admin: { hidden: ({ user }) => !canManageEditorial(user) },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    collections: ['services', 'sectors', 'trainings'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle,
    generateDescription,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      access: {
        create: adminOrEditor,
        delete: adminOnly,
        update: adminOrEditor,
      },
      admin: { hidden: ({ user }) => !canManageEditorial(user) },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      access: { read: adminOnly, update: () => false, delete: adminOnly },
      admin: { hidden: ({ user }) => !isAdmin(user) },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: { hidden: ({ user }) => !canManageEditorial(user) },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
