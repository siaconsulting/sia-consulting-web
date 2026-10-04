import type { HTMLAttributes } from 'react'

export function Eyebrow({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`sia-eyebrow ${className}`.trim()} {...props} />
}
