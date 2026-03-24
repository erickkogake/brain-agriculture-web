import type { Metadata } from 'next'
import { HarvestsContent } from '@/components/harvests/HarvestsContent'

export const metadata: Metadata = { title: 'Safras' }

export default function HarvestsPage() {
  return (
    <div className="p-8">
      <HarvestsContent />
    </div>
  )
}
