'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import type { PieChartItem } from '@/types'

interface PieChartCardProps {
  title: string
  subtitle: string
  data: PieChartItem[]
  colorScheme: 'green' | 'amber' | 'soil'
  delay?: number
  valueFormatter?: (v: number) => string
}

const palettes = {
  green: ['#3d8c47','#5ea869','#8ec595','#bbdebf','#dceede','#f0f7f0'],
  amber: ['#d97706','#f59e0b','#fbbf24','#fcd34d','#fde68a','#fef3c7'],
  soil:  ['#8f5f38','#a97748','#bc9268','#d0b490','#e3d3bc','#f2ebe0'],
}

const CustomTooltip = ({
  active, payload, valueFormatter,
}: {
  active?: boolean
  payload?: any[]
  valueFormatter?: (v: number) => string
}) => {
  if (!active || !payload?.length) return null
  const { name, value, payload: p } = payload[0]
  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-stone-700">{name}</p>
      <p className="text-stone-500 mt-0.5">
        {valueFormatter ? valueFormatter(value) : value} · {p.percentage}%
      </p>
    </div>
  )
}

export function PieChartCard({ title, subtitle, data, colorScheme, delay = 0, valueFormatter }: PieChartCardProps) {
  const colors = palettes[colorScheme]
  const isEmpty = data.length === 0

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-stone-200/80 shadow-sm p-6',
        'animate-fade-up',
        `animate-fade-up-${delay + 1}`,
      )}
    >
      <div className="mb-4">
        <p className="font-display text-sm font-semibold text-stone-800">{title}</p>
        <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
      </div>

      {isEmpty ? (
        <div className="h-48 flex items-center justify-center text-stone-300 text-sm">
          Sem dados disponíveis
        </div>
      ) : (
        <>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-3 space-y-1.5">
            {data.slice(0, 5).map((item, i) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{ background: colors[i % colors.length] }}
                  />
                  <span className="text-stone-600 truncate max-w-[120px]">{item.label}</span>
                </div>
                <span className="font-medium text-stone-800 tabular-nums">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
