import type { HTMLAttributes } from 'react'

type SectionProps = HTMLAttributes<HTMLElement> & { as?: 'section' | 'div' }

export function Section({ as: Element = 'section', className = '', ...props }: SectionProps) {
  return <Element className={`sia-section ${className}`.trim()} {...props} />
}

export function SectionHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`sia-section-header ${className}`.trim()} {...props} />
}
