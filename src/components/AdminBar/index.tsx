'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const frontendCollections = [
  { path: '/expertises', slug: 'services', plural: 'Expertises', singular: 'Expertise' },
  { path: '/secteurs', slug: 'sectors', plural: 'Secteurs', singular: 'Secteur' },
  { path: '/formations', slug: 'trainings', plural: 'Formations', singular: 'Formation' },
  { path: '/publications', slug: 'publications', plural: 'Publications', singular: 'Publication' },
  { path: '/etudes-de-cas', slug: 'case-studies', plural: 'Études de cas', singular: 'Étude de cas' },
  { path: '/ressources', slug: 'resources', plural: 'Ressources', singular: 'Ressource' },
  { path: '/equipe', slug: 'team-members', plural: 'Équipe', singular: 'Membre' },
  { path: '/references', slug: 'references', plural: 'Références', singular: 'Référence' },
] as const

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const collection = frontendCollections.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  )
  const router = useRouter()

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  return (
    <div
      className={cn(baseClass, 'py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection?.slug}
          collectionLabels={collection ? { plural: collection.plural, singular: collection.singular } : undefined}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
