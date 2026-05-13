# Spec: Correcciones de Seguridad y Tipado — React_Famy

Fecha: 2026-05-13
Status: draft

---

## Contexto

El análisis identificó issues críticos de seguridad y deuda técnica de tipos que requieren corrección antes de que el proyecto pueda considerarse production-ready.

---

## Scope

Este spec cubre dos ciclos de trabajo separados:
1. **Ciclo 1:** Correcciones de seguridad (middleware + rutas [id] + env validation)
2. **Ciclo 2:** Tipado completo de stores Zustand

---

## Ciclo 1: Seguridad

### 1.1 Middleware de Autenticación

**Archivo:** `src/middleware.ts`

```typescript
export { auth as middleware } from "@/lib/auth/auth.config"

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

- Usa el `auth` export de `auth.config.ts` (ya existe comoNamed export)
- Protege todas las rutas bajo `/dashboard/*`
- Redirige a `/login` si no hay sesión (comportamiento por defecto de NextAuth)

### 1.2 Rutas [id] con Verificación de Ownership

**Archivos a crear:**

| Ruta | Verbo | Verificación |
|------|-------|--------------|
| `api/gastos-fijos/[id]/route.ts` | PUT, DELETE | `where: { id, userId: session.user.id }` |
| `api/tarjetas/[id]/route.ts` | PUT, DELETE | `where: { id, userId: session.user.id }` |
| `api/colegiaturas/[id]/route.ts` | PUT, DELETE | `where: { id, userId: session.user.id }` |
| `api/mantenimiento/[id]/route.ts` | PUT, DELETE | `where: { id, userId: session.user.id }` |

**Patrón para todos:**
```typescript
// PUT
export async function PUT(req, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.[model].updateMany({ where: { id, userId: session.user.id }, data: body })
  if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ data: await prisma.[model].findUnique({ where: { id } }) })
}

// DELETE
export async function DELETE(req, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  await prisma.[model].deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ data: null })
}
```

### 1.3 Validación de NEXTAUTH_SECRET

**Archivo:** `src/lib/auth/auth.config.ts`

Agregar al inicio del archivo:
```typescript
if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET === "react-famy-secret-key-change-in-production") {
  throw new Error("NEXTAUTH_SECRET must be set to a secure random string in production")
}
```

O en alternativa más elegante, validar en `src/lib/auth/auth.config.ts` usando una función helper que intente detectar dev vs prod.

---

## Ciclo 2: Tipado de Stores

### 2.1 Interfaces derivadas de Prisma

Cada store debe definir su tipo basado en el modelo Prisma correspondiente:

```typescript
// use-gastos-store.ts
import type { GastoFijo } from "@prisma/client"

interface GastosFijosState {
  gastos: GastoFijo[]
  isLoading: boolean
  addGasto: (gasto: GastoFijo) => void
  updateGasto: (id: string, gasto: Partial<GastoFijo>) => void
  deleteGasto: (id: string) => void
  setGastos: (gastos: GastoFijo[]) => void
  setLoading: (loading: boolean) => void
}
```

### 2.2 Stores a corregir

| Store | Tipo a usar |
|-------|-------------|
| `use-gastos-store.ts` | `GastoFijo` de `@prisma/client` |
| `use-ingresos-store.ts` | `Ingreso` de `@prisma/client` |
| `use-tarjetas-store.ts` | `Tarjeta` de `@prisma/client` |
| `use-colegiaturas-store.ts` | `Colegiatura` de `@prisma/client` |
| `use-mantenimiento-store.ts` | `Mantenimiento` de `@prisma/client` |

### 2.3 Manejo de respuestas DELETE

En todas las pages que usan `handleDelete`, actualizar para verificar `res.ok`:

```typescript
const handleDelete = async (id: string) => {
  const res = await fetch(`/api/tarjetas/${id}`, { method: "DELETE" })
  if (res.ok) {
    deleteTarjeta(id)
  } else {
    const error = await res.json()
    console.error("Error deleting:", error)
  }
}
```

---

## Archivos a modificar

### Seguridad
- `src/middleware.ts` (crear)
- `src/app/api/gastos-fijos/[id]/route.ts` (crear)
- `src/app/api/tarjetas/[id]/route.ts` (crear)
- `src/app/api/colegiaturas/[id]/route.ts` (crear)
- `src/app/api/mantenimiento/[id]/route.ts` (crear)
- `src/lib/auth/auth.config.ts` (modificar)

### Tipado
- `src/stores/use-gastos-store.ts` (modificar)
- `src/stores/use-ingresos-store.ts` (modificar)
- `src/stores/use-tarjetas-store.ts` (modificar)
- `src/stores/use-colegiaturas-store.ts` (modificar)
- `src/stores/use-mantenimiento-store.ts` (modificar)
- `src/app/(dashboard)/gastos-fijos/page.tsx` (modificar)
- `src/app/(dashboard)/tarjetas/page.tsx` (modificar)
- `src/app/(dashboard)/ingresos/page.tsx` (modificar)

---

## Notas

- No se requieren cambios en la UI. Los cambios son 100% backend/infrastructure.
- Los nuevos endpoints `[id]` siguen el mismo patrón existente en `api/ingresos/[id]/route.ts`.
- El middleware NextAuth requiere que `auth.config.ts` exporte `auth` como named export (ya existe).