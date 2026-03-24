'use client'

import Link from 'next/link'
import { Card, Badge } from '@/components/ui'
import { formatDocument, formatHectares } from '@/lib/utils'
import type { Producer } from '@/types'
import { ArrowRight } from 'lucide-react'

interface ProducersTableProps {
  producers: Producer[]
}

export function ProducersTable({ producers }: ProducersTableProps) {
  return (
    <Card>
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
        <div>
          <p className="font-display text-sm font-semibold text-stone-800">Produtores Recentes</p>
          <p className="text-xs text-stone-400 mt-0.5">{producers.length} cadastrados</p>
        </div>
        <Link href="/produtores" className="text-xs text-meadow-600 hover:text-meadow-700 font-medium flex items-center gap-1 transition-colors">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {producers.length === 0 ? (
        <div className="py-12 text-center text-stone-400 text-sm">
          Nenhum produtor cadastrado
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Produtor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Fazendas</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Área Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Uso Agrícola</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {producers.slice(0, 8).map((p) => {
                const totalArea = p.farms.reduce((s, f) => s + Number(f.totalArea), 0)
                const totalArable = p.farms.reduce((s, f) => s + Number(f.arableArea), 0)
                const pct = totalArea > 0 ? Math.round((totalArable / totalArea) * 100) : 0

                return (
                  <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-800">{p.name}</p>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">
                        {formatDocument(p.document, p.documentType)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.documentType === 'CPF' ? 'green' : 'amber'}>
                        {p.documentType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{p.farms.length}</td>
                    <td className="px-6 py-4 text-stone-600 tabular-nums">
                      {formatHectares(totalArea)} ha
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden min-w-[60px]">
                          <div
                            className="h-full bg-meadow-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-stone-500 tabular-nums w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/produtores/${p.id}`}
                        className="text-stone-400 hover:text-meadow-600 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
