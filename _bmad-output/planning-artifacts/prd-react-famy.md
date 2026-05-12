# React_Famy — Sistema de Control de Gastos Familiares

## Resumen Ejecutivo

**Nombre del proyecto:** React_Famy
**Tipo de proyecto:** Aplicación web — gestión financiera familiar
**Fecha de creación:** 2026-05-12
**Propietario:** Leon (Margarito López)
**Canal de comunicación:** Telegram

Sistema de control de gastos familiares en **Next.js** que permite administrar ingresos, gastos fijos, colegiaturas, suscripciones, mantenimiento y tarjetas de crédito. Diseñado para dar visibilidad completa del flujo de dinero familiar con fechas de corte, recordatorios y distribución por tarjetas.

---

## 1. Visión del Producto

> Una sola app donde toda la familia pueda ver en tiempo real quién gastó qué, cuándo y con qué tarjeta — sin depender de hojas de cálculo ni apps que no se adaptan a la realidad mexicana (nómina quincenal, fechas de corte Banorte/HSBC/Citibanamex, colegiaturas bilinguales).

**Objetivo principal:** Centralizar y visualizar todos los gastos e ingresos familiares para que sea imposible olvidar una suscripción, un pago de colegiatura o una fecha de corte.

---

## 2. User Journeys

### Journey 1: Registrar un gasto fijo
```
Como: administrador del hogar
Cuando: llega el corte de una suscripción
Quiere: registrar el gasto fijo (luz, gas, internet, agua)
Para: saber cuánto se fue en servicios fijos mensualmente
```

### Journey 2: Registrar colegiatura
```
Como: administrador del hogar
Cuando: sus hijos tienen que pagar colegiatura
Quiere: registrar la colegiatura por hijo, bimestre, grado
Para: proyectar el gasto escolar del año
```

### Journey 3: Registrar ingresos (nómina)
```
Como: administrador del hogar
Cuando: recibe su nómina o transferencia quincenal/mensual
Quiero: registrar cuánto entró, de qué cuenta origen, y earmarkearlo a una tarjeta
Para: saber cuánto dinero disponible hay y en cuál cuenta
```

### Journey 4: Ver fechas de corte de tarjetas
```
Como: administrador del hogar
Quiero: ver un calendario con las fechas de corte de todas las tarjetas
Para: planear cuándo hacer pagos y no afectar el crédito
```

### Journey 5: Registrar gasto en tarjeta de crédito
```
Como: administrador del hogar
Cuando: hace un cargo a una tarjeta de crédito
Quiere: registrar descripción, monto, fecha de compra, fecha de corte, categoría
Para: rastrear los cargos a cada tarjeta y saber cuándo llegan al estado de cuenta
```

### Journey 6: Registrar mantenimiento del hogar
```
Como: administrador del hogar
Cuando: hace un gasto de mantenimiento (plomería, pintura, eléctrico, electrodomésticos)
Quiere: registrar descripción, monto, proveedor, fecha, tarjeta usada
Para: llevar historial de inversiones en la casa
```

### Journey 7: Ver resumen mensual
```
Como: administrador del hogar
Quiere: ver un dashboard mensual
Con: ingresos vs gastos, desglose por categoría, tarjetas con saldo
Para: tomar decisiones de ahorro y ajustar el presupuesto
```

---

## 3. Modelo de Dominio

### Entidades principales

#### Familia
```
- nombre_familia: string
- miembros[]: Miembro
```

#### Miembro
```
- id: UUID
- nombre: string
- rol: "padre" | "madre" | "hijo" | "otro"
- fecha_nacimiento: date (para calcular edades)
```

#### Ingreso (Nómina)
```
- id: UUID
- miembro_id: FK → Miembro
- monto: decimal
- frecuencia: "quincenal" | "mensual" | "semanal" | "bimestral"
- fecha_pago: date
- cuenta_origen: string (ej: "Banco HSBC Payroll")
- earmarked_tarjeta_id: FK → Tarjeta (opcional)
- created_at: timestamp
```

#### GastoFijo (Suscripciones y servicios)
```
- id: UUID
- nombre: string (luz CFE, gas, agua, internet, Netflix, Spotify, etc.)
- monto: decimal
- frecuencia: "mensual" | "bimestral" | "anual"
- dia_corte: int (1-31)
- categoria: enum
- tarjeta_id: FK → Tarjeta
- activo: boolean
- created_at: timestamp
```

#### Colegiatura
```
- id: UUID
- miembro_id: FK → Miembro (hijo)
- nivel: "maternal" | "preescolar" | "primaria" | "secundaria" | "preparatoria" | "universidad"
- bimestre: int (1-6)
- monto: decimal
- fecha_limite_pago: date
- pagada: boolean
- created_at: timestamp
```

#### TarjetaCredito
```
- id: UUID
- nombre: string (ej: "Citibanamex Oro", "HSBC Rewards")
- ultimo_digitos: string(4)
- fecha_corte: int (1-31)
- limite_credito: decimal
- saldo_actual: decimal
- banco: string
- color: string (para identificar visualmente)
```

#### CargoTarjeta
```
- id: UUID
- tarjeta_id: FK → TarjetaCredito
- descripcion: string
- monto: decimal
- fecha_compra: date
- categoria: enum
- num_cuotas: int (1 = un solo pago, 3, 6, 12 = meses sin intereses)
- mes_corte: date (cuándo aparecerá en estado de cuenta)
- created_at: timestamp
```

#### MantenimientoCasa
```
- id: UUID
- descripcion: string
- categoria: "plomeria" | "electrico" | "pintura" | "electrodomestico" | "jardineria" | "construccion" | "otro"
- monto: decimal
- fecha_gasto: date
- proveedor: string (opcional)
- tarjeta_id: FK → TarjetaCredito (opcional, null = efectivo)
- creado_por: FK → Miembro
- created_at: timestamp
```

#### Categoria (catálogo)
```
- id: UUID
- nombre: string
- icono: string (emoji o nombre de icono)
- tipo: "ingreso" | "gasto_fijo" | "gasto_variable" | "colegiatura" | "mantenimiento"
```

---

## 4. Funcionalidad por Fase

### Fase 1: Dashboard principal
- Resumen del mes actual: ingresos totales vs gastos totales
- Gráfico de dona: gastos por categoría
- Barra de progreso: consumo del mes vs ingreso
- Tarjetas con saldo crítico (提醒)
- Próximas fechas de corte (próximos 7 días)

### Fase 2: Gestión de ingresos
- CRUD de nóminas/ingresos
- Lista de ingresos por mes
- Filtro por miembro y frecuencia

### Fase 3: Gestión de gastos fijos
- CRUD de gastos fijos (luz, gas, agua, internet, suscripciones)
- Toggle activar/desactivar
- Ver historial de cada gasto fijo

### Fase 4: Colegiaturas
- CRUD de colegiaturas por hijo
- Indicador visual de pagada/no pagada
- Alertas de fecha límite de pago

### Fase 5: Tarjetas de crédito
- CRUD de tarjetas con datos: banco, últimos 4 dígitos, fecha corte, límite, saldo
- Vista de cargos por tarjeta
- Línea de tiempo: qué viene en el próximo corte

### Fase 6: Cargos a tarjetas
- Registrar cargo: descripción, monto, fecha, categoría, num_cuotas, tarjeta
- Ver cargos por mes de corte
- Distinguir MSI (meses sin intereses) vs cargo completo

### Fase 7: Mantenimiento del hogar
- CRUD de gastos de mantenimiento
- Filtro por categoría y rango de fechas

### Fase 8: Calendario de fechas de corte
- Vista calendario mensual
- Todas las tarjetas, colegiaturas y gastos fijos con fecha
- Alertas visuales de proximidad de corte

---

## 5. Tipos de Proyecto y Selección

**Tipo:** Nuevo proyecto (greenfield)

**Stack confirmado:**
- Frontend: **Next.js 16** (App Router)
- Estado: **Zustand** para auth y estado global
- Backend: API routes de Next.js o backend separado (pendiente decisión)
- Base de datos: **SQLite** para inicio (posible migrate a PostgreSQL)
- ORM: **Prisma**
- Despliegue: Raspberry Pi 5 o Railway/Vercel
- Estilo: CSS Modules + diseño móvil-first (max 480px)

**Idioma de interfaz:** Español (es-MX)

---

## 6. Alcance (Scoping)

### MVP — Sprint 1 (lo mínimo viable)
1. Dashboard con resumen mensual (ingresos vs gastos)
2. CRUD de ingresos (nóminas)
3. CRUD de gastos fijos con fecha de corte
4. CRUD de tarjetas de crédito con fecha de corte
5. CRUD de cargos a tarjetas
6. Vista de calendario con fechas de corte
7. Mobile-first, responsive hasta 960px

### Sprint 2
1. CRUD de colegiaturas por hijo
2. Vista de mantenimiento del hogar
3. Historial de gastos por categoría

### Sprint 3
1. Alertas de fechas de corte (Telegram bot)
2. Exportar a PDF/Excel
3. Multi-usuario (padre + madre)

---

## 7. Requisitos No Funcionales

- **Rendimiento:** carga inicial < 3s en conexión móvil
- **Disponibilidad:** funcional offline para consulta de datos (no crítico para writes)
- **Escalabilidad:** hasta 5 miembros familiares, 50 gastos fijos, 200 cargos/mes
- **Seguridad:** JWT para auth, datos financieros sensibles
- **UX:** mobile-first, sin OCR ni captura manual de receipts, solo ingreso directo
- **Idiomas:** interfaz 100% español

---

## 8. Check de Inovação

- **Automatización:** recordatorios automáticos por Telegram de fechas de corte
- **Visualización:** gráficos claros de distribución de gastos por tarjeta y categoría
- **Planeación:** proyección de gastos futuros (MSI, colegiaturas bimestrales)
- **Integración:** posible scrapeo de correo para auto-registro de gastos (futuro)