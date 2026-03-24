'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input } from '@/components/ui'
import { harvestSchema, type HarvestFormValues } from '@/lib/validations'
import { useCreateHarvest, useUpdateHarvest } from '@/hooks'
import type { Harvest } from '@/types'

interface HarvestFormProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  farmId: string
  editing?: Harvest | null
}

export function HarvestForm({ open, onOpenChange, farmId, editing }: HarvestFormProps) {
  const create = useCreateHarvest()
  const update = useUpdateHarvest()
  const isEditing = !!editing

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    defaultValues: { farmId, year: new Date().getFullYear() },
  })

  useEffect(() => {
    if (editing) reset({ farmId, name: editing.name, year: editing.year })
    else reset({ farmId, name: '', year: new Date().getFullYear() })
  }, [editing, open, farmId, reset])

  const onSubmit = async (values: HarvestFormValues) => {
    if (isEditing && editing) {
      await update.mutateAsync({ id: editing.id, dto: { name: values.name, year: values.year } })
    } else {
      await create.mutateAsync(values)
    }
    onOpenChange(false)
    reset()
  }

  const loading = create.isPending || update.isPending

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isEditing ? 'Editar Safra' : 'Nova Safra'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('farmId')} />
        <Input label="Nome da Safra" placeholder="Ex: Safra 2024" error={errors.name?.message} {...register('name')} />
        <Input label="Ano" type="number" placeholder="2024" error={errors.year?.message} {...register('year')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" loading={loading}>{isEditing ? 'Salvar' : 'Cadastrar safra'}</Button>
        </div>
      </form>
    </Modal>
  )
}
