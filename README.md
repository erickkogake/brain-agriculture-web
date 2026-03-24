# 🌱 Brain Agriculture — Web

Frontend do sistema de gestão de produtores rurais, desenvolvido com **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Executar](#-como-executar)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Páginas](#-páginas)
- [Arquitetura Frontend](#-arquitetura-frontend)

---

## 🎯 Visão Geral

Interface completa para gerenciamento de produtores rurais. Conecta-se à [brain-agriculture-api](../brain-agriculture) via REST.

**Funcionalidades:**
- ✅ Dashboard com estatísticas e gráficos de pizza (por estado, cultura e uso do solo)
- ✅ CRUD completo de Produtores com validação de CPF/CNPJ no cliente
- ✅ CRUD de Fazendas com validação de áreas em tempo real
- ✅ CRUD de Safras por fazenda
- ✅ Registro de Culturas por safra
- ✅ Página de detalhe do produtor com hierarquia completa (Fazenda → Safra → Cultura)
- ✅ Notificações toast de sucesso/erro
- ✅ Estados de loading com skeletons
- ✅ Modais de confirmação para exclusões

---

## 🛠 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 14 | Framework React com App Router |
| **TypeScript** | 5 | Tipagem estática |
| **Tailwind CSS** | 3 | Estilização utilitária |
| **TanStack Query** | 5 | Server state, cache e sincronização |
| **React Hook Form** | 7 | Formulários performáticos |
| **Zod** | 3 | Validação de schemas com CPF/CNPJ |
| **Recharts** | 2 | Gráficos de pizza do dashboard |
| **Axios** | 1 | HTTP client com interceptors |
| **Radix UI** | — | Primitivos acessíveis (Dialog, AlertDialog) |
| **Sonner** | 1 | Toast notifications |
| **Lucide React** | — | Ícones |
| **Framer Motion** | 11 | Animações (disponível, uso opcional) |

---

## 📁 Estrutura de Pastas

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (fontes, providers, sidebar)
│   ├── globals.css              # Estilos globais + keyframes
│   ├── page.tsx                 # Dashboard /
│   ├── produtores/
│   │   ├── page.tsx             # Lista de produtores
│   │   └── [id]/page.tsx        # Detalhe do produtor
│   ├── fazendas/page.tsx        # Lista de fazendas
│   ├── safras/page.tsx          # Lista de safras
│   └── culturas/page.tsx        # Lista de culturas
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navegação lateral fixa
│   │   └── Providers.tsx        # QueryClientProvider + Devtools
│   ├── ui/
│   │   └── index.tsx            # Button, Input, SelectField, Badge, Card,
│   │                            # Modal, Confirm, Skeleton, Empty, PageHeader
│   ├── dashboard/
│   │   ├── DashboardContent.tsx # Orquestra stats + charts + tabela
│   │   ├── StatCard.tsx         # Card de métrica com ícone e acento
│   │   ├── PieChartCard.tsx     # Gráfico de pizza com legenda
│   │   └── ProducersTable.tsx   # Tabela resumo do dashboard
│   ├── producers/
│   │   ├── ProducersContent.tsx # Lista + CRUD de produtores
│   │   ├── ProducerDetail.tsx   # Hierarquia completa do produtor
│   │   └── ProducerForm.tsx     # Modal de criação/edição
│   ├── farms/
│   │   ├── FarmsContent.tsx     # Lista + CRUD de fazendas
│   │   └── FarmForm.tsx         # Modal com validação de áreas em tempo real
│   ├── harvests/
│   │   ├── HarvestsContent.tsx  # Lista + CRUD de safras
│   │   └── HarvestForm.tsx      # Modal de safra
│   └── crops/
│       ├── CropsContent.tsx     # Lista + exclusão de culturas
│       └── CropForm.tsx         # Modal de cultura
│
├── hooks/
│   └── index.ts                 # Todos os hooks React Query (useProducers,
│                                # useFarms, useDashboard, mutations...)
│
├── services/
│   └── index.ts                 # Camada de acesso à API (producersService,
│                                # farmsService, dashboardService...)
│
├── lib/
│   ├── api-client.ts            # Instância axios configurada
│   ├── utils.ts                 # cn(), formatDocument(), formatHectares()
│   └── validations.ts           # Schemas Zod + validação CPF/CNPJ client-side
│
└── types/
    └── index.ts                 # Interfaces TypeScript (Producer, Farm,
                                 # Harvest, Crop, DashboardStats, DTOs...)
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+
- A **[API backend](../brain-agriculture)** rodando em `http://localhost:3000`

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variável de ambiente

```bash
cp .env.local.example .env.local
# Edite se necessário: NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 3. Rodar em modo desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3001
```

### 4. Build de produção

```bash
npm run build
npm start
```

### 5. Com Docker

```bash
# Apenas o frontend
docker-compose up -d

# Junto com o backend (na raiz do projeto)
docker-compose up -d
```

---

## ⚙️ Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | URL base da API backend |

---

## 📄 Páginas

| Rota | Descrição |
|---|---|
| `/` | Dashboard com estatísticas, gráficos e tabela de produtores |
| `/produtores` | Lista completa com CRUD de produtores |
| `/produtores/:id` | Detalhe do produtor com fazendas, safras e culturas aninhadas |
| `/fazendas` | Lista de todas as fazendas com métricas de uso do solo |
| `/safras` | Lista de safras com vínculo à fazenda e produtor |
| `/culturas` | Lista de culturas com vínculo completo na hierarquia |

---

## 🏗 Arquitetura Frontend

```
Página (page.tsx)
    └── Content Component (orquestração, estado local de UI)
            ├── Hooks (React Query — dados e mutations)
            │       └── Services (axios — chamadas HTTP)
            ├── Form Components (React Hook Form + Zod)
            └── UI Components (Button, Card, Modal, Badge...)
```

### Fluxo de dados

```
API Backend → axios (api-client) → Service → React Query Hook → Componente
                                                    ↓
                                              Cache automático
                                              Invalidação após mutations
                                              Retry em falha
```

### Gerenciamento de estado

- **Server state**: TanStack Query — cache, sincronização, background refetch
- **Form state**: React Hook Form — sem re-renders desnecessários
- **UI state**: `useState` local — modals, confirmações, item selecionado

---

## 🎨 Design System

**Fontes:**
- `Playfair Display` — títulos e headings (display)
- `DM Sans` — corpo de texto e UI
- `DM Mono` — documentos CPF/CNPJ

**Paleta principal:**
- `meadow` (verde) — ações primárias, status ativo, área agricultável
- `harvest` (âmbar) — CNPJ, safras, alertas
- `soil` (marrom) — área de vegetação, accents terciários
- `stone` — texto, bordas, neutros

**Componentes base** (todos em `src/components/ui/index.tsx`):
`Button`, `Input`, `SelectField`, `Badge`, `Card`, `Modal`, `Confirm`, `Skeleton`, `Empty`, `PageHeader`
