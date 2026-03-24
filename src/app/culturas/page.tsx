import type { Metadata } from 'next'
import { CropsContent } from '@/components/crops/CropsContent'

export const metadata: Metadata = { title: 'Culturas' }

export default function CropsPage() {
  return (
    <div className="p-8">
      <CropsContent />
    </div>
  )
}
