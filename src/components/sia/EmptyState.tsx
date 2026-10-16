import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return <div className="sia-empty-state">
    <p>{message}</p>
    <Link href="/contact">Échanger avec notre équipe <ArrowUpRight size={18} aria-hidden="true" /></Link>
  </div>
}
