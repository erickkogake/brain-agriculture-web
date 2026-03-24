'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input } from '@/components/ui'
import { producerSchema, type ProducerFormValues } from '@/lib/validations'
import { useCreateProducer, useUpdateProducer } from '@/hooks'
import type { Producer } from '@/types'

interface ProducerFormProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: Producer | null
}

export function ProducerForm({ open, onOpenChange, editing }: ProducerFormProps) {
  const create = useCreateProducer()
  const update = useUpdateProducer()
  const isEditing = !!editing

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProducerFormValues>({
    resolver: zodResolver(producerSchema),
  })

  useEffect(() => {
    if (editing) {
      reset({ name: editing.name, document: editing.document })
    } else {
      reset({ name: '', document: '' })
    }
  }, [editing, reset, open])

  const onSubmit = async (values: ProducerFormValues) => {
    if (isEditing && editing) {
      await update.mutateAsync({ id: editing.id, dto: values })
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
      title={isEditing ? 'Editar Produtor' : 'Novo Produtor'}
      description={isEditing ? 'Atualize os dados do produtor rural.' : 'Cadastre um novo produtor rural.'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome do Produtor"
          placeholder="Ex: João Carlos da Silva"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="CPF ou CNPJ"
          placeholder="Ex: 529.982.247-25"
          hint="Aceita com ou sem formatação"
          error={errors.document?.message}
          {...register('document')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar produtor'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
