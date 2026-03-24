import type { Metadata } from 'next'
import { ProducersContent } from '@/components/producers/ProducersContent'

export const metadata: Metadata = { title: 'Produtores' }

export default function ProducersPage() {
  return (
    <div className="p-8">
      <ProducersContent />
    </div>
  )
}
