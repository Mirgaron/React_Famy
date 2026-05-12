---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-12'
inputDocuments:
  - _bmad-output/planning-artifacts/prd-react-famy.md
workflowType: 'architecture'
project_name: 'React_Famy'
user_name: 'Leon'
date: '2026-05-12'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Document Setup

**Created:** `planning-artifacts/architecture-react-famy.md` from template
**Workflow:** bmad-create-architecture
**Language:** Spanish (comunicación y documentación)

## Input Documents Discovered

- PRD: 1 archivo cargado → `prd-react-famy.md` (Sistema Control de Gastos Familiares)

## Resumen del Proyecto (del PRD)

- **Tipo:** App web Next.js para control de gastos familiares
- **MVP:** Dashboard + CRUD ingresos + CRUD gastos fijos + CRUD tarjetas + CRUD cargos + Calendario de cortes
- **Stack:** Next.js 16, Zustand, Prisma, SQLite → PostgreSQL
- **MVP Sprint 1:** 6 features principales, mobile-first

---

## Contexto del Proyecto

El sistema requiere:

- **Gestión de ingresos** — nóminas con frecuencia (quincenal/mensual), earmark a tarjeta
- **Gastos fijos** — con fecha de corte, suscripción mensual/bimestral
- **Colegiaturas** — por hijo, nivel, bimestre
- **Tarjetas de crédito** — banco, últimos 4 dígitos, fecha corte, límite, saldo
- **Cargos a tarjetas** — descripción, monto, MSI (cuotas), mes de corte
- **Mantenimiento casa** — categoría, proveedor, monto, fecha

## Siguiente Paso

Según `step-01-init.md`: cargar `step-02-context.md` para iniciar decisiones arquitectónicas.

---

**¿Tienes documentos adicionales que quieras agregar antes de proceder?** (UX design, research, etc.)

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Dashboard mensual: resumen visual de ingresos vs gastos, estado de cuentas de tarjetas
- CRUD ingresos: nóminas con frecuencia configurable (semanal/quincenal/mensual), earmark a tarjeta
- CRUD gastos fijos: luz, gas, agua, internet, suscripciones; fecha de corte, periodicidad
- CRUD tarjetas de crédito: banco, últimos 4 dígitos, fecha corte, límite, saldo actual
- CRUD cargos a tarjetas: descripción, monto, MSI (1/3/6/12 cuotas), mes de cargo
- Calendario de fechas de corte: visualización mensual con alertas de proximidad
- CRUD colegiaturas: por hijo, nivel educativo, bimestre, monto
- CRUD mantenimiento hogar: categoría, proveedor, monto, fecha

**Non-Functional Requirements:**
- Mobile-first: max 480px, escala hasta 960px
- Carga < 3s en conexión móvil
- Offline para consultas (lectura)
- JWT para autenticación
- Interfaz 100% español
- Soporte hasta 5 miembros familiares, 50 gastos fijos, 200 cargos/mes

**Scale & Complexity:**
- Primary domain: Web full-stack (Next.js + API routes)
- Complexity level: Media-baja
- Estimated architectural components: 8 módulos principales

### Technical Constraints & Dependencies

- Stack definido: Next.js 16, Zustand, Prisma, SQLite → PostgreSQL
- Auth: JWT (NextAuth.js o custom)
- Base de datos: decisión pendiente entre SQLite (dev) y PostgreSQL (prod)
- Límite de 200 cargos/mes sugiere volumen bajo-medio
- Requisito offline: estrategia de cache local (IndexedDB o Zustand persist)

### Cross-Cutting Concerns Identified

- **Gestión de fechas de corte**: Todas las tarjetas tienen fecha de corte; requiere lógica centralizada de cálculo
- **MSI (Monthly Instalments)**: Los cargos pueden fraccionarse en 1, 3, 6 o 12 cuotas — afecta cómo se registran e interoperan con el estado
- **Earmark de ingresos**: Asignar ingresos específicos a tarjetas específicas — estado derivado
- **Alertas de proximidad de corte**: Notificaciones cuando una fecha de corte se acerca (3-5 días antes)
- **Dashboard reactivo**: Cambios en ingresos/gastos/tarjetas deben reflejarse instantáneamente — Zustand ideal para esto
- **Persistencia offline**: Sincronización entre estado en memoria y base de datos

---

## Siguiente Paso

Según `step-02-context.md`: cargar `step-03-starter.md` para evaluar opciones de starter template.

**[C]** Continuar a evaluación de starter template → `step-03-starter.md`

---

## Starter Template Evaluation

### Primary Technology Domain

**Web full-stack (Next.js + API routes)** basado en el análisis del PRD — aplicación móvil-first con backend integrado.

### Starter Options Considered

| Starter | Evaluación |
|---------|------------|
| `create-next-app` vanilla | ✅ Elegido — PRD ya define el stack completo (Zustand, Prisma, Tailwind) |
| T3 Stack | ❌ Sobrecargado — incluye tRPC, Next-Auth, Tailwind que ya tenemos o no necesitamos |
| Next.js + Supabase | ❌ Supabase overkill para el volumen de datos del proyecto |
| RedwoodJS | ❌ Enfoque diferente, no encaja con API routes de Next.js |

### Selected Starter: `create-next-app` (vanilla)

**Rationale for Selection:**
- El PRD ya define stack completo: Next.js 16, TypeScript, Tailwind, Zustand, Prisma
- No necesitamos las integraciones adicionales de T3 u otros starters
- Control total sobre la estructura del proyecto
- Compatibilidad perfecta con el ecosistema Next.js

**Initialization Command:**

```bash
npx create-next-app@latest react-famy \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git \
  --yes
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript strict mode
- Next.js 16 (latest stable)
- Node.js 18+

**Styling Solution:**
- Tailwind CSS (mobile-first, responsive)
- Clases de utilidad para componentes
- Configuración predefinida para breakpoints móviles

**Build Tooling:**
- Next.js built-in (webpack/turbopack)
- ESLint + Prettier
- Optimizaciones de producción automáticas

**Testing Framework:**
- Jest (vía create-next-app)
- Testing Library para componentes React
- Coverage básico configurado

**Code Organization:**
```
src/
├── app/           # App Router (pages + API routes)
├── components/    # Componentes React reutilizables
├── lib/           # Utilidades y helpers
├── stores/        # Zustand stores
└── types/         # Tipos TypeScript
```

**Development Experience:**
- Hot Module Replacement (HMR)
- Fast Refresh para componentes
- Source maps en desarrollo

---

## Siguiente Paso

Según `step-03-starter.md`: cargar `step-04-decisions.md` para tomar decisiones arquitectónicas específicas.

**[C]** Continuar a decisiones arquitectónicas → `step-04-decisions.md`

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Validación de datos: Zod
- Formularios: React Hook Form + Zod
- UI Components: shadcn/ui

**Important Decisions (Shape Architecture):**
- Auth: NextAuth.js v5
- Persistencia offline: Zustand persist + localStorage

**Deferred Decisions (Post-MVP):**
- Notificaciones push (Telegram bot integration)
- Reportes avanzados/exportación

### Data Architecture

**Database Provider:**
- **Development:** SQLite (Prisma + SQLite)
- **Production:** PostgreSQL
- **Rationale:** PRD define SQLite → PostgreSQL; volumen bajo de datos no justifica complejidad de PostgreSQL en dev
- **Version:** SQLite 3.x (bundled with Node.js), PostgreSQL 15+

**Data Validation:**
- **Library:** Zod v3
- **Rationale:** Inferencia de tipos automática, mejor integración TypeScript que Yup, validation schemas compartidos client/server
- **Version:** zod@3.x (latest stable)

**ORM:**
- **Library:** Prisma
- **Rationale:** Type-safe, migrations, schema-first, excelente DX
- **Version:** prisma@5.x, @prisma/client@5.x

### Authentication & Security

**Authentication:**
- **Library:** NextAuth.js v5 (Auth.js)
- **Strategy:** JWT (credentials provider para email/password)
- **Session:** JWT con refresh automático
- **Version:** next-auth@5.x (beta, pero estable para Next.js 14+)

**Security Measures:**
- Middleware de autenticación en todas las rutas `/api/*` excepto `/api/auth/*`
- Passwords hasheados con bcrypt
- CSRF protection vía NextAuth
- Rate limiting básico en API routes

### API & Communication Patterns

**API Design:**
- RESTful via Next.js API Routes (`/app/api/*`)
- Request/Response con tipos Zod compartidos
- Error handling estándar: `{ error: string, details?: object }`

**Form Handling:**
- **Library:** React Hook Form + Zod Resolver
- **Rationale:** Mínimo re-renders, validación en tiempo real, tipos inferidos
- **Version:** react-hook-form@7.x, @hookform/resolvers@3.x

### Frontend Architecture

**State Management:**
- **Library:** Zustand
- **Persistence:** zustand/middleware persist + localStorage
- **Stores:** Separate stores por dominio (ingresos, gastos, tarjetas, etc.)
- **Version:** zustand@4.x

**UI Components:**
- **Library:** shadcn/ui
- **Base:** Radix UI (headless) + Tailwind CSS
- **Rationale:** Minimal, copy-paste (no bundle bloat), accesibles, tailwind-native
- **Components planned:** Button, Input, Label, Select, Dialog, Calendar, Card, Table, Tabs, Badge

**Routing:**
- Next.js App Router
- Route Groups para layouts: `(auth)`, `(dashboard)`
- Dynamic routes: `/tarjetas/[id]`, `/gastos/[id]`

### Infrastructure & Deployment

**Hosting:**
- **Development:** Local (`npm run dev`)
- **Production:** Vercel (recomendado) o cualquier Node.js hosting
- **Rationale:** Next.js native, preview deployments, Edge support

**Environment Configuration:**
```
DATABASE_URL=file:./dev.db (dev) / postgresql://... (prod)
NEXTAUTH_SECRET=<generated>
NEXTAUTH_URL=http://localhost:3000
```

**CI/CD (Post-MVP):**
- GitHub Actions para lint + test
- Vercel auto-deploy en main

### Decision Impact Analysis

**Implementation Sequence:**
1. Inicializar Next.js con `create-next-app`
2. Instalar y configurar Prisma + SQLite
3. Configurar shadcn/ui
4. Implementar auth con NextAuth.js
5. Crear stores de Zustand
6. Implementar API routes para cada dominio
7. Construir UI components y páginas

**Cross-Component Dependencies:**
- shadcn/ui requiere Tailwind (del starter) ✓
- Zod con React Hook Form (validación compartida) ✓
- NextAuth requiere middleware de autenticación ✓
- Zustand persist requiere localStorage (disponible en browser) ✓

---

## Siguiente Paso

Según `step-04-decisions.md`: cargar `step-05-patterns.md` para definir patrones de implementación.

**[C]** Continuar a patrones de implementación → `step-05-patterns.md`

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 6 áreas donde agentes AI podrían tomar decisiones diferentes

### Naming Patterns

**Database Naming Conventions (Prisma):**
- Tablas: `snake_case` plural → `users`, `tarjetas`, `gastos_fijos`
- Columnas: `snake_case` → `user_id`, `created_at`, `fecha_corte`
- Foreign keys: `nombre_tabla_id` → `tarjeta_id`, `user_id`
- Enum values: `snake_case` uppercase → `TIPO_INGRESO`, `FRECUENCIA_MENSUAL`

**API Naming Conventions:**
- Endpoints: `kebab-case` plural → `/api/tarjetas`, `/api/gastos-fijos`
- Route params: `kebab-case` → `/api/tarjetas/[tarjeta-id]`
- Query params: `camelCase` → `?sortBy=fechaCorte&order=desc`
- Body fields: `camelCase` (matching TypeScript)

**Code Naming Conventions:**
- Variables/functions: `camelCase` → `getIngresos`, `tarjetaActual`
- Componentes React: `PascalCase` → `TarjetaCard`, `IngresoForm`
- Archivos: `kebab-case` → `tarjeta-card.tsx`, `use-tarjetas.ts`
- Constantes: `UPPER_SNAKE_CASE` → `MAX_CARGOS_MES`, `DIAS_ALERTA_CORTE`

### Structure Patterns

**Project Organization:**
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── dashboard/
│   │   ├── ingresos/
│   │   ├── gastos-fijos/
│   │   ├── tarjetas/
│   │   ├── colegiaturas/
│   │   └── mantenimiento/
│   ├── api/               # API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── ingresos/
│   │   ├── gastos-fijos/
│   │   └── tarjetas/
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Componentes compartidos
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Formularios reutilizables
│   └── layout/           # Header, Footer, Sidebar
├── lib/                   # Utilidades
│   ├── db/               # Prisma client
│   ├── auth/             # NextAuth config
│   ├── schemas/          # Zod schemas compartidos
│   └── utils/            # Helpers (dates, formatters)
├── stores/                # Zustand stores
│   ├── use-ingresos-store.ts
│   ├── use-gastos-store.ts
│   ├── use-tarjetas-store.ts
│   └── use-ui-store.ts
└── types/                # Tipos TypeScript globales
```

**File Structure Patterns:**
- Tests: co-localizados → `tarjeta-card.test.tsx` junto a `tarjeta-card.tsx`
- Componentes por dominio: `/components/tarjetas/tarjeta-card.tsx`
- API routes: `/app/api/tarjetas/route.ts` + `/app/api/tarjetas/[id]/route.ts`

### Format Patterns

**API Response Formats:**
```typescript
// Éxito
{ data: T, error: null }

// Error
{ data: null, error: string, details?: ZodError['errors'] }

// List response
{ data: T[], error: null, pagination?: { page: number, limit: number, total: number } }
```

**Data Exchange Formats:**
- JSON field naming: `camelCase` en API, `snake_case` en DB (Prisma convierte)
- Dates: ISO 8601 strings (`2026-05-12T00:00:00Z`)
- Booleans: `true`/`false` (no 1/0)
- Money: número con 2 decimales (no strings para evitar locale issues)

### Communication Patterns

**State Management Patterns:**
- Updates siempre immutables → `setState(prev => [...prev, newItem])`
- Stores separados por dominio
- Prefijo `is` para booleanos: `isLoading`, `isOpen`, `isEditing`
- Prefijo `has` para possessed: `hasError`, `hasPermission`

**Event Naming:**
- Acciones: `verbNoun` → `addIngreso`, `updateTarjeta`, `deleteGasto`
- Queries: `getNoun` → `getIngresos`, `getTarjetaById`
- Events en componentes: `handleNoun` → `handleSubmit`, `handleClose`

### Process Patterns

**Error Handling Patterns:**
```typescript
try {
  // operación
} catch (error) {
  if (error instanceof ZodError) {
    return { data: null, error: 'Datos inválidos', details: error.errors }
  }
  console.error('Error inesperado:', error)
  return { data: null, error: 'Error interno. Intenta de nuevo.' }
}
```
- Mensajes de error siempre en español para el usuario
- Errores internos no se exponen al cliente
- Errores de validación incluyen detalles de Zod

**Loading State Patterns:**
- Estados: `isLoading` (fetch), `isSubmitting` (mutación)
- UI mientras loading: skeleton screens o spinners
- No bloquear interacción completamente en loads cortos (<200ms)

**Validation Patterns:**
- Zod schemas en `/lib/schemas/` compartidos entre client y server
- React Hook Form + Zod Resolver para todos los formularios
- Mensajes de error en español en los schemas

### Enforcement Guidelines

**All AI Agents MUST:**
- Seguir las convenciones de naming exactamente
- Usar Zod schemas compartidos, no duplicar validación
- Implementar API responses con el formato especificado
- Crear tests co-localizados con los archivos
- Usar stores de Zustand para estado global

**Pattern Enforcement:**
- ESLint rules para naming (via @typescript-eslint/naming-convention)
- Prettier para formato consistente
- Revisión de código para adherence a patrones

### Pattern Examples

**Good Examples:**
```typescript
// Zod schema compartido
export const TarjetaSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  ultimosDigitos: z.string().length(4),
  fechaCorte: z.number().min(1).max(31),
})

// API response
return { data: tarjeta, error: null }

// Store action
addIngreso: (ingreso: Ingreso) => set(state => ({
  ingresos: [...state.ingresos, ingreso]
}))
```

**Anti-Patterns:**
```typescript
// ❌ No hacer esto
const response = { result: ingreso, error: undefined }
setState({ ...state, loading: true }) // mutation!

// ✅ Hacer esto
const response = { data: ingreso, error: null }
setState(prev => ({ ...prev, isLoading: false }))
```

---

## Siguiente Paso

Según `step-05-patterns.md`: cargar `step-06-structure.md` para definir la estructura completa del proyecto.

**[C]** Continuar a estructura del proyecto → `step-06-structure.md`