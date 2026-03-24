'use client'

import { useDashboard, useProducers } from '@/hooks'
import { StatCard } from './StatCard'
import { PieChartCard } from './PieChartCard'
import { ProducersTable } from './ProducersTable'
import { Skeleton, PageHeader } from '@/components/ui'
import { Users, Home, TreePine } from 'lucide-react'
import { formatHectares } from '@/lib/utils'

export function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useDashboard()
  const { data: producers, isLoading: producersLoading } = useProducers()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral da plataforma de gestão rural"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))
        ) : (
          <>
            <StatCard
              label="Produtores Cadastrados"
              value={stats?.overview.totalProducers ?? 0}
              icon={<Users className="w-5 h-5" />}
              color="green"
              delay={0}
            />
            <StatCard
              label="Fazendas Registradas"
              value={stats?.overview.totalFarms ?? 0}
              icon={<Home className="w-5 h-5" />}
              color="amber"
              delay={1}
            />
            <StatCard
              label="Total de Hectares"
              value={formatHectares(stats?.overview.totalHectares ?? 0)}
              suffix=" ha"
              icon={<TreePine className="w-5 h-5" />}
              color="soil"
              delay={2}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))
        ) : (
          <>
            <PieChartCard
              title="Fazendas por Estado"
              subtitle="Distribuição geográfica"
              data={stats?.byState ?? []}
              colorScheme="green"
              delay={0}
            />
            <PieChartCard
              title="Culturas Plantadas"
              subtitle="Por tipo de cultura"
              data={stats?.byCrop ?? []}
              colorScheme="amber"
              delay={1}
            />
            <PieChartCard
              title="Uso do Solo"
              subtitle="Agricultável vs Vegetação"
              data={stats?.byLandUse ?? []}
              colorScheme="soil"
              delay={2}
              valueFormatter={(v) => `${formatHectares(v)} ha`}
            />
          </>
        )}
      </div>

      {/* Producers Table */}
      <div className="animate-fade-up animate-fade-up-4">
        {producersLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <ProducersTable producers={producers ?? []} />
        )}
      </div>
    </div>
  )
}
