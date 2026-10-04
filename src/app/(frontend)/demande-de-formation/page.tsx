import type { Metadata } from 'next'
import { Container } from '@/components/sia/Container'
import { TrainingRequestForm } from '@/components/sia/PublicSubmissionForms.client'
import { getTrainingSubmissionOptions } from '@/data/submissionOptions'
import { getSubmissionFormRuntime } from '@/services/submissions/formRuntime'
import { getPublicRoutePath } from '@/utilities/publicRoutes'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const metadata: Metadata = {
  title: 'Demande de formation | SIA Consulting',
  description: 'Transmettre une demande concernant une formation du catalogue ou un besoin spécifique.',
  alternates: { canonical: new URL(getPublicRoutePath('trainingRequest'), getServerSideURL()).toString() },
  robots: { index: false, follow: true },
}

export default async function TrainingRequestPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const requestedSlug = Array.isArray(params.formation) ? params.formation[0] : params.formation
  const [{ trainings }, security] = await Promise.all([
    getTrainingSubmissionOptions(), getSubmissionFormRuntime('training'),
  ])
  const selectedTraining = trainings.find((training) => training.slug === requestedSlug)?.slug

  return <div className="sia-request-page">
    <header className="sia-request-hero"><Container>
      <p className="sia-editorial-eyebrow">Construire une demande adaptée</p>
      <h1>Demande de formation</h1>
      <p>Choisissez une formation du catalogue ou décrivez un besoin spécifique.</p>
    </Container></header>
    <section className="sia-request-form-section"><Container>
      <div className="sia-request-form-intro"><h2>Votre besoin</h2><p>Les champs marqués d’un astérisque sont obligatoires.</p></div>
      <TrainingRequestForm security={security} trainings={trainings} selectedTraining={selectedTraining} />
    </Container></section>
  </div>
}
