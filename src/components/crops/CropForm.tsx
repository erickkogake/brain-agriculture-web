'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, SelectField } from '@/components/ui'
import { cropSchema, type CropFormValues } from '@/lib/validations'
import { useCreateCrop } from '@/hooks'
import { CROP_TYPES } from '@/types'

interface CropFormProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  harvestId: string
}

export function CropForm({ open, onOpenChange, harvestId }: CropFormProps) {
  const create = useCreateCrop()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues: { harvestId },
  })

  useEffect(() => {
    reset({ harvestId, type: 'Soja', description: '', plantedArea: '' as any })
  }, [open, harvestId, reset])

  const onSubmit = async (values: CropFormValues) => {
    await create.mutateAsync({ ...values, harvestId })
    onOpenChange(false)
    reset()
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Registrar Cultura" description="Adicione uma cultura à safra selecionada.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('harvestId')} />
        <SelectField
          label="Tipo de Cultura"
          error={errors.type?.message}
          options={CROP_TYPES.map((c) => ({ value: c, label: c }))}
          {...register('type')}
        />
        <Input
          label="Área Plantada (ha)"
          type="number"
          step="0.01"
          placeholder="Ex: 500"
          hint="Opcional"
          error={errors.plantedArea?.message}
          {...register('plantedArea')}
        />
        <Input
          label="Observação"
          placeholder="Informações adicionais (opcional)"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" loading={create.isPending}>Registrar cultura</Button>
        </div>
      </form>
    </Modal>
  )
}
