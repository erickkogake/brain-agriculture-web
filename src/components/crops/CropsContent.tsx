'use client'

import { useState } from 'react'
import { useCrops, useDeleteCrop } from '@/hooks'
import { Badge, Card, PageHeader, Empty, Confirm, Skeleton } from '@/components/ui'
import { formatHectares } from '@/lib/utils'
import { Sprout, Trash2 } from 'lucide-react'

const cropColors: Record<string, 'green' | 'amber' | 'soil' | 'stone' | 'blue'> = {
  'Soja':           'green',
  'Milho':          'amber',
  'Café':           'soil',
  'Algodão':        'stone',
  'Cana de Açúcar': 'amber',
  'Trigo':          'amber',
  'Arroz':          'green',
  'Feijão':         'soil',
}

export function CropsContent() {
  const { data: crops, isLoading } = useCrops()
  const deleteMutation = useDeleteCrop()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Culturas"
        description="Culturas plantadas por safra"
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : crops?.length === 0 ? (
        <Card>
          <Empty
            icon={<Sprout className="w-6 h-6" />}
            title="Nenhuma cultura registrada"
            description="Registre culturas nas safras das fazendas."
          />
        </Card>
      ) : (
        <>
          <div className="lg:hidden space-y-3">
            {crops?.map((c, i) => (
              <Card key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-meadow-500 flex-shrink-0" />
                      <Badge variant={cropColors[c.type] ?? 'stone'}>{c.type}</Badge>
                    </div>
                    <button onClick={() => setDeletingId(c.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-stone-400">Safra</p>
                      <p className="text-stone-600">{c.harvest?.name ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">Área Plantada</p>
                      <p className="text-stone-600 tabular-nums">
                        {c.plantedArea ? `${formatHectares(Number(c.plantedArea))} ha` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-400">Fazenda</p>
                      <p className="text-stone-600">{c.harvest?.farm?.name ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">Produtor</p>
                      <p className="text-stone-600">{c.harvest?.farm?.producer?.name ?? '—'}</p>
                    </div>
                  </div>
                  {c.description && <p className="text-xs text-stone-400">{c.description}</p>}
                </div>
              </Card>
            ))}
          </div>

          <Card className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    {['Cultura', 'Área Plantada', 'Safra', 'Fazenda', 'Produtor', 'Descrição', ''].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {crops?.map((c, i) => (
                    <tr key={c.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-meadow-500 flex-shrink-0" />
                          <Badge variant={cropColors[c.type] ?? 'stone'}>{c.type}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600 tabular-nums text-xs">
                        {c.plantedArea ? `${formatHectares(Number(c.plantedArea))} ha` : '—'}
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">{c.harvest?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-stone-500 text-xs">{c.harvest?.farm?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-stone-500 text-xs">{c.harvest?.farm?.producer?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-stone-400 text-xs">{c.description ?? '—'}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => setDeletingId(c.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Confirm
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
        title="Remover cultura?"
        description="Esta cultura será removida da safra."
        onConfirm={async () => { await deleteMutation.mutateAsync(deletingId!); setDeletingId(null) }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}