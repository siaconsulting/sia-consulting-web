import Link from 'next/link'
import { brandFont, bodyFont } from '@/utilities/fonts'
import { cn } from '@/utilities/ui'
import { ActionLink } from '@/components/sia/Action'
import { Container } from '@/components/sia/Container'
import './(frontend)/globals.css'

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={cn(brandFont.variable, bodyFont.variable)}>
      <head>
        <title>Page introuvable | SIA Consulting</title>
        <meta name="robots" content="noindex, follow" />
      </head>
      <body>
        <main className="sia-not-found sia-not-found--global">
          <Container>
            <Link className="sia-not-found-home" href="/" aria-label="SIA Consulting — accueil">
              SIA Consulting
            </Link>
            <p className="sia-editorial-eyebrow">Erreur 404</p>
            <h1>Cette page est introuvable.</h1>
            <p>Le lien a peut-être changé ou cette page n’existe plus.</p>
            <ActionLink href="/">Retour à l’accueil</ActionLink>
          </Container>
          <span className="sia-not-found-plane" aria-hidden="true" />
        </main>
      </body>
    </html>
  )
}
