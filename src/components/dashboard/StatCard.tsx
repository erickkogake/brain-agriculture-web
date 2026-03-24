'use client'

import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  suffix?: string
  icon: React.ReactNode
  color: 'green' | 'amber' | 'soil'
  delay?: number
}

const colorMap = {
  green: {
    icon: 'bg-meadow-100 text-meadow-600',
    accent: 'bg-meadow-500',
  },
  amber: {
    icon: 'bg-harvest-100 text-harvest-600',
    accent: 'bg-harvest-500',
  },
  soil: {
    icon: 'bg-soil-100 text-soil-600',
    accent: 'bg-soil-500',
  },
}

export function StatCard({ label, value, suffix, icon, color, delay = 0 }: StatCardProps) {
  const { icon: iconClass, accent } = colorMap[color]

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-stone-200/80 shadow-sm p-6 relative overflow-hidden',
        'animate-fade-up',
        `animate-fade-up-${delay + 1}`,
      )}
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-0.5', accent)} />

      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-4', iconClass)}>
        {icon}
      </div>

      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="font-display text-3xl font-semibold text-stone-900 leading-none">
        {value}
        {suffix && <span className="text-lg text-stone-400 ml-1">{suffix}</span>}
      </p>
    </div>
  )
}
