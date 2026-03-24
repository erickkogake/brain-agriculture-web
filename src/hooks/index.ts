'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  producersService, farmsService, harvestsService, cropsService, dashboardService,
} from '@/services'
import type {
  CreateProducerDto, UpdateProducerDto,
  CreateFarmDto, UpdateFarmDto,
  CreateHarvestDto, UpdateHarvestDto,
  CreateCropDto,
} from '@/types'

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  producers: ['producers'] as const,
  producer: (id: string) => ['producers', id] as const,
  farms: (producerId?: string) => ['farms', producerId] as const,
  farm: (id: string) => ['farms', 'detail', id] as const,
  harvests: (farmId?: string) => ['harvests', farmId] as const,
  harvest: (id: string) => ['harvests', 'detail', id] as const,
  crops: (harvestId?: string) => ['crops', harvestId] as const,
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardService.getStats,
    staleTime: 30_000,
  })
}

export function useProducers() {
  return useQuery({
    queryKey: queryKeys.producers,
    queryFn: producersService.findAll,
  })
}

export function useProducer(id: string) {
  return useQuery({
    queryKey: queryKeys.producer(id),
    queryFn: () => producersService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateProducer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProducerDto) => producersService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.producers })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Produtor cadastrado com sucesso!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateProducer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProducerDto }) =>
      producersService.update(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.producers })
      qc.invalidateQueries({ queryKey: queryKeys.producer(id) })
      toast.success('Produtor atualizado!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteProducer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => producersService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.producers })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Produtor excluído.')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useFarms(producerId?: string) {
  return useQuery({
    queryKey: queryKeys.farms(producerId),
    queryFn: () => farmsService.findAll(producerId),
  })
}

export function useFarm(id: string) {
  return useQuery({
    queryKey: queryKeys.farm(id),
    queryFn: () => farmsService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateFarm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateFarmDto) => farmsService.create(dto),
    onSuccess: (farm) => {
      qc.invalidateQueries({ queryKey: queryKeys.farms() })
      qc.invalidateQueries({ queryKey: queryKeys.farms(farm.producerId) })
      qc.invalidateQueries({ queryKey: queryKeys.producers })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Fazenda cadastrada!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateFarm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFarmDto }) =>
      farmsService.update(id, dto),
    onSuccess: (farm) => {
      qc.invalidateQueries({ queryKey: queryKeys.farms() })
      qc.invalidateQueries({ queryKey: queryKeys.farm(farm.id) })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Fazenda atualizada!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteFarm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => farmsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.farms() })
      qc.invalidateQueries({ queryKey: queryKeys.producers })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Fazenda excluída.')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useHarvests(farmId?: string) {
  return useQuery({
    queryKey: queryKeys.harvests(farmId),
    queryFn: () => harvestsService.findAll(farmId),
    enabled: farmId !== undefined ? !!farmId : true,
  })
}

export function useCreateHarvest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateHarvestDto) => harvestsService.create(dto),
    onSuccess: (h) => {
      qc.invalidateQueries({ queryKey: queryKeys.harvests(h.farmId) })
      qc.invalidateQueries({ queryKey: queryKeys.farm(h.farmId) })
      toast.success('Safra cadastrada!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateHarvest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateHarvestDto }) =>
      harvestsService.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['harvests'] })
      toast.success('Safra atualizada!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteHarvest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => harvestsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['harvests'] })
      qc.invalidateQueries({ queryKey: ['farms'] })
      toast.success('Safra excluída.')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useCrops(harvestId?: string) {
  return useQuery({
    queryKey: queryKeys.crops(harvestId),
    queryFn: () => cropsService.findAll(harvestId),
    enabled: harvestId !== undefined ? !!harvestId : true,
  })
}

export function useCreateCrop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateCropDto) => cropsService.create(dto),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: queryKeys.crops(c.harvestId) })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Cultura registrada!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteCrop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cropsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crops'] })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Cultura excluída.')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}