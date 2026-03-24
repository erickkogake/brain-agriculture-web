import { z } from 'zod'
import { BRAZIL_STATES, CROP_TYPES, type CropType } from '@/types'

function isValidCPF(cpf: string): boolean {
  const c = cpf.replace(/\D/g, '')
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += +c[i] * (10 - i)
  let r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  if (r !== +c[9]) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += +c[i] * (11 - i)
  r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  return r === +c[10]
}

function isValidCNPJ(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, '')
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false
  const calc = (str: string, w: number[]) => {
    const s = str.split('').reduce((a, d, i) => a + +d * w[i], 0)
    const r = s % 11
    return r < 2 ? 0 : 11 - r
  }
  const d1 = calc(c.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2])
  if (d1 !== +c[12]) return false
  const d2 = calc(c.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2])
  return d2 === +c[13]
}

const documentSchema = z.string().min(1, 'Documento obrigatório').refine((val) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length === 11) return isValidCPF(clean)
  if (clean.length === 14) return isValidCNPJ(clean)
  return false
}, 'CPF ou CNPJ inválido')

export const producerSchema = z.object({
  document: documentSchema,
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
})

export type ProducerFormValues = z.infer<typeof producerSchema>

export const farmSchema = z.object({
  producerId: z.string().uuid('ID do produtor inválido'),
  name: z.string().min(1, 'Nome obrigatório').max(255),
  city: z.string().min(1, 'Cidade obrigatória').max(255),
  state: z.enum(BRAZIL_STATES as [string, ...string[]], { errorMap: () => ({ message: 'Estado inválido' }) }),
  totalArea: z.coerce.number().positive('Área total deve ser maior que zero'),
  arableArea: z.coerce.number().min(0, 'Área agricultável não pode ser negativa'),
  vegetationArea: z.coerce.number().min(0, 'Área de vegetação não pode ser negativa'),
}).refine(
  (d) => d.arableArea + d.vegetationArea <= d.totalArea,
  {
    message: 'Soma das áreas agricultável e vegetação não pode ultrapassar a área total',
    path: ['arableArea'],
  },
)

export type FarmFormValues = z.infer<typeof farmSchema>

export const harvestSchema = z.object({
  farmId: z.string().uuid('ID da fazenda inválido'),
  name: z.string().min(1, 'Nome obrigatório').max(100),
  year: z.coerce.number().int().min(1900).max(2100),
})

export type HarvestFormValues = z.infer<typeof harvestSchema>

export const cropSchema = z.object({
  harvestId: z.string().uuid('ID da safra inválido'),
  type: z.enum(CROP_TYPES as [CropType, ...CropType[]], { errorMap: () => ({ message: 'Tipo de cultura inválido' }) }),
  description: z.string().optional(),
  plantedArea: z.coerce.number().min(0).optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
})

export type CropFormValues = z.infer<typeof cropSchema>