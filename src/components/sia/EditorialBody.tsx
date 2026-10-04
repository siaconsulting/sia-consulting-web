import type { ReactNode } from 'react'
import { Section } from '@/components/sia/Section'
import { Container } from '@/components/sia/Container'
import RichText from '@/components/RichText'

export function EditorialBody({ children, data, id }: { children?: ReactNode; data?: Parameters<typeof RichText>[0]['data']; id?: string }) {
  if (!children && !data) return null
  return (
    <Section className="sia-editorial-body-section" id={id}>
      <Container className="sia-editorial-body-layout">
        <div className="sia-editorial-body-aside" aria-hidden="true"><span /></div>
        <div className="sia-editorial-body-content">
          {children ?? <RichText data={data!} enableGutter={false} enableProse={false} />}
        </div>
      </Container>
    </Section>
  )
}
