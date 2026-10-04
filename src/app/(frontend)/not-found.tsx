import { ActionLink } from '@/components/sia/Action'
import { Container } from '@/components/sia/Container'

export default function NotFound() {
  return (
    <main className="sia-not-found">
      <Container>
        <p className="sia-editorial-eyebrow">SIA Consulting</p>
        <h1>Cette page est introuvable.</h1>
        <p>Le lien a peut-être changé ou cette page n’existe plus.</p>
        <ActionLink href="/">Retour à l’accueil</ActionLink>
      </Container>
    </main>
  )
}
