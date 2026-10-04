import { Container } from '@/components/sia/Container'
import { Section } from '@/components/sia/Section'

export function CatalogPageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <Section className="sia-catalog-intro" aria-labelledby="sia-catalog-title"><Container>
    <p className="sia-editorial-eyebrow">{eyebrow}</p>
    <h1 id="sia-catalog-title">{title}</h1>
    <p className="sia-catalog-intro-description">{description}</p>
  </Container></Section>
}
