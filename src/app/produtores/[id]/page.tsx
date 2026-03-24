import type { Metadata } from 'next'
import { ProducerDetail } from '@/components/producers/ProducerDetail'

export const metadata: Metadata = { title: 'Produtor' }

export default function ProducerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <ProducerDetail id={params.id} />
    </div>
  )
}
