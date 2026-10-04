'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type RevealProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode }

export function Reveal({ children, className = '', ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.visible = 'true'
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    element.dataset.enhanced = 'true'
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`sia-reveal ${className}`.trim()} {...props}>{children}</div>
}
