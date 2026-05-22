# Corte y Pagos MSI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar pantalla de corte (día 21), registro de cargos MSI, y pago de tarjetas con transferencia entre cuentas.

**Architecture:** API-first con stores Zustand. Pantalla corte en mobile. API endpoints REST. Prisma transactions para pagos atómicos.

**Tech Stack:** Next.js, Prisma, Zustand, React Hook Form

---

## File Map

```
CREAR:
- src/app/api/corte/route.ts              # GET /api/corte
- src/app/api/payments/route.ts           # GET,POST /api/payments
- src/app/api/payments/[id]/route.ts      # GET,DELETE /api/payments/[id]
- src/app/(mobile)/corte/page.tsx         # Pantalla corte
- src/stores/use-payments-store.ts        # Store para payments
- src/components/mobile/payment-modal.tsx # Modal confirmar pago

MODIFICAR:
- prisma/schema.prisma                   # Payment model, Cargo fields
- src/app/api/cargos/route.ts             # Soporte MSI en POST
- src/app/api/cargos/[id]/route.ts        # GET cargo individual
- src/app/(mobile)/tarjetas/page.tsx       # Agregar form registro cargo
```

---

## Task 1: Actualizar Schema Prisma

**Archivo:** `prisma/schema.prisma`

- [ ] **Step 1: Modificar Cargo**

```prisma
model Cargo {
  id          String   @id @default(uuid())
  descripcion String
  monto       Float
  msi         Int      @default(1)  // 1, 3, 6, 12 cuotas
  mesCorte    String // YYYY-MM
  tarjetaId   String
  tarjeta     Tarjeta  @relation(fields: [tarjetaId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  // NEW
  pagado      Boolean  @default(false)
  cargoPadreId String?  // para MSI
  exhibicion  Int      @default(1)  // 1 de 6, 2 de 6, etc
}
```

- [ ] **Step 2: Agregar Payment model**

```prisma
model Payment {
  id               String   @id @default(uuid())
  monto            Float
  tipo             String   // "PAGO" | "CARGO"
  tarjetaCreditoId String?
  tarjetaOrigenId  String?
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  createdAt        DateTime @default(now())

  tarjetaCredito   Tarjeta? @relation("PagosCredito", fields: [tarjetaCreditoId], references: [id])
  tarjetaOrigen    Tarjeta? @relation("PagosOrigen", fields: [tarjetaOrigenId], references: [id])
}
```

- [ ] **Step 3: Ejecutar migración**

```bash
pnpm prisma migrate dev --name add_payments_and_cargo_fields
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add Payment model and Cargo fields (pagado, MSI)"
```

---

## Task 2: Endpoint GET /api/corte

**Archivo:** Crear `src/app/api/corte/route.ts`

- [ ] **Step 1: Escribir endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const today = new Date();
  const fechaCorte = today.getDate() - 1; // día 20 si hoy 21

  // Buscar tarjetas con fechaCorte = ayer
  const tarjetas = await prisma.tarjeta.findMany({
    where: { userId: session.user.id, fechaCorte },
    include: {
      cargos: {
        where: { pagado: false },
        orderBy: { mesCorte: "asc" },
      },
    },
  });

  // Calcular gastos por período y desglose MSI
  const result = tarjetas.map((tarjeta) => {
    const gastosPeriodo = tarjeta.cargos.reduce((sum, c) => sum + c.monto, 0);
    const msiCargos = tarjeta.cargos.filter((c) => c.msi > 1);
    const sinMSI = tarjeta.cargos.filter((c) => c.msi === 1);

    // Agrupar MSI por mesCorte y exhibicion
    const msiInfo = msiCargos.reduce((acc, c) => {
      if (!acc[c.mesCorte]) acc[c.mesCorte] = { monto: 0, exhibits: [] };
      acc[c.mesCorte].monto += c.monto;
      acc[c.mesCorte].exhibits.push({ exhibicion: c.exhibicion, msi: c.msi, monto: c.monto, pagado: c.pagado });
      return acc;
    }, {} as Record<string, { monto: number; exhibits: any[] }>);

    return {
      tarjeta: {
        id: tarjeta.id,
        nombre: tarjeta.nombre,
        banco: tarjeta.banco,
        limite: tarjeta.limite,
        saldoActual: tarjeta.saldoActual,
        disponible: tarjeta.limite - tarjeta.saldoActual,
      },
      gastosPeriodo,
      saldoDisponible: tarjeta.limite - tarjeta.saldoActual,
      sinMSITotal: sinMSI.reduce((s, c) => s + c.monto, 0),
      msiTotal: msiCargos.reduce((s, c) => s + c.monto, 0),
      msiInfo,
      cargos: tarjeta.cargos,
    };
  });

  return NextResponse.json({ data: result, error: null });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/corte/route.ts
git commit -m "feat: add GET /api/corte endpoint"
```

---

## Task 3: Endpoint POST /api/cargos con MSI

**Archivo:** Modificar `src/app/api/cargos/route.ts`

- [ ] **Step 1: Reescribir POST para soportar MSI**

```typescript
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const { descripcion, monto, tarjetaId, msi = 1, fecha } = body;

    const fechaDate = new Date(fecha);
    const cargoPadreId = crypto.randomUUID();

    if (msi > 1) {
      // Crear cargo padre + n exhibiciones
      const exhibicionMonto = monto / msi;
      const cargos = [];
      for (let i = 1; i <= msi; i++) {
        const exhibitDate = new Date(fechaDate);
        exhibitDate.setMonth(exhibitDate.getMonth() + i);
        // Primer exhibición en el siguiente corte después de la compra
        const mesCorte = `${exhibitDate.getFullYear()}-${String(exhibitDate.getMonth() + 1).padStart(2, "0")}`;
        cargos.push({
          id: crypto.randomUUID(),
          descripcion: `${descripcion} (${i}/${msi})`,
          monto: exhibicionMonto,
          msi,
          mesCorte,
          tarjetaId,
          pagado: false,
          cargoPadreId: i === 1 ? cargoPadreId : null,
          exhibicion: i,
        });
      }
      await prisma.cargo.createMany({ data: cargos });
      return NextResponse.json({ data: { id: cargoPadreId, cargos }, error: null });
    } else {
      // Cargo normal sin MSI
      const mesCorte = `${fechaDate.getFullYear()}-${String(fechaDate.getMonth() + 1).padStart(2, "0")}`;
      const cargo = await prisma.cargo.create({
        data: { descripcion, monto, msi: 1, mesCorte, tarjetaId, cargoPadreId: null, exhibicion: 1, pagado: false },
      });
      return NextResponse.json({ data: cargo, error: null });
    }
  } catch (e: any) { return NextResponse.json({ error: e.message || "Error al crear" }, { status: 500 }); }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cargos/route.ts
git commit -m "feat: add MSI support in POST /api/cargos"
```

---

## Task 4: Endpoints /api/payments

**Archivos:** Crear `src/app/api/payments/route.ts` y `src/app/api/payments/[id]/route.ts`

- [ ] **Step 1: GET/POST payments route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const tarjetaId = searchParams.get("tarjetaId");
  const where: any = { userId: session.user.id };
  if (tarjetaId) {
    where.OR = [{ tarjetaCreditoId: tarjetaId }, { tarjetaOrigenId: tarjetaId }];
  }
  const payments = await prisma.payment.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: payments, error: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const { tarjetaCreditoId, tarjetaOrigenId, monto, tipoOrigen } = body;

    await prisma.$transaction(async (tx) => {
      // Payment en tarjeta crédito (PAGO = +)
      await tx.payment.create({
        data: { monto, tipo: "PAGO", tarjetaCreditoId, userId: session.user.id },
      });
      // Payment en tarjeta origen (CARGO = -)
      if (tarjetaOrigenId && tipoOrigen !== "EFECTIVO") {
        await tx.payment.create({
          data: { monto, tipo: "CARGO", tarjetaOrigenId, userId: session.user.id },
        });
        // Restar del saldo de origen
        await tx.tarjeta.update({
          where: { id: tarjetaOrigenId },
          data: { saldoActual: { decrement: monto } },
        });
      }
      // Reducir saldoActual de tarjeta crédito (pago reduce deuda)
      await tx.tarjeta.update({
        where: { id: tarjetaCreditoId },
        data: { saldoActual: { decrement: monto } },
      });
      // Marcar cargos del período como pagados
      const today = new Date();
      const mesCorte = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      await tx.cargo.updateMany({
        where: { tarjetaId: tarjetaCreditoId, mesCorte, pagado: false },
        data: { pagado: true },
      });
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (e: any) { return NextResponse.json({ error: e.message || "Error al pagar" }, { status: 500 }); }
}
```

- [ ] **Step 2: Crear [id]/route.ts para GET by id**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const payment = await prisma.payment.findUnique({ where: { id, userId: session.user.id } });
  if (!payment) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ data: payment, error: null });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payments/route.ts src/app/api/payments/[id]/route.ts
git commit -m "feat: add payments API endpoints"
```

---

## Task 5: Store usePaymentsStore

**Archivo:** Crear `src/stores/use-payments-store.ts`

- [ ] **Step 1: Crear store**

```typescript
import { create } from "zustand";
import { apiClient } from "@/lib/api/client";

interface Payment {
  id: string;
  monto: number;
  tipo: "PAGO" | "CARGO";
  tarjetaCreditoId: string | null;
  tarjetaOrigenId: string | null;
  createdAt: string;
}

interface CorteData {
  tarjeta: { id: string; nombre: string; banco: string; limite: number; saldoActual: number; disponible: number };
  gastosPeriodo: number;
  saldoDisponible: number;
  sinMSITotal: number;
  msiTotal: number;
  msiInfo: Record<string, { monto: number; exhibits: any[] }>;
  cargos: Payment[];
}

interface PaymentsState {
  cortes: CorteData[];
  payments: Payment[];
  isLoading: boolean;
  fetchCortes: () => Promise<void>;
  fetchPayments: (tarjetaId?: string) => Promise<void>;
  createPayment: (data: { tarjetaCreditoId: string; tarjetaOrigenId?: string; monto: number; tipoOrigen: string }) => Promise<void>;
}

export const usePaymentsStore = create<PaymentsState>()((set) => ({
  cortes: [],
  payments: [],
  isLoading: false,
  fetchCortes: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient<{ data: CorteData[] }>("/corte");
      set({ cortes: res.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  fetchPayments: async (tarjetaId?: string) => {
    const endpoint = tarjetaId ? `/payments?tarjetaId=${tarjetaId}` : "/payments";
    const res = await apiClient<{ data: Payment[] }>(endpoint);
    set({ payments: res.data });
  },
  createPayment: async (data) => {
    await apiClient("/payments", { method: "POST", body: data });
  },
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/use-payments-store.ts
git commit -m "feat: add usePaymentsStore"
```

---

## Task 6: Pantalla /corte

**Archivo:** Crear `src/app/(mobile)/corte/page.tsx`

- [ ] **Step 1: Crear página completa con BottomSheet de pago**

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePaymentsStore } from "@/stores/use-payments-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { formatCurrency } from "@/lib/utils/cn";

export default function CortePage() {
  const cortes = usePaymentsStore((s) => s.cortes);
  const fetchCortes = usePaymentsStore((s) => s.fetchCortes);
  const createPayment = usePaymentsStore((s) => s.createPayment);
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);

  const [selectedCorte, setSelectedCorte] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [origenId, setOrigenId] = useState<string>("");
  const [tipoOrigen, setTipoOrigen] = useState<string>("TARJETA");

  useEffect(() => {
    fetchCortes();
    if (tarjetas.length === 0) fetchTarjetas();
  }, []);

  const handlePagar = (corte: any) => {
    setSelectedCorte(corte);
    setSheetOpen(true);
  };

  const confirmarPago = async () => {
    if (!selectedCorte || !origenId) return;
    await createPayment({
      tarjetaCreditoId: selectedCorte.tarjeta.id,
      tarjetaOrigenId: tipoOrigen === "TARJETA" ? origenId : "",
      monto: selectedCorte.gastosPeriodo,
      tipoOrigen,
    });
    setSheetOpen(false);
    fetchCortes();
  };

  if (cortes.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-ios-text-secondary">No hay cortes pendientes hoy</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-ios-text-primary">Corte del {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long" })}</h1>

      {cortes.map((corte) => (
        <div key={corte.tarjeta.id} className="bg-ios-bg-primary rounded-xl p-4 shadow-card">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold text-ios-text-primary">{corte.tarjeta.nombre}</p>
              <p className="text-xs text-ios-text-secondary">{corte.tarjeta.banco}</p>
            </div>
            <p className="text-sm text-ios-text-tertiary">Límite: {formatCurrency(corte.tarjeta.limite)}</p>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-ios-text-secondary">Disponible:</span>
              <span className="font-medium">{formatCurrency(corte.tarjeta.disponible)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ios-text-secondary">Sin MSI:</span>
              <span className="font-medium">{formatCurrency(corte.sinMSITotal)}</span>
            </div>
            {corte.msiTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ios-text-secondary">MSI:</span>
                <span className="font-medium">{formatCurrency(corte.msiTotal)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-ios-bg-tertiary pt-3 mb-3">
            <div className="flex justify-between">
              <span className="font-semibold text-ios-text-primary">Total a pagar:</span>
              <span className="font-bold text-ios-danger">{formatCurrency(corte.gastosPeriodo)}</span>
            </div>
          </div>

          <button
            onClick={() => handlePagar(corte)}
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70"
          >
            PAGAR {formatCurrency(corte.gastosPeriodo)}
          </button>
        </div>
      ))}

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Confirmar pago" height="60%">
        <div className="space-y-4">
          <div className="bg-ios-bg-secondary rounded-lg p-4">
            <p className="text-sm text-ios-text-secondary">A:</p>
            <p className="font-semibold">{selectedCorte?.tarjeta.nombre}</p>
            <p className="text-xs text-ios-text-tertiary">{selectedCorte?.tarjeta.banco}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-ios-text-secondary uppercase mb-2">Pagar desde:</p>
            <div className="space-y-2">
              {tarjetas.filter(t => t.id !== selectedCorte?.tarjeta.id).map((t) => (
                <label key={t.id} className="flex items-center gap-3 p-3 bg-ios-bg-secondary rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="origen"
                    value={t.id}
                    checked={origenId === t.id && tipoOrigen === "TARJETA"}
                    onChange={() => { setOrigenId(t.id); setTipoOrigen("TARJETA"); }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.nombre} - {t.banco}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 p-3 bg-ios-bg-secondary rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="origen"
                  value="efectivo"
                  checked={tipoOrigen === "EFECTIVO"}
                  onChange={() => setTipoOrigen("EFECTIVO")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Efectivo</span>
              </label>
            </div>
          </div>

          <button
            onClick={confirmarPago}
            disabled={tipoOrigen === "TARJETA" && !origenId}
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70 disabled:opacity-50"
          >
            CONFIRMAR PAGO {selectedCorte ? formatCurrency(selectedCorte.gastosPeriodo) : ""}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/corte/page.tsx
git commit -m "feat: add Corte page for day-21 payments"
```

---

## Task 7: Agregar MSI al form de registro de cargo en Tarjetas

**Archivo:** Modificar `src/app/(mobile)/tarjetas/page.tsx`

- [ ] **Step 1: Agregar campo MSI al form y lógica de submit**

Agregar en el form existente (BottomSheet), después del campo de monto:

```tsx
<div>
  <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
    Meses sin intereses (opcional)
  </label>
  <select
    {...register("msi")}
    className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
    style={{ fontSize: 16 }}
  >
    <option value="1">Sin MSI</option>
    <option value="3">3 meses</option>
    <option value="6">6 meses</option>
    <option value="12">12 meses</option>
  </select>
  {parseInt(watch("msi") || "1") > 1 && (
    <p className="text-xs text-ios-text-tertiary mt-1">
      {watch("monto") && parseInt(watch("msi")) > 1
        ? `${watch("msi")} exhibiciones de ${formatCurrency(parseFloat(watch("monto")) / parseInt(watch("msi")))}`
        : ""}
    </p>
  )}
</div>
```

Modificar onSubmit para enviar MSI:

```tsx
const onSubmit = async (data: any) => {
  if (editingCargo) {
    // ... update logic
  } else {
    // Crear cargo
    await apiClient("/cargos", {
      method: "POST",
      body: {
        descripcion: data.descripcion,
        monto: parseFloat(data.monto),
        tarjetaId: selectedTarjetaId, // pasar del contexto
        msi: parseInt(data.msi),
        fecha: new Date().toISOString(),
      },
    });
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/tarjetas/page.tsx
git commit -m "feat: add MSI option to cargo registration form"
```

---

## Self-Review Checklist

- [ ] Spec coverage: Pantalla corte ✓, MSI en registro ✓, Pago ✓, Movimientos ✓
- [ ] No placeholders: todos los pasos tienen código
- [ ] Tipos consistentes: Payment.tipo es "PAGO" | "CARGO", Cargo.mesCorte es YYYY-MM

---

## Execution Options

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks

**2. Inline Execution** - Execute tasks in this session using executing-plans

**Which approach?**