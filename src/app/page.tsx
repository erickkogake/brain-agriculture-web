import type { Metadata } from 'next'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="p-8">
      <DashboardContent />
    </div>
  )
}
