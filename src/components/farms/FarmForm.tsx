'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, SelectField } from '@/components/ui'
import { farmSchema, type FarmFormValues } from '@/lib/validations'
import { useCreateFarm, useUpdateFarm } from '@/hooks'
import { BRAZIL_STATES } from '@/types'
import type { Farm } from '@/types'

interface FarmFormProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  producerId: string
  editing?: Farm | null
}

export function FarmForm({ open, onOpenChange, producerId, editing }: FarmFormProps) {
  const create = useCreateFarm()
  const update = useUpdateFarm()
  const isEditing = !!editing

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FarmFormValues>({
    resolver: zodResolver(farmSchema),
    defaultValues: { producerId },
  })

  const [total, arable, veg] = watch(['totalArea', 'arableArea', 'vegetationArea'])
  const sum = Number(arable || 0) + Number(veg || 0)
  const overLimit = Number(total || 0) > 0 && sum > Number(total || 0)

  useEffect(() => {
    if (editing) {
      reset({
        producerId,
        name: editing.name,
        city: editing.city,
        state: editing.state,
        totalArea: Number(editing.totalArea),
        arableArea: Number(editing.arableArea),
        vegetationArea: Number(editing.vegetationArea),
      })
    } else {
      reset({ producerId, name: '', city: '', state: 'SP', totalArea: undefined as any, arableArea: undefined as any, vegetationArea: undefined as any })
    }
  }, [editing, open, producerId, reset])

  const onSubmit = async (values: FarmFormValues) => {
    if (isEditing && editing) {
      const { producerId: _pid, ...dto } = values
      await update.mutateAsync({ id: editing.id, dto })
    } else {
      await create.mutateAsync(values)
    }
    onOpenChange(false)
    reset()
  }

  const loading = create.isPending || update.isPending

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Fazenda' : 'Nova Fazenda'}
      description="Preencha os dados da propriedade rural."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('producerId')} />

        <Input
          label="Nome da Fazenda"
          placeholder="Ex: Fazenda Santa Maria"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cidade"
            placeholder="Ex: Ribeirão Preto"
            error={errors.city?.message}
            {...register('city')}
          />
          <SelectField
            label="Estado"
            error={errors.state?.message}
            options={BRAZIL_STATES.map((s) => ({ value: s, label: s }))}
            {...register('state')}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Área Total (ha)"
            type="number"
            step="0.01"
            placeholder="1000"
            error={errors.totalArea?.message}
            {...register('totalArea')}
          />
          <Input
            label="Agricultável (ha)"
            type="number"
            step="0.01"
            placeholder="600"
            error={errors.arableArea?.message}
            {...register('arableArea')}
          />
          <Input
            label="Vegetação (ha)"
            type="number"
            step="0.01"
            placeholder="300"
            error={errors.vegetationArea?.message}
            {...register('vegetationArea')}
          />
        </div>

        {overLimit && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
            ⚠️ Agricultável + Vegetação ({sum.toFixed(1)} ha) ultrapassa a Área Total ({Number(total).toFixed(1)} ha)
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar fazenda'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
