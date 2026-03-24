// ─── Enums ───────────────────────────────────────────────────────────────────

export type DocumentType = 'CPF' | 'CNPJ'

export type CropType =
  | 'Soja'
  | 'Milho'
  | 'Algodão'
  | 'Café'
  | 'Cana de Açúcar'
  | 'Trigo'
  | 'Arroz'
  | 'Feijão'
  | 'Mandioca'
  | 'Sorgo'
  | 'Outros'

export const CROP_TYPES: CropType[] = [
  'Soja', 'Milho', 'Algodão', 'Café', 'Cana de Açúcar',
  'Trigo', 'Arroz', 'Feijão', 'Mandioca', 'Sorgo', 'Outros',
]

export const BRAZIL_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Producer {
  id: string
  document: string
  documentType: DocumentType
  name: string
  farms: Farm[]
  createdAt: string
  updatedAt: string
}

export interface Farm {
  id: string
  name: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
  producerId: string
  producer?: Producer
  harvests: Harvest[]
  createdAt: string
  updatedAt: string
}

export interface Harvest {
  id: string
  name: string
  year: number
  farmId: string
  farm?: Farm
  crops: Crop[]
  createdAt: string
  updatedAt: string
}

export interface Crop {
  id: string
  type: CropType
  description?: string
  plantedArea?: number
  harvestId: string
  harvest?: Harvest
  createdAt: string
  updatedAt: string
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateProducerDto { document: string; name: string }
export interface UpdateProducerDto { document?: string; name?: string }

export interface CreateFarmDto {
  producerId: string; name: string; city: string; state: string
  totalArea: number; arableArea: number; vegetationArea: number
}
export interface UpdateFarmDto {
  name?: string; city?: string; state?: string
  totalArea?: number; arableArea?: number; vegetationArea?: number
}

export interface CreateHarvestDto { farmId: string; name: string; year: number }
export interface UpdateHarvestDto { name?: string; year?: number }

export interface CreateCropDto {
  harvestId: string; type: CropType; description?: string; plantedArea?: number
}
export interface UpdateCropDto { type?: CropType; description?: string; plantedArea?: number }

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> { success: boolean; data: T; timestamp: string }

export interface ApiError {
  statusCode: number; message: string | string[]
  error: string; timestamp: string; path: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface PieChartItem { label: string; value: number; percentage: number }

export interface DashboardStats {
  overview: { totalProducers: number; totalFarms: number; totalHectares: number }
  byState: PieChartItem[]
  byCrop: PieChartItem[]
  byLandUse: PieChartItem[]
}
