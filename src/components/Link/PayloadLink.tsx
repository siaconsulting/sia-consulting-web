import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Header } from '@/payload-types'
import type { LinkData } from '@/utilities/links'
import { resolveLinkHref } from '@/utilities/links'

export type PayloadLinkData = NonNullable<NonNullable<Header['navItems']>[number]>['link'] & LinkData

type PayloadLinkProps = {
  link: PayloadLinkData
  className?: string
  children?: ReactNode
}

export function PayloadLink({ link, className, children }: PayloadLinkProps) {
  const href = resolveLinkHref(link)
  if (!href || !link.label) return null
  const external = /^(https:|mailto:|tel:)/.test(href)
  const target = link.newTab ? '_blank' : undefined
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined
  const content = children ?? link.label

  if (external || target) {
    return <a className={className} href={href} rel={rel} target={target}>{content}</a>
  }

  return <Link className={className} href={href}>{content}</Link>
}
