'use client'

import { useState } from 'react'
import { useHarvests, useDeleteHarvest } from '@/hooks'
import { Button, Badge, Card, PageHeader, Empty, Confirm, Skeleton } from '@/components/ui'
import { HarvestForm } from './HarvestForm'
import { Plus, CalendarDays, Trash2, Sprout, Pencil } from 'lucide-react'
import type { Harvest } from '@/types'

export function HarvestsContent() {
  const { data: harvests, isLoading } = useHarvests()
  const deleteMutation = useDeleteHarvest()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Harvest | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safras"
        description="Registros de safras por fazenda"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="w-4 h-4" /> Nova Safra</Button>}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : harvests?.length === 0 ? (
        <Card>
          <Empty
            icon={<CalendarDays className="w-6 h-6" />}
            title="Nenhuma safra cadastrada"
            description="Adicione safras às fazendas já cadastradas."
          />
        </Card>
      ) : (
        <>
          <div className="lg:hidden space-y-3">
            {harvests?.map((h, i) => (
              <Card key={h.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-stone-800">{h.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{h.farm?.name ?? '—'}</p>
                      {h.farm?.producer?.name && <p className="text-xs text-stone-400">{h.farm.producer.name}</p>}
                    </div>
                    <Badge variant="blue">{h.year}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-stone-500">
                      <Sprout className="w-3.5 h-3.5 text-meadow-400" />
                      <span className="text-xs">{h.crops.length} cultura{h.crops.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(h); setFormOpen(true) }} className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeletingId(h.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    {['Safra', 'Ano', 'Fazenda', 'Produtor', 'Culturas', ''].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {harvests?.map((h, i) => (
                    <tr key={h.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                      <td className="px-6 py-4 font-medium text-stone-800">{h.name}</td>
                      <td className="px-6 py-4"><Badge variant="blue">{h.year}</Badge></td>
                      <td className="px-6 py-4 text-stone-500 text-xs">{h.farm?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-stone-500 text-xs">{h.farm?.producer?.name ?? '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-stone-500">
                          <Sprout className="w-3.5 h-3.5 text-meadow-400" />
                          <span className="text-xs">{h.crops.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => { setEditing(h); setFormOpen(true) }} className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeletingId(h.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {formOpen && editing && (
        <HarvestForm open={formOpen} onOpenChange={setFormOpen} farmId={editing.farmId} editing={editing} />
      )}

      <Confirm
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
        title="Excluir safra?"
        description="Todas as culturas desta safra serão removidas."
        onConfirm={async () => { await deleteMutation.mutateAsync(deletingId!); setDeletingId(null) }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}