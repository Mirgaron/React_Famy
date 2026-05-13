# React_Famy Mobile-First Redesign

Fecha: 2026-05-13
Status: approved

---

## Resumen

Rediseño completo del frontend de React_Famy orientado a uso móvil en iPhone. Mobile-First puro con interacciones swipe, estilo iOS Native y bottom sheets para forms.

---

## Decisiones de Diseño

| Decisión | Opción | Detalle |
|-----------|--------|---------|
| Objetivo | Mobile-First Puro | UX iPhone nativa |
| Interacción | Swipe Actions | Izquierda=eliminar, derecha=editar |
| Estilo | iOS Native | Blanco/gris, blur, SF Pro, cards blancas |
| Navegación | 4 tabs mínimas | Inicio · Ingresos · Gastos · Tarjetas |
| Forms | Bottom Sheets | Slide up partial, blur de fondo |
| Dashboard | Actividad Reciente | Timeline de últimos movimientos |

---

## Arquitectura de Componentes

```
App
├── BottomNav (sticky bottom, 4 tabs con iconos SF)
├── TabContent
│   ├── Inicio → DashboardActivity
│   ├── Ingresos → ListSwipeable + FAB → BottomSheet
│   ├── Gastos → ListSwipeable + FAB → BottomSheet
│   └── Tarjetas → ListSwipeable + FAB → BottomSheet
├── BottomSheet (partial cover 60%, draggable)
├── SwipeItem (reveal actions on swipe)
└── ModalBlur (overlay para sheets)
```

**Estructura de archivos:**
```
src/components/mobile/
├── bottom-nav.tsx
├── bottom-sheet.tsx
├── swipeable-row.tsx
├── fab.tsx
└── activity-timeline.tsx

src/app/(mobile)/
├── layout.tsx (BottomNav + Outlet)
├── dashboard/page.tsx (ActivityTimeline)
├── ingresos/page.tsx
├── gastos/page.tsx
└── tarjetas/page.tsx
```

---

## Tokens CSS — iOS Native

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f2f2f7;
  --bg-tertiary: #e5e5ea;
  --text-primary: #000000;
  --text-secondary: #8e8e93;
  --text-tertiary: #c7c7cc;
  --accent: #007aff;
  --danger: #ff3b30;
  --success: #34c759;
  --warning: #ff9500;
  --sheet-bg: rgba(255, 255, 255, 0.72);
  --sheet-backdrop: rgba(0, 0, 0, 0.4);
  --radius-card: 12px;
  --radius-sheet: 16px;
  --radius-button: 10px;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-sheet: 0 -4px 24px rgba(0, 0, 0, 0.12);
  --nav-height: 49px;
  --fab-size: 56px;
  --touch-target-min: 44px;
}
```

**Tipografía:**
- Font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`
- Title large: 34px bold
- Title: 17px semibold
- Body: 15px regular
- Caption: 13px regular
- Caption2: 11px regular (text-secondary)

---

## Componentes

### BottomNav

Barra de navegación inferior con 4 tabs:
- **Inicio** (casita) → `/dashboard`
- **Ingresos** (flecha arriba verde) → `/ingresos`
- **Gastos** (flecha abajo roja) → `/gastos-fijos`
- **Tarjetas** (tarjeta) → `/tarjetas`

Estados:
- Default: icon gray, label gray
- Active: icon/tint accent, label accent, font semibold
- Pressed: opacity 0.7

Implementación: `src/components/mobile/bottom-nav.tsx`
- Fijo bottom, z-50
- `padding-bottom: env(safe-area-inset-bottom)`
- Height: 49px + safe-area

### SwipeableRow

Item de lista que reacciona a swipe horizontal.

**Swipe izquierda (eliminar):**
- Umbral: 80px para revelar acción
- Más de 160px: auto-trigger
- Botón rojo con trash icon
- Confirmación inline antes de eliminar

**Swipe derecha (editar):**
- Umbral: 80px para revelar acción
- Botón azul con pencil icon
- Tap → abre BottomSheet con datos pre-poblados

Estados:
- `idle`: posición normal
- `swiping-left`: reveals delete button
- `swiping-right`: reveals edit button
- `confirming`: muestra "¿Eliminar?" con Confirm/Cancel
- `deleting`: animación de salida (300ms fade + translateX)

Implementación: `src/components/mobile/swipeable-row.tsx`

### BottomSheet

Modal que slide up desde abajo, covering 60-70% de la pantalla.

**Comportamiento:**
- Drag down para dismiss (threshold: 100px velocity OR 50% height)
- Backdrop blur oscuro
- Focus trap mientras está abierto
- Animación: 350ms cubic-bezier(0.32, 0.72, 0, 1)

**Variantes:**
- `create`: campos vacíos, botón "Guardar"
- `edit`: campos pre-poblados, botón "Actualizar"
- `confirm`: mensaje + 2 botones (Cancel / Confirm)

Implementación: `src/components/mobile/bottom-sheet.tsx`

### FAB

Floating Action Button para agregar items.

**Diseño:**
- Size: 56px diameter
- Position: bottom-right, 16px from edges + safe-area
- Color: accent (#007aff)
- Icon: plus white
- Shadow: 0 4px 12px rgba(0,122,255,0.4)
- Tap: scale 0.95 (100ms), luego vuelve

**Ubicación:**
- Solo en tabs de listas (Ingresos, Gastos, Tarjetas)
- No en Inicio (el dashboard ya tiene quick actions)

Implementación: `src/components/mobile/fab.tsx`

### ActivityTimeline

Lista de actividad reciente en dashboard.

**Estructura:**
- Items ordenados por fecha/hora (más reciente primero)
- Separadores de fecha: "Hoy", "Ayer", "Fecha específica"
- Cada item: descripción, monto, timestamp relativo
- Color del monto: verde (ingreso), rojo (gasto)

**Elementos visuales:**
- Swipe enabled en cada item
- Tap → expande detalles adicionales (opcional)

Implementación: `src/components/mobile/activity-timeline.tsx`

---

## Flujos de Interacción

### Agregar Gasto

1. Usuario está en tab "Gastos"
2. Tap FAB (bottom-right)
3. BottomSheet slide up (create variant)
4. Campos visibles:
   - Descripción (text input, autofocus)
   - Monto (numeric input, teclado numérico)
   - Categoría (picker: LUZ, GAS, AGUA, INTERNET, SUSCRIPCION, OTRO)
   - Periodicidad (picker: MENSUAL, BIMESTRAL, TRIMESTRAL, ANUAL)
   - Día de corte (number input 1-31)
5. Tap "Guardar" → validación → sheet dismiss → item aparece en lista

### Editar Gasto

1. Swipe derecha en item de gasto
2. Botón "Editar" se revela
3. Tap botón → BottomSheet slide up (edit variant, datos pre-poblados)
4. Modificar campos → Tap "Actualizar"
5. Sheet dismiss → item actualizado en lista

### Eliminar Gasto

1. Swipe izquierda en item de gasto
2. Botón "Eliminar" (rojo) se revela
3. Tap botón → Inline confirm "¿Eliminar?"
4. Confirm tap → animación de salida → store delete → item removido

---

## PWA / App-like Considerations

**Meta tags (already in layout.tsx):**
- `apple-mobile-web-app-capable: true`
- `apple-mobile-web-app-status-bar-style: default`
- `viewport-fit: cover`

**Additional PWA:**
- Touch callouts disabled (`-webkit-touch-callout: none`)
- Tap highlight disabled (`-webkit-tap-highlight-color: transparent`)
- Overscroll behavior none (previene pull-to-refresh nativo)
- `user-scalable: no` en viewport (ya configurado)

---

## Animaciones

| Acción | Duración | Easing |
|--------|----------|--------|
| Sheet enter | 350ms | cubic-bezier(0.32, 0.72, 0, 1) |
| Sheet dismiss | 250ms | cubic-bezier(0.32, 0.72, 0, 1) |
| Swipe reveal | 200ms | ease-out |
| Item delete | 300ms | ease-in |
| FAB press | 100ms | ease-out |
| Tab switch | 150ms | ease-out |

---

## Responsive Strategy

Diseño mobile-first, 375px como breakpoint base (iPhone SE/8).

- **< 375px**: Cards full-width, padding 16px
- **375-414px**: Cards full-width, padding 16px
- **> 414px**: Max-width 428px centrado, no expansion horizontal

No hay diseño tablet/desktop explícito — es una app móvil pura.

---

## Scope del Redesign

### Included (este spec)
- Componentes mobile (BottomNav, SwipeableRow, BottomSheet, FAB, ActivityTimeline)
- Nuevas rutas `(mobile)/`
- Tokens CSS iOS Native
- Animaciones y transiciones
- Actualización de globals.css con nuevos tokens
- Actualización de tailwind.config.ts

### NOT included (futuros specs)
- Gráficos de tendencias / métricas
- Notificaciones push
- Widgets de Home Screen
- Deep links
- Testing E2E
- Animaciones de Charts