'use client'

import { useState } from 'react'
import { useFarms, useDeleteFarm, useProducers } from '@/hooks'
import { Button, Badge, Card, PageHeader, Empty, Confirm, Skeleton } from '@/components/ui'
import { FarmForm } from './FarmForm'
import { formatHectares } from '@/lib/utils'
import { Plus, Home, Trash2, Pencil } from 'lucide-react'
import type { Farm } from '@/types'

export function FarmsContent() {
  const { data: farms, isLoading } = useFarms()
  const { data: producers } = useProducers()
  const deleteMutation = useDeleteFarm()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Farm | null>(null)
  const [selectedProducerId, setSelectedProducerId] = useState<string>('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEdit = (f: Farm) => {
    setEditing(f)
    setSelectedProducerId(f.producerId)
    setFormOpen(true)
  }

  const handleNew = () => {
    setEditing(null)
    setSelectedProducerId(producers?.[0]?.id ?? '')
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fazendas"
        description="Todas as propriedades rurais cadastradas"
        action={<Button onClick={handleNew}><Plus className="w-4 h-4" /> Nova Fazenda</Button>}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : farms?.length === 0 ? (
        <Card>
          <Empty
            icon={<Home className="w-6 h-6" />}
            title="Nenhuma fazenda cadastrada"
            description="Cadastre uma fazenda vinculada a um produtor."
            action={<Button onClick={handleNew}><Plus className="w-4 h-4" /> Adicionar fazenda</Button>}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {['Fazenda', 'Localização', 'Produtor', 'Área Total', 'Agricultável', 'Vegetação', 'Uso', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {farms?.map((f, i) => {
                  const total = Number(f.totalArea)
                  const arable = Number(f.arableArea)
                  const veg = Number(f.vegetationArea)
                  const pct = total > 0 ? Math.round(((arable + veg) / total) * 100) : 0

                  return (
                    <tr key={f.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                      <td className="px-5 py-4 font-medium text-stone-800">{f.name}</td>
                      <td className="px-5 py-4 text-stone-500 text-xs">{f.city} · <Badge variant="stone">{f.state}</Badge></td>
                      <td className="px-5 py-4 text-stone-500 text-xs">{f.producer?.name ?? '—'}</td>
                      <td className="px-5 py-4 text-stone-600 tabular-nums text-xs">{formatHectares(total)} ha</td>
                      <td className="px-5 py-4 text-meadow-700 tabular-nums text-xs">{formatHectares(arable)} ha</td>
                      <td className="px-5 py-4 text-soil-700 tabular-nums text-xs">{formatHectares(veg)} ha</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-meadow-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-stone-400 tabular-nums">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => handleEdit(f)} className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeletingId(f.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {formOpen && (
        <FarmForm
          open={formOpen}
          onOpenChange={setFormOpen}
          producerId={editing?.producerId ?? selectedProducerId}
          editing={editing}
        />
      )}

      <Confirm
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
        title="Excluir fazenda?"
        description="Esta ação excluirá a fazenda com todas as suas safras e culturas. Irreversível."
        onConfirm={async () => { await deleteMutation.mutateAsync(deletingId!); setDeletingId(null) }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
