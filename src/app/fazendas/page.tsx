import type { Metadata } from 'next'
import { FarmsContent } from '@/components/farms/FarmsContent'

export const metadata: Metadata = { title: 'Fazendas' }

export default function FarmsPage() {
  return (
    <div className="p-8">
      <FarmsContent />
    </div>
  )
}
