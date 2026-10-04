import type { CaseStudy } from '@/payload-types'

export type PublicCaseStudyClient = {
  clientDisclosure?: CaseStudy['clientDisclosure']
  anonymousClientLabel?: string | null
  clientReference?: number | null | { name: string }
}

/** Never resolve a reference for an anonymized case, even if inconsistent data is encountered. */
export function getPublicCaseStudyClientLabel(study: PublicCaseStudyClient) {
  if (study.clientDisclosure === 'anonymous') return study.anonymousClientLabel?.trim() || null
  if (study.clientDisclosure === 'named' && typeof study.clientReference === 'object' && study.clientReference) {
    return study.clientReference.name
  }
  return null
}
