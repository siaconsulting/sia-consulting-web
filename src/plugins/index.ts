import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateDescription, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { SIA_SEARCH_COLLECTIONS, withLegacySearchRelations } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { getCollectionDetailPath, type PublicCollection } from '@/utilities/publicRoutes'

import { getServerSideURL } from '@/utilities/getURL'
import { adminOnly } from '@/access/adminOnly'
import { adminOrEditor } from '@/access/adminOrEditor'
import { canManageEditorial, isAdmin } from '@/access/roles'

type SEOContent = {
  title?: string | null
  slug?: string | null
  shortDescription?: string | null
  summary?: string | null
  excerpt?: string | null
  shortBio?: string | null
  name?: string | null
  jobTitle?: string | null
}

const generateTitle: GenerateTitle<SEOContent> = ({ doc }) => {
  const title = doc?.title || doc?.name
  return title ? `${title} | SIA Consulting` : 'SIA Consulting'
}

const generateDescription: GenerateDescription<SEOContent> = ({ doc }) =>
  doc?.shortDescription || doc?.summary || doc?.excerpt || doc?.shortBio || ''

const generateURL: GenerateURL<SEOContent> = ({ collectionConfig, doc }) => {
  const url = getServerSideURL()
  if (!collectionConfig || !doc?.slug) return url
  if (collectionConfig.slug === 'pages') return `${url}${doc.slug === 'home' ? '' : `/${doc.slug}`}`
  if (collectionConfig.slug === 'posts') return `${url}/posts/${doc.slug}`
  const detailPath = getCollectionDetailPath(collectionConfig.slug as PublicCollection, doc.slug)
  return detailPath ? `${url}${detailPath}` : url
}

export const redirectCollections = [
  'pages', 'posts', 'services', 'sectors', 'trainings', 'publications', 'case-studies', 'team-members', 'resources',
]

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: redirectCollections,
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
    collections: ['services', 'sectors', 'trainings', 'publications', 'case-studies', 'team-members', 'resources'],
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
    collections: [...SIA_SEARCH_COLLECTIONS],
    beforeSync: beforeSyncWithSearch,
    deleteDrafts: true,
    syncDrafts: false,
    searchOverrides: {
      labels: { singular: 'Résultat de recherche', plural: 'Résultats de recherche' },
      access: { create: adminOnly, read: () => true, update: adminOnly, delete: adminOnly },
      admin: { hidden: ({ user }) => !canManageEditorial(user) },
      fields: withLegacySearchRelations,
    },
  }),
]
