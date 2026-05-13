# Correcciones de Seguridad y Tipado — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir vulnerabilidades de seguridad (middleware, rutas [id], validación env) y tipar todos los stores Zustand con tipos de Prisma.

**Architecture:** Dividido en dos ciclos — Ciclo 1 (seguridad) crea el middleware y las rutas [id] faltantes. Ciclo 2 (tipado) reemplaza `any[]` por tipos de Prisma en todos los stores.

**Tech Stack:** Next.js 15, NextAuth 5, Prisma, TypeScript strict mode.

---

## CICLO 1: SEGURIDAD

### Task 1: Crear middleware de autenticación

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Crear src/middleware.ts**

```typescript
export { auth as middleware } from "@/lib/auth/auth.config"

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add auth middleware to protect dashboard routes"
```

---

### Task 2: Agregar validación de NEXTAUTH_SECRET en auth.config

**Files:**
- Modify: `src/lib/auth/auth.config.ts:1-3`

- [ ] **Step 1: Agregar validación al inicio de auth.config.ts**

Agregar después del primer import:

```typescript
if (process.env.NODE_ENV === "production" &&
    (!process.env.NEXTAUTH_SECRET ||
     process.env.NEXTAUTH_SECRET === "react-famy-secret-key-change-in-production")) {
  throw new Error("NEXTAUTH_SECRET must be set to a secure random string in production")
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth/auth.config.ts
git commit -m "feat: validate NEXTAUTH_SECRET in production"
```

---

### Task 3: Crear ruta [id] para gastos-fijos

**Files:**
- Create: `src/app/api/gastos-fijos/[id]/route.ts`

- [ ] **Step 1: Crear api/gastos-fijos/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth.config"
import { prisma } from "@/lib/db/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.gastoFijo.updateMany({ where: { id, userId: session.user.id }, data: body })
  if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ data: await prisma.gastoFijo.findUnique({ where: { id } }) })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  await prisma.gastoFijo.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ data: null })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/gastos-fijos/[id]/route.ts
git commit -m "feat: add PUT/DELETE endpoints for gastos-fijos with user ownership check"
```

---

### Task 4: Crear ruta [id] para tarjetas

**Files:**
- Create: `src/app/api/tarjetas/[id]/route.ts`

- [ ] **Step 1: Crear api/tarjetas/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth.config"
import { prisma } from "@/lib/db/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.tarjeta.updateMany({ where: { id, userId: session.user.id }, data: body })
  if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ data: await prisma.tarjeta.findUnique({ where: { id } }) })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  await prisma.tarjeta.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ data: null })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/tarjetas/[id]/route.ts
git commit -m "feat: add PUT/DELETE endpoints for tarjetas with user ownership check"
```

---

### Task 5: Crear ruta [id] para colegiaturas

**Files:**
- Create: `src/app/api/colegiaturas/[id]/route.ts`

- [ ] **Step 1: Crear api/colegiaturas/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth.config"
import { prisma } from "@/lib/db/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.colegiatura.updateMany({ where: { id, userId: session.user.id }, data: body })
  if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ data: await prisma.colegiatura.findUnique({ where: { id } }) })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  await prisma.colegiatura.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ data: null })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/colegiaturas/[id]/route.ts
git commit -m "feat: add PUT/DELETE endpoints for colegiaturas with user ownership check"
```

---

### Task 6: Crear ruta [id] para mantenimiento

**Files:**
- Create: `src/app/api/mantenimiento/[id]/route.ts`

- [ ] **Step 1: Crear api/mantenimiento/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth.config"
import { prisma } from "@/lib/db/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.mantenimiento.updateMany({ where: { id, userId: session.user.id }, data: body })
  if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ data: await prisma.mantenimiento.findUnique({ where: { id } }) })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  await prisma.mantenimiento.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ data: null })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/mantenimiento/[id]/route.ts
git commit -m "feat: add PUT/DELETE endpoints for mantenimiento with user ownership check"
```

---

## CICLO 2: TIPADO DE STORES

### Task 7: Tipar use-gastos-store

**Files:**
- Modify: `src/stores/use-gastos-store.ts`
- Modify: `src/app/(dashboard)/gastos-fijos/page.tsx:31-34`

- [ ] **Step 1: Reemplazar any[] por tipo Prisma en use-gastos-store.ts**

Reemplazar todo el contenido:

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GastoFijo } from "@prisma/client"

interface GastosFijosState {
  gastos: GastoFijo[]
  isLoading: boolean
  addGasto: (gasto: GastoFijo) => void
  updateGasto: (id: string, updated: Partial<GastoFijo>) => void
  deleteGasto: (id: string) => void
  setGastos: (gastos: GastoFijo[]) => void
  setLoading: (loading: boolean) => void
}

export const useGastosStore = create<GastosFijosState>()(
  persist(
    (set) => ({
      gastos: [],
      isLoading: false,
      addGasto: (gasto) =>
        set((state) => ({ gastos: [...state.gastos, gasto] })),
      updateGasto: (id, updated) =>
        set((state) => ({
          gastos: state.gastos.map((g) =>
            g.id === id ? { ...g, ...updated } : g
          ),
        })),
      deleteGasto: (id) =>
        set((state) => ({
          gastos: state.gastos.filter((g) => g.id !== id),
        })),
      setGastos: (gastos) => set({ gastos }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "gastos-storage" }
  )
)
```

- [ ] **Step 2: Agregar verificación de respuesta en handleDelete de gastos-fijos/page.tsx**

En `src/app/(dashboard)/gastos-fijos/page.tsx`, línea 31-34 cambiar:

```typescript
const handleDelete = async (id: string) => {
  const res = await fetch(`/api/gastos-fijos/${id}`, { method: "DELETE" })
  if (res.ok) {
    deleteGasto(id)
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/use-gastos-store.ts src/app/\(dashboard\)/gastos-fijos/page.tsx
git commit -m "fix: type use-gastos-store with Prisma types and verify DELETE response"
```

---

### Task 8: Tipar use-ingresos-store

**Files:**
- Modify: `src/stores/use-ingresos-store.ts`
- Modify: `src/app/(dashboard)/ingresos/page.tsx:31-34`

- [ ] **Step 1: Reemplazar any[] por tipo Prisma en use-ingresos-store.ts**

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Ingreso } from "@prisma/client"

interface IngresosState {
  ingresos: Ingreso[]
  isLoading: boolean
  addIngreso: (ingreso: Ingreso) => void
  updateIngreso: (id: string, updated: Partial<Ingreso>) => void
  deleteIngreso: (id: string) => void
  setIngresos: (ingresos: Ingreso[]) => void
  setLoading: (loading: boolean) => void
}

export const useIngresosStore = create<IngresosState>()(
  persist(
    (set) => ({
      ingresos: [],
      isLoading: false,
      addIngreso: (ingreso) =>
        set((state) => ({ ingresos: [...state.ingresos, ingreso] })),
      updateIngreso: (id, updated) =>
        set((state) => ({
          ingresos: state.ingresos.map((i) =>
            i.id === id ? { ...i, ...updated } : i
          ),
        })),
      deleteIngreso: (id) =>
        set((state) => ({
          ingresos: state.ingresos.filter((i) => i.id !== id),
        })),
      setIngresos: (ingresos) => set({ ingresos }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "ingresos-storage" }
  )
)
```

- [ ] **Step 2: Agregar verificación de respuesta en handleDelete de ingresos/page.tsx**

En `src/app/(dashboard)/ingresos/page.tsx`, línea 31-34 cambiar:

```typescript
const handleDelete = async (id: string) => {
  const res = await fetch(`/api/ingresos/${id}`, { method: "DELETE" })
  if (res.ok) {
    deleteIngreso(id)
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/use-ingresos-store.ts src/app/\(dashboard\)/ingresos/page.tsx
git commit -m "fix: type use-ingresos-store with Prisma types and verify DELETE response"
```

---

### Task 9: Tipar use-tarjetas-store

**Files:**
- Modify: `src/stores/use-tarjetas-store.ts`
- Modify: `src/app/(dashboard)/tarjetas/page.tsx:30-33`

- [ ] **Step 1: Reemplazar any[] por tipo Prisma en use-tarjetas-store.ts**

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Tarjeta } from "@prisma/client"

interface TarjetasState {
  tarjetas: Tarjeta[]
  isLoading: boolean
  addTarjeta: (tarjeta: Tarjeta) => void
  updateTarjeta: (id: string, updated: Partial<Tarjeta>) => void
  deleteTarjeta: (id: string) => void
  setTarjetas: (tarjetas: Tarjeta[]) => void
  setLoading: (loading: boolean) => void
}

export const useTarjetasStore = create<TarjetasState>()(
  persist(
    (set) => ({
      tarjetas: [],
      isLoading: false,
      addTarjeta: (tarjeta) =>
        set((state) => ({ tarjetas: [...state.tarjetas, tarjeta] })),
      updateTarjeta: (id, updated) =>
        set((state) => ({
          tarjetas: state.tarjetas.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),
      deleteTarjeta: (id) =>
        set((state) => ({
          tarjetas: state.tarjetas.filter((t) => t.id !== id),
        })),
      setTarjetas: (tarjetas) => set({ tarjetas }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "tarjetas-storage" }
  )
)
```

- [ ] **Step 2: Agregar verificación de respuesta en handleDelete de tarjetas/page.tsx**

En `src/app/(dashboard)/tarjetas/page.tsx`, línea 30-33 cambiar:

```typescript
const handleDelete = async (id: string) => {
  const res = await fetch(`/api/tarjetas/${id}`, { method: "DELETE" })
  if (res.ok) {
    deleteTarjeta(id)
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/use-tarjetas-store.ts src/app/\(dashboard\)/tarjetas/page.tsx
git commit -m "fix: type use-tarjetas-store with Prisma types and verify DELETE response"
```

---

### Task 10: Tipar use-colegiaturas-store

**Files:**
- Modify: `src/stores/use-colegiaturas-store.ts`

- [ ] **Step 1: Reemplazar any[] por tipo Prisma en use-colegiaturas-store.ts**

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Colegiatura } from "@prisma/client"

interface ColegiaturasState {
  colegiaturas: Colegiatura[]
  isLoading: boolean
  addColegiatura: (colegiatura: Colegiatura) => void
  updateColegiatura: (id: string, updated: Partial<Colegiatura>) => void
  deleteColegiatura: (id: string) => void
  setColegiaturas: (colegiaturas: Colegiatura[]) => void
  setLoading: (loading: boolean) => void
}

export const useColegiaturasStore = create<ColegiaturasState>()(
  persist(
    (set) => ({
      colegiaturas: [],
      isLoading: false,
      addColegiatura: (colegiatura) =>
        set((state) => ({ colegiaturas: [...state.colegiaturas, colegiatura] })),
      updateColegiatura: (id, updated) =>
        set((state) => ({
          colegiaturas: state.colegiaturas.map((c) =>
            c.id === id ? { ...c, ...updated } : c
          ),
        })),
      deleteColegiatura: (id) =>
        set((state) => ({
          colegiaturas: state.colegiaturas.filter((c) => c.id !== id),
        })),
      setColegiaturas: (colegiaturas) => set({ colegiaturas }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "colegiaturas-storage" }
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/use-colegiaturas-store.ts
git commit -m "fix: type use-colegiaturas-store with Prisma types"
```

---

### Task 11: Tipar use-mantenimiento-store

**Files:**
- Modify: `src/stores/use-mantenimiento-store.ts`

- [ ] **Step 1: Reemplazar any[] por tipo Prisma en use-mantenimiento-store.ts**

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Mantenimiento } from "@prisma/client"

interface MantenimientoState {
  mantenimientos: Mantenimiento[]
  isLoading: boolean
  addMantenimiento: (mantenimiento: Mantenimiento) => void
  updateMantenimiento: (id: string, updated: Partial<Mantenimiento>) => void
  deleteMantenimiento: (id: string) => void
  setMantenimientos: (mantenimientos: Mantenimiento[]) => void
  setLoading: (loading: boolean) => void
}

export const useMantenimientoStore = create<MantenimientoState>()(
  persist(
    (set) => ({
      mantenimientos: [],
      isLoading: false,
      addMantenimiento: (mantenimiento) =>
        set((state) => ({ mantenimientos: [...state.mantenimientos, mantenimiento] })),
      updateMantenimiento: (id, updated) =>
        set((state) => ({
          mantenimientos: state.mantenimientos.map((m) =>
            m.id === id ? { ...m, ...updated } : m
          ),
        })),
      deleteMantenimiento: (id) =>
        set((state) => ({
          mantenimientos: state.mantenimientos.filter((m) => m.id !== id),
        })),
      setMantenimientos: (mantenimientos) => set({ mantenimientos }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "mantenimiento-storage" }
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/use-mantenimiento-store.ts
git commit -m "fix: type use-mantenimiento-store with Prisma types"
```

---

## Verificación

Después de completar todos los tasks:

1. Ejecutar `npm run build` para verificar que no hay errores de tipos
2. Verificar que las rutas de dashboard redirigen a login cuando no hay sesión
3. Probar que un DELETE que falla no actualiza el store (verificar res.ok)

---

**Total: 11 tasks — 2 ciclos de trabajo**

Plan saved to: `docs/superpowers/plans/2026-05-13-seguridad-tipado-fixes.md`