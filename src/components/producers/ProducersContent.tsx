'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProducers, useDeleteProducer } from '@/hooks'
import { Button, Badge, Card, PageHeader, Empty, Confirm, Skeleton } from '@/components/ui'
import { ProducerForm } from './ProducerForm'
import { formatDocument } from '@/lib/utils'
import { Plus, Users, Pencil, Trash2, ArrowRight, Home } from 'lucide-react'
import type { Producer } from '@/types'

export function ProducersContent() {
  const { data: producers, isLoading } = useProducers()
  const deleteMutation = useDeleteProducer()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Producer | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEdit = (p: Producer) => { setEditing(p); setFormOpen(true) }
  const handleDelete = async () => {
    if (!deletingId) return
    await deleteMutation.mutateAsync(deletingId)
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtores"
        description="Gerencie os produtores rurais cadastrados"
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus className="w-4 h-4" /> Novo Produtor
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : producers?.length === 0 ? (
        <Card>
          <Empty
            icon={<Users className="w-6 h-6" />}
            title="Nenhum produtor cadastrado"
            description="Comece cadastrando o primeiro produtor rural da plataforma."
            action={
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="w-4 h-4" /> Cadastrar produtor
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="lg:hidden space-y-3">
            {producers?.map((p, i) => (
              <Card key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-stone-800">{p.name}</p>
                      <p className="text-xs font-mono text-stone-500 mt-0.5">
                        {formatDocument(p.document, p.documentType)}
                      </p>
                    </div>
                    <Badge variant={p.documentType === 'CPF' ? 'green' : 'amber'}>
                      {p.documentType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                      <Home className="w-3.5 h-3.5 text-stone-400" />
                      {p.farms.length} fazenda{p.farms.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeletingId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link href={`/produtores/${p.id}`} className="p-1.5 rounded-lg hover:bg-meadow-50 text-stone-400 hover:text-meadow-600 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
                    {['Produtor', 'Documento', 'Tipo', 'Fazendas', 'Cadastro', ''].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {producers?.map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60 transition-colors animate-fade-up"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <td className="px-6 py-4 font-medium text-stone-800">{p.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-stone-500">
                        {formatDocument(p.document, p.documentType)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={p.documentType === 'CPF' ? 'green' : 'amber'}>
                          {p.documentType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Home className="w-3.5 h-3.5 text-stone-400" />
                          {p.farms.length}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-400 text-xs">
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors" title="Editar">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeletingId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Link href={`/produtores/${p.id}`} className="p-1.5 rounded-lg hover:bg-meadow-50 text-stone-400 hover:text-meadow-600 transition-colors" title="Ver detalhes">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
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

      <ProducerForm open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <Confirm
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
        title="Excluir produtor?"
        description="Esta ação excluirá o produtor e todas as suas fazendas, safras e culturas. Não pode ser desfeita."
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}