# Design Spec: Pantalla de Corte y Pagos MSI

**Date:** 2026-05-21
**Author:** Claude

---

## Overview

Implementar pantalla de corte que aparece el día 21 (fecha_corte + 1) mostrando gastos del período y permitiendo pagar. Soporte completo para compras a meses sin intereses (MSI).

---

## Data Model

### New Model: Payment

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

### Model Changes

**Cargo:**
- Agregar `pagado: Boolean @default(false)`
- Agregar `cargoPadreId: String?` (para MSI - referencia al cargo original)
- Agregar `exhibicion: Int @default(1)` (número de exhibición, 1 de 6 por ejemplo)

**Tarjeta:**
- Agregar `saldoDisponible: Float` (calculado: limite - saldoActual)
- O derivar en query: `limite - saldoActual`

---

## API Endpoints

### GET /api/corte

Devuelve tarjetas cuya fecha de corte = día actual - 1.

**Response:**
```json
{
  "data": [{
    "tarjeta": { id, nombre, banco, limite, saldoActual, fechaCorte },
    "gastosPeriodo": 30000,
    "saldoDisponible": 150000,
    "cargos": [...],
    "msiInfo": {
      "totalMSI": 6000,
      "exhibiciones": [
        { "mes": "2026-05", "monto": 1000, "pagado": false },
        { "mes": "2026-06", "monto": 1000, "pagado": false }
      ]
    }
  }]
}
```

**Logic:**
1. Find tarjetas where `fechaCorte = day_of_month(today) - 1`
2. Sum unpaid cargos for each tarjeta in current period (last 30 days)
3. Return grouped by tarjeta with MSI breakdown

### GET /api/cargos?tarjetaId=xxx&mesCorte=YYYY-MM

Lista de cargos filtrados.

### POST /api/payments

Registra un pago entre dos tarjetas.

**Request:**
```json
{
  "tarjetaCreditoId": "uuid",
  "tarjetaOrigenId": "uuid", // null si es efectivo
  "monto": 30000,
  "tipoOrigen": "DEBITO" | "TARJETA" | "EFECTIVO"
}
```

**Logic (transaction):**
1. Crear Payment tipo "CARGO" en tarjeta origen (si existe)
2. Crear Payment tipo "PAGO" en tarjeta crédito
3. Si `tarjetaOrigenId` provided → restar `monto` del `saldoActual`
4. Marcar los cargos del período como `pagado: true`
5. Recalcular `saldoActual` de tarjeta crédito

### POST /api/cargos

Crear cargo con soporte MSI.

**Request:**
```json
{
  "descripcion": "Laptop",
  "monto": 18000,
  "tarjetaId": "uuid",
  "msi": 6,
  "fecha": "2026-05-15"
}
```

**Logic:**
1. Si `msi > 1`, crear cargo padre (monto total) y `n` cargos hijos (monto/n cada uno)
2. Si `msi = 1`, crear solo un cargo normal
3. Cada exhibición tiene `mesCorte` calculado: mes de fecha + n meses

---

## Pantalla /corte

### Mostrar cuando:
- Día 21 de cada mes (fecha_corte + 1)

### Layout:

```
┌─────────────────────────┐
│ 🔔 Corte del 20/May     │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Visa Bancomer        │ │
│ │ Límite: $180,000     │ │
│ │ Disponible: $150,000│ │
│ │                        │
│ │ --- Gastos del período │ │
│ │ Sin MSI: $24,000      │ │
│ │ MSI (6 meses): $6,000 │ │
│ │   Exhibit 1/6: $1,000  │ │
│ │   Exhibit 2/6: $1,000  │ │
│ │                        │ │
│ │ A pagar: $25,000      │ │
│ │                        │ │
│ │ [    PAGAR $25,000   ] │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Pagar desde:             │
│ ○ Débito Banorte $30k   │
│ ○ Efectivo              │
│ ○ [Otra tarjeta]        │
└─────────────────────────┘
```

### Modal de Pago:

```
┌─────────────────────────┐
│ Confirmar pago           │
├─────────────────────────┤
│ De: Débito Banorte      │
│ A: Visa Bancomer        │
│ Monto: $25,000          │
│                          │
│ [    CONFIRMAR PAGO    ] │
└─────────────────────────┘
```

### Post-pago:
- Mostrar confirmación
- Actualizar saldos
- Regresar a lista (con estado actualizado)

---

## Pantalla de Registro de Cargo (modificar existente)

Agregar campo MSI:

```
┌─────────────────────────┐
│ Nuevo Cargo              │
├─────────────────────────┤
│ Descripción: [Laptop    ]│
│ Monto: [$18,000        ] │
│ Tarjeta: [Visa Bancomer] │
│ MSI: [6 meses ▼         ]│
│   → 6 exhibiciones de    │
│     $3,000 c/u           │
│                          │
│ [      GUARDAR         ] │
└─────────────────────────┘
```

---

## Pantalla Historial de Pagos

Mostrar timeline de Payments para una tarjeta.

---

## Scope

### Fase 1 (este spec):
- Pantalla corte día 21
- Registro de cargo con MSI
- Pago de tarjeta
- Movimientos en ambas tarjetas

### Fase 2 (post-MVP):
- Historial de pagos por tarjeta
- Seguimiento exhibiciones MSI
- Notificaciones recordatorio

---

## Technical Notes

- Usar transactions de Prisma para operaciones de pago
- Calcular `mesCorte` de exhibiciones: `addMonths(fecha, n)` donde n = número de exhibición
- El campo `fechaCorte` de tarjeta es Int (1-31), no Date
- Para saber el período: `fechaCorte` del 20 al 20 del siguiente mes