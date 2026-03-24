'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProducer, useDeleteFarm, useCreateFarm, useUpdateFarm, useCreateHarvest, useCreateCrop, useDeleteHarvest, useDeleteCrop } from '@/hooks'
import { Button, Badge, Card, PageHeader, Empty, Confirm, Skeleton } from '@/components/ui'
import { FarmForm } from '@/components/farms/FarmForm'
import { HarvestForm } from '@/components/harvests/HarvestForm'
import { CropForm } from '@/components/crops/CropForm'
import { formatDocument, formatHectares } from '@/lib/utils'
import { ArrowLeft, Plus, Home, Trash2, ChevronDown, ChevronRight, Sprout, CalendarDays, Pencil } from 'lucide-react'
import type { Farm, Harvest, Crop } from '@/types'

export function ProducerDetail({ id }: { id: string }) {
  const { data: producer, isLoading } = useProducer(id)
  const deleteFarm = useDeleteFarm()
  const deleteHarvest = useDeleteHarvest()
  const deleteCrop = useDeleteCrop()

  const [farmFormOpen, setFarmFormOpen] = useState(false)
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null)
  const [deletingFarmId, setDeletingFarmId] = useState<string | null>(null)

  const [harvestFormOpen, setHarvestFormOpen] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)
  const [deletingHarvestId, setDeletingHarvestId] = useState<string | null>(null)

  const [cropFormOpen, setCropFormOpen] = useState(false)
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null)
  const [deletingCropId, setDeletingCropId] = useState<string | null>(null)

  const [expandedFarms, setExpandedFarms] = useState<Set<string>>(new Set())
  const [expandedHarvests, setExpandedHarvests] = useState<Set<string>>(new Set())

  const toggleFarm = (fId: string) => {
    setExpandedFarms((prev) => { const s = new Set(prev); s.has(fId) ? s.delete(fId) : s.add(fId); return s })
  }
  const toggleHarvest = (hId: string) => {
    setExpandedHarvests((prev) => { const s = new Set(prev); s.has(hId) ? s.delete(hId) : s.add(hId); return s })
  }

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
  if (!producer) return <div className="text-stone-400">Produtor não encontrado.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/produtores" className="text-stone-400 hover:text-stone-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-500">Produtores</span>
      </div>

      <PageHeader
        title={producer.name}
        description={`${formatDocument(producer.document, producer.documentType)} · ${producer.documentType}`}
        action={
          <Button onClick={() => { setEditingFarm(null); setFarmFormOpen(true) }}>
            <Plus className="w-4 h-4" /> Nova Fazenda
          </Button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Fazendas', value: producer.farms.length },
          { label: 'Área Total', value: `${formatHectares(producer.farms.reduce((s, f) => s + Number(f.totalArea), 0))} ha` },
          { label: 'Safras', value: producer.farms.reduce((s, f) => s + f.harvests.length, 0) },
        ].map((item) => (
          <Card key={item.label} className="px-5 py-4 flex items-center justify-between">
            <span className="text-xs text-stone-400 uppercase tracking-wide font-medium">{item.label}</span>
            <span className="font-display text-xl font-semibold text-stone-800">{item.value}</span>
          </Card>
        ))}
      </div>

      {/* Farms */}
      {producer.farms.length === 0 ? (
        <Card>
          <Empty
            icon={<Home className="w-6 h-6" />}
            title="Nenhuma fazenda cadastrada"
            description="Cadastre a primeira fazenda deste produtor."
            action={<Button onClick={() => setFarmFormOpen(true)}><Plus className="w-4 h-4" /> Adicionar fazenda</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {producer.farms.map((farm) => {
            const expanded = expandedFarms.has(farm.id)
            const usePct = Number(farm.totalArea) > 0
              ? Math.round(((Number(farm.arableArea) + Number(farm.vegetationArea)) / Number(farm.totalArea)) * 100)
              : 0

            return (
              <Card key={farm.id} className="overflow-hidden">
                {/* Farm header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
                  onClick={() => toggleFarm(farm.id)}
                >
                  <div className="flex items-center gap-3">
                    {expanded ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                    <div>
                      <p className="font-medium text-stone-800">{farm.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{farm.city} · {farm.state} · {formatHectares(Number(farm.totalArea))} ha total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-meadow-400 rounded-full" style={{ width: `${usePct}%` }} />
                      </div>
                      <span className="text-xs text-stone-400 tabular-nums">{usePct}% uso</span>
                    </div>
                    <Badge variant="stone">{farm.harvests.length} safra{farm.harvests.length !== 1 ? 's' : ''}</Badge>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setEditingFarm(farm); setFarmFormOpen(true) }} className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeletingFarmId(farm.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Farm expanded */}
                {expanded && (
                  <div className="border-t border-stone-100 px-5 py-4 bg-stone-50/40">
                    {/* Area breakdown */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Área Total', value: formatHectares(Number(farm.totalArea)), unit: 'ha', color: 'text-stone-700' },
                        { label: 'Agricultável', value: formatHectares(Number(farm.arableArea)), unit: 'ha', color: 'text-meadow-700' },
                        { label: 'Vegetação', value: formatHectares(Number(farm.vegetationArea)), unit: 'ha', color: 'text-soil-700' },
                      ].map((a) => (
                        <div key={a.label} className="bg-white rounded-lg border border-stone-200 px-4 py-3">
                          <p className="text-xs text-stone-400 uppercase tracking-wide">{a.label}</p>
                          <p className={`font-display text-lg font-semibold ${a.color}`}>{a.value} <span className="text-sm font-normal text-stone-400">{a.unit}</span></p>
                        </div>
                      ))}
                    </div>

                    {/* Harvests */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> Safras
                      </p>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedFarmId(farm.id); setHarvestFormOpen(true) }}>
                        <Plus className="w-3.5 h-3.5" /> Safra
                      </Button>
                    </div>

                    {farm.harvests.length === 0 ? (
                      <p className="text-xs text-stone-400 py-2">Nenhuma safra cadastrada.</p>
                    ) : (
                      <div className="space-y-2">
                        {farm.harvests.map((harvest) => {
                          const hExpanded = expandedHarvests.has(harvest.id)
                          return (
                            <div key={harvest.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                              <div
                                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-stone-50/60"
                                onClick={() => toggleHarvest(harvest.id)}
                              >
                                <div className="flex items-center gap-2">
                                  {hExpanded ? <ChevronDown className="w-3.5 h-3.5 text-stone-400" /> : <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
                                  <span className="text-sm font-medium text-stone-700">{harvest.name}</span>
                                  <Badge variant="stone">{harvest.crops.length} cultura{harvest.crops.length !== 1 ? 's' : ''}</Badge>
                                </div>
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => { setSelectedHarvestId(harvest.id); setCropFormOpen(true) }} className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-meadow-600 transition-colors" title="Adicionar cultura">
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setDeletingHarvestId(harvest.id)} className="p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {hExpanded && (
                                <div className="border-t border-stone-100 px-4 py-3 bg-stone-50/30">
                                  {harvest.crops.length === 0 ? (
                                    <p className="text-xs text-stone-400">Nenhuma cultura registrada.</p>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {harvest.crops.map((crop) => (
                                        <div key={crop.id} className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs">
                                          <Sprout className="w-3 h-3 text-meadow-500" />
                                          <span className="text-stone-700 font-medium">{crop.type}</span>
                                          {crop.plantedArea && <span className="text-stone-400">· {formatHectares(Number(crop.plantedArea))} ha</span>}
                                          <button onClick={() => setDeletingCropId(crop.id)} className="ml-1 text-stone-300 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <FarmForm
        open={farmFormOpen}
        onOpenChange={setFarmFormOpen}
        producerId={id}
        editing={editingFarm}
      />
      <HarvestForm
        open={harvestFormOpen}
        onOpenChange={setHarvestFormOpen}
        farmId={selectedFarmId ?? ''}
      />
      <CropForm
        open={cropFormOpen}
        onOpenChange={setCropFormOpen}
        harvestId={selectedHarvestId ?? ''}
      />

      <Confirm
        open={!!deletingFarmId}
        onOpenChange={(v) => !v && setDeletingFarmId(null)}
        title="Excluir fazenda?"
        description="Isso excluirá a fazenda com todas as safras e culturas. Irreversível."
        onConfirm={async () => { await deleteFarm.mutateAsync(deletingFarmId!); setDeletingFarmId(null) }}
        loading={deleteFarm.isPending}
      />
      <Confirm
        open={!!deletingHarvestId}
        onOpenChange={(v) => !v && setDeletingHarvestId(null)}
        title="Excluir safra?"
        description="Todas as culturas desta safra serão removidas."
        onConfirm={async () => { await deleteHarvest.mutateAsync(deletingHarvestId!); setDeletingHarvestId(null) }}
        loading={deleteHarvest.isPending}
      />
      <Confirm
        open={!!deletingCropId}
        onOpenChange={(v) => !v && setDeletingCropId(null)}
        title="Remover cultura?"
        description="A cultura será removida desta safra."
        onConfirm={async () => { await deleteCrop.mutateAsync(deletingCropId!); setDeletingCropId(null) }}
        loading={deleteCrop.isPending}
      />
    </div>
  )
}
