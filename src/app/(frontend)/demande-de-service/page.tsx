import type { Metadata } from 'next'
import { Container } from '@/components/sia/Container'
import { ServiceRequestForm } from '@/components/sia/PublicSubmissionForms.client'
import { getServiceSubmissionOptions } from '@/data/submissionOptions'
import { getSubmissionFormRuntime } from '@/services/submissions/formRuntime'
import { getPublicRoutePath } from '@/utilities/publicRoutes'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const metadata: Metadata = {
  title: 'Demande de prestation | SIA Consulting',
  description: 'Transmettre une demande concernant une expertise SIA Consulting.',
  alternates: { canonical: new URL(getPublicRoutePath('serviceRequest'), getServerSideURL()).toString() },
  robots: { index: false, follow: true },
}

export default async function ServiceRequestPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const requestedSlug = Array.isArray(params.service) ? params.service[0] : params.service
  const [{ services, sectors }, security] = await Promise.all([
    getServiceSubmissionOptions(), getSubmissionFormRuntime('service'),
  ])
  const selectedService = services.find((service) => service.slug === requestedSlug)?.slug

  return <div className="sia-request-page">
    <header className="sia-request-hero"><Container>
      <p className="sia-editorial-eyebrow">Parlons de votre besoin</p>
      <h1>Demande de prestation</h1>
      <p>Présentez votre besoin et indiquez l’expertise concernée.</p>
    </Container></header>
    <section className="sia-request-form-section"><Container>
      <div className="sia-request-form-intro"><h2>Votre demande</h2><p>Les champs marqués d’un astérisque sont obligatoires.</p></div>
      {services.length ? <ServiceRequestForm security={security} services={services} sectors={sectors} selectedService={selectedService} />
        : <p className="sia-form-feedback" role="status">Aucune expertise publiée ne peut actuellement être sélectionnée.</p>}
    </Container></section>
  </div>
}
