import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { TeamMemberProfile } from '@/components/sia/PeopleReferences'
import { getSiteSettings } from '@/data/globals'
import { getTeamMemberBySlug } from '@/data/teamMembers'
import { createEditorialMetadata } from '@/utilities/editorialMetadata'
import { getServerSideURL } from '@/utilities/getURL'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, settings, { isEnabled }] = await Promise.all([params, getSiteSettings(), draftMode()])
  const person = await getTeamMemberBySlug(slug, isEnabled)
  const path = getCollectionDetailPath('team-members', slug)!
  return createEditorialMetadata({
    title: person?.meta?.title || person?.name,
    description: person?.meta?.description || person?.shortBio,
    path,
    image: person?.meta?.image || person?.photo,
    settings,
    noIndex: isEnabled,
  })
}

export default async function TeamMemberPage({ params }: Props) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const person = await getTeamMemberBySlug(slug, isEnabled)
  const path = getCollectionDetailPath('team-members', slug)!
  if (!person) return <PayloadRedirects url={path} />
  return <>
    <PayloadRedirects disableNotFound url={path} />
    {isEnabled && <LivePreviewListener />}
    <TeamMemberProfile person={person} canonical={`${getServerSideURL().replace(/\/$/, '')}${path}`} />
  </>
}
