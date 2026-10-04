import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'solid' | 'outline'

export function ActionLink({
  className = '',
  variant = 'solid',
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; variant?: Variant }) {
  return <Link className={`sia-action sia-action--${variant} ${className}`.trim()} {...props} />
}

export function ActionButton({
  className = '',
  variant = 'solid',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`sia-action sia-action--${variant} ${className}`.trim()} {...props} />
}
