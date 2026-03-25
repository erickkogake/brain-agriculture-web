import type { Metadata } from 'next'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 pt-16 lg:pt-8 lg:px-8">
      <DashboardContent />
    </div>
  )
}