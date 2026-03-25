import { apiClient } from '@/lib/api-client'
import type {
  ApiResponse, Producer, Farm, Harvest, Crop, DashboardStats,
  CreateProducerDto, UpdateProducerDto,
  CreateFarmDto, UpdateFarmDto,
  CreateHarvestDto, UpdateHarvestDto,
  CreateCropDto, UpdateCropDto,
} from '@/types'

export const producersService = {
  findAll: async (): Promise<Producer[]> => {
    const { data } = await apiClient.get<ApiResponse<Producer[]>>('/producers')
    return data.data
  },
  findOne: async (id: string): Promise<Producer> => {
    const { data } = await apiClient.get<ApiResponse<Producer>>(`/producers/${id}`)
    return data.data
  },
  create: async (dto: CreateProducerDto): Promise<Producer> => {
    const { data } = await apiClient.post<ApiResponse<Producer>>('/producers', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateProducerDto): Promise<Producer> => {
    const { data } = await apiClient.put<ApiResponse<Producer>>(`/producers/${id}`, dto)
    return data.data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/producers/${id}`)
  },
}

export const farmsService = {
  findAll: async (producerId?: string): Promise<Farm[]> => {
    const params = producerId ? { producerId } : {}
    const { data } = await apiClient.get<ApiResponse<Farm[]>>('/farms', { params })
    return data.data
  },
  findOne: async (id: string): Promise<Farm> => {
    const { data } = await apiClient.get<ApiResponse<Farm>>(`/farms/${id}`)
    return data.data
  },
  create: async (dto: CreateFarmDto): Promise<Farm> => {
    const { data } = await apiClient.post<ApiResponse<Farm>>('/farms', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateFarmDto): Promise<Farm> => {
    const { data } = await apiClient.put<ApiResponse<Farm>>(`/farms/${id}`, dto)
    return data.data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/farms/${id}`)
  },
}

export const harvestsService = {
  findAll: async (farmId?: string): Promise<Harvest[]> => {
    const params = farmId ? { farmId } : {}
    const { data } = await apiClient.get<ApiResponse<Harvest[]>>('/harvests', { params })
    return data.data
  },
  findOne: async (id: string): Promise<Harvest> => {
    const { data } = await apiClient.get<ApiResponse<Harvest>>(`/harvests/${id}`)
    return data.data
  },
  create: async (dto: CreateHarvestDto): Promise<Harvest> => {
    const { data } = await apiClient.post<ApiResponse<Harvest>>('/harvests', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateHarvestDto): Promise<Harvest> => {
    const { data } = await apiClient.put<ApiResponse<Harvest>>(`/harvests/${id}`, dto)
    return data.data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/harvests/${id}`)
  },
}

export const cropsService = {
  findAll: async (harvestId?: string): Promise<Crop[]> => {
    const params = harvestId ? { harvestId } : {}
    const { data } = await apiClient.get<ApiResponse<Crop[]>>('/crops', { params })
    return data.data
  },
  findOne: async (id: string): Promise<Crop> => {
    const { data } = await apiClient.get<ApiResponse<Crop>>(`/crops/${id}`)
    return data.data
  },
  create: async (dto: CreateCropDto): Promise<Crop> => {
    const { data } = await apiClient.post<ApiResponse<Crop>>('/crops', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateCropDto): Promise<Crop> => {
    const { data } = await apiClient.put<ApiResponse<Crop>>(`/crops/${id}`, dto)
    return data.data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/crops/${id}`)
  },
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard')
    return data.data
  },
}
