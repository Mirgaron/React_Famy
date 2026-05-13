# Mobile-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseño completo del frontend mobile-first con swipe actions, bottom sheets, bottom nav estilo iOS native.

**Architecture:** Componentes mobile reusable en `src/components/mobile/`. Route group `(mobile)/` reemplaza `(dashboard)/`. Tailwind configurado con tokens iOS native. Animaciones con CSS transitions.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, Framer Motion (para swipe), Radix UI (sheet base).

---

## Phase 1: CSS Tokens y Configuración

### Task 1: Actualizar globals.css con tokens iOS Native

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Agregar tokens CSS iOS Native en :root**

Reemplazar el bloque :root existente (líneas 6-25) con:

```css
:root {
  /* iOS Native Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f2f2f7;
  --bg-tertiary: #e5e5ea;
  --text-primary: #000000;
  --text-secondary: #8e8e93;
  --text-tertiary: #c7c7cc;
  --accent: #007aff;
  --accent-light: #e8f4fd;
  --danger: #ff3b30;
  --danger-light: #ffe5e4;
  --success: #34c759;
  --success-light: #e8fced;
  --warning: #ff9500;
  /* Sheet */
  --sheet-bg: rgba(255, 255, 255, 0.72);
  --sheet-backdrop: rgba(0, 0, 0, 0.4);
  /* Radii */
  --radius-card: 12px;
  --radius-sheet: 16px;
  --radius-button: 10px;
  --radius-full: 9999px;
  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-sheet: 0 -4px 24px rgba(0, 0, 0, 0.12);
  --shadow-fab: 0 4px 12px rgba(0, 122, 255, 0.4);
  /* Spacing */
  --nav-height: 49px;
  --fab-size: 56px;
  --touch-target-min: 44px;
  /* Legacy compatibility - kept for existing pages */
  --background: 30 9% 98%;
  --foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --primary: 221.2 83.2% 53.3%;
}
```

- [ ] **Step 2: Agregar estilos de botón iOS y transiciones**

Agregar antes del cierre de `@layer base`:

```css
/* iOS Button styles */
button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* iOS transitions */
.transition-swift {
  transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Safe area handling */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add iOS native CSS tokens and mobile utilities"
```

---

### Task 2: Actualizar tailwind.config.ts con tema mobile

**Files:**
- Modify: `src/tailwind.config.ts`

- [ ] **Step 1: Agregar colores iOS al theme extend**

Reemplazar el bloque colors en theme.extend con:

```typescript
colors: {
  ios: {
    bg: {
      primary: "var(--bg-primary)",
      secondary: "var(--bg-secondary)",
      tertiary: "var(--bg-tertiary)",
    },
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
      tertiary: "var(--text-tertiary)",
    },
    accent: "var(--accent)",
    "accent-light": "var(--accent-light)",
    danger: "var(--danger)",
    "danger-light": "var(--danger-light)",
    success: "var(--success)",
    "success-light": "var(--success-light)",
    warning: "var(--warning)",
  },
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
},
```

- [ ] **Step 2: Agregar borderRadius y animation tokens**

En theme.extend, después de borderRadius:

```typescript
animation: {
  "sheet-enter": "sheetEnter 350ms cubic-bezier(0.32, 0.72, 0, 1)",
  "sheet-exit": "sheetExit 250ms cubic-bezier(0.32, 0.72, 0, 1)",
  "fab-press": "fabPress 100ms ease-out",
  "fade-in": "fadeIn 200ms ease-out",
  "slide-out": "slideOut 300ms ease-in",
},
keyframes: {
  sheetEnter: {
    "0%": { transform: "translateY(100%)" },
    "100%": { transform: "translateY(0)" },
  },
  sheetExit: {
    "0%": { transform: "translateY(0)" },
    "100%": { transform: "translateY(100%)" },
  },
  fabPress: {
    "0%": { transform: "scale(1)" },
    "100%": { transform: "scale(0.95)" },
  },
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },
  slideOut: {
    "0%": { opacity: "1", transform: "translateX(0)" },
    "100%": { opacity: "0", transform: "translateX(-100%)" },
  },
},
```

- [ ] **Step 3: Commit**

```bash
git add src/tailwind.config.ts
git commit -m "feat: add iOS theme tokens to tailwind config"
```

---

## Phase 2: Componentes Mobile Core

### Task 3: Crear BottomNav

**Files:**
- Create: `src/components/mobile/bottom-nav.tsx`

- [ ] **Step 1: Crear componente BottomNav**

```typescript
"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "Inicio", icon: "house.fill" },
  { href: "/ingresos", label: "Ingresos", icon: "arrow.up.circle.fill", color: "text-ios-success" },
  { href: "/gastos", label: "Gastos", icon: "arrow.down.circle.fill", color: "text-ios-danger" },
  { href: "/tarjetas", label: "Tarjetas", icon: "creditcard.fill" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-ios-bg-primary border-t border-ios-bg-tertiary safe-area-bottom"
      style={{ height: "calc(49px + env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around h-[49px]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <button
              key={tab.href}
              onClick={() => useRouter().push(tab.href)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 min-w-[64px] min-h-[44px] touch-target-min transition-opacity ${
                isActive ? "opacity-100" : "opacity-70"
              } active:opacity-50`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <svg
                className={`w-6 h-6 ${isActive ? "text-ios-accent" : "text-ios-text-secondary"} ${tab.color || ""}`}
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={getIconPath(tab.icon)}
                />
              </svg>
              <span
                className={`text-[10px] tracking-wide ${
                  isActive
                    ? "text-ios-accent font-semibold"
                    : "text-ios-text-secondary font-normal"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function getIconPath(icon: string): string {
  const icons: Record<string, string> = {
    "house.fill": "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    "arrow.up.circle.fill": "M12 19V5m-7 7l7-7 7 7",
    "arrow.down.circle.fill": "M12 5v14m7-7l-7 7-7-7",
    "creditcard.fill": "M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z M3 10h18",
  };
  return icons[icon] || icons["house.fill"];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile/bottom-nav.tsx
git commit -m "feat: add iOS-style BottomNav component"
```

---

### Task 4: Crear SwipeableRow

**Files:**
- Create: `src/components/mobile/swipeable-row.tsx`

- [ ] **Step 1: Crear SwipeableRow con hooks de gestures**

```typescript
"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface SwipeableRowProps {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  confirmDeleteText?: string;
}

const SWIPE_THRESHOLD = 80;
const AUTO_TRIGGER_THRESHOLD = 160;

export function SwipeableRow({
  children,
  onEdit,
  onDelete,
  confirmDeleteText = "¿Eliminar?",
}: SwipeableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const x = useMotionValue(0);

  const leftActionOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const rightActionOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const leftActionScale = useTransform(x, [-SWIPE_THRESHOLD, -AUTO_TRIGGER_THRESHOLD], [1, 1.1]);
  const rightActionScale = useTransform(x, [SWIPE_THRESHOLD, AUTO_TRIGGER_THRESHOLD], [0, 1.1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;

    if (offsetX < -AUTO_TRIGGER_THRESHOLD && onDelete) {
      setShowConfirm(true);
    } else if (offsetX > AUTO_TRIGGER_THRESHOLD && onEdit) {
      onEdit();
    }
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete?.();
    }, 300);
  };

  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 0, x: "-100%" }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="w-full"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left action (edit) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-20 bg-ios-accent flex items-center justify-center"
        style={{ opacity: rightActionOpacity, scale: rightActionScale }}
      >
        <button
          onClick={onEdit}
          className="w-full h-full flex items-center justify-center active:opacity-70"
          style={{ minHeight: 44 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </motion.div>

      {/* Right action (delete) */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-20 bg-ios-danger flex items-center justify-center"
        style={{ opacity: leftActionOpacity, scale: leftActionScale }}
      >
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full h-full flex items-center justify-center active:opacity-70"
          style={{ minHeight: 44 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </motion.div>

      {/* Confirm overlay */}
      {showConfirm && (
        <div className="absolute inset-0 bg-ios-danger z-10 flex items-center justify-around px-4">
          <span className="text-white font-semibold text-sm">{confirmDeleteText}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-2 bg-white/20 rounded-lg text-white text-sm font-medium active:opacity-70"
              style={{ minHeight: 36, minWidth: 60 }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-3 py-2 bg-white rounded-lg text-ios-danger text-sm font-semibold active:opacity-70"
              style={{ minHeight: 36, minWidth: 70 }}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="bg-ios-bg-primary relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile/swipeable-row.tsx
git commit -m "feat: add SwipeableRow with swipe-to-reveal actions"
```

---

### Task 5: Crear BottomSheet

**Files:**
- Create: `src/components/mobile/bottom-sheet.tsx`

- [ ] **Step 1: Crear BottomSheet con Radix UI Dialog**

```typescript
"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  height?: "50%" | "60%" | "70%" | "90%";
}

export function BottomSheet({ isOpen, onClose, title, children, height = "60%" }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrag = (event: any, info: any) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const heightClass = {
    "50%": "h-[50vh]",
    "60%": "h-[60vh]",
    "70%": "h-[70vh]",
    "90%": "h-[90vh]",
  }[height];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDrag}
            onDragStart={() => setIsDragging(true)}
            onDrag={(_, info) => setDragY(info.offset.y)}
            className={`fixed bottom-0 left-0 right-0 ${heightClass} bg-ios-bg-primary rounded-t-2xl z-50 shadow-sheet flex flex-col`}
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
              <div className="w-9 h-1 bg-ios-bg-tertiary rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-ios-bg-tertiary">
              <h2 className="text-lg font-semibold text-ios-text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-ios-bg-secondary flex items-center justify-center active:opacity-70"
                style={{ minHeight: 44, minWidth: 44 }}
              >
                <svg className="w-5 h-5 text-ios-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile/bottom-sheet.tsx
git commit -m "feat: add BottomSheet with drag-to-dismiss"
```

---

### Task 6: Crear FAB (Floating Action Button)

**Files:**
- Create: `src/components/mobile/fab.tsx`

- [ ] **Step 1: Crear FAB**

```typescript
"use client";

import { motion } from "framer-motion";

interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
}

export function FAB({ onClick, icon }: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
      className="fixed bottom-24 right-4 w-14 h-14 bg-ios-accent rounded-full shadow-fab flex items-center justify-center z-40 active:opacity-90"
      style={{
        minHeight: 56,
        minWidth: 56,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Agregar"
    >
      {icon || (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </motion.button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile/fab.tsx
git commit -m "feat: add FAB floating action button"
```

---

### Task 7: Crear ActivityTimeline

**Files:**
- Create: `src/components/mobile/activity-timeline.tsx`

- [ ] **Step 1: Crear ActivityTimeline**

```typescript
"use client";

import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useGastosStore } from "@/stores/use-gastos-store";
import { formatCurrency } from "@/lib/utils/cn";
import { formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityItem {
  id: string;
  type: "ingreso" | "gasto";
  descripcion: string;
  monto: number;
  fecha: string;
  categoria?: string;
}

export function ActivityTimeline() {
  const ingresos = useIngresosStore((s) => s.ingresos);
  const gastos = useGastosStore((s) => s.gastos);

  // Combine and sort by date
  const items: ActivityItem[] = [
    ...ingresos.map((i) => ({
      id: i.id,
      type: "ingreso" as const,
      descripcion: i.descripcion,
      monto: i.monto,
      fecha: i.fecha instanceof Date ? i.fecha.toISOString() : i.fecha,
      categoria: i.frecuencia,
    })),
    ...gastos.map((g) => ({
      id: g.id,
      type: "gasto" as const,
      descripcion: g.descripcion,
      monto: g.monto,
      fecha: g.createdAt instanceof Date ? g.createdAt.toISOString() : g.createdAt,
      categoria: g.categoria,
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const groupedItems = groupByDate(items);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ios-text-secondary text-sm">Sin actividad reciente</p>
        <p className="text-ios-text-tertiary text-xs mt-1">Agrega ingresos o gastos para verlos aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([dateGroup, groupItems]) => (
        <div key={dateGroup}>
          <h3 className="text-xs font-semibold text-ios-text-secondary uppercase tracking-wide mb-3">
            {dateGroup}
          </h3>
          <div className="space-y-2">
            {groupItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === "ingreso"
                        ? "bg-ios-success-light"
                        : "bg-ios-danger-light"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        item.type === "ingreso" ? "text-ios-success" : "text-ios-danger"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.type === "ingreso" ? "M12 19V5m-7 7l7-7 7 7" : "M12 5v14m7-7l-7 7-7-7"}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ios-text-primary">{item.descripcion}</p>
                    <p className="text-xs text-ios-text-secondary">
                      {item.categoria || item.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-base font-bold ${
                      item.type === "ingreso" ? "text-ios-success" : "text-ios-danger"
                    }`}
                  >
                    {item.type === "ingreso" ? "+" : "-"}
                    {formatCurrency(item.monto)}
                  </p>
                  <p className="text-xs text-ios-text-tertiary">
                    {formatDistanceToNow(parseISO(item.fecha), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDate(items: ActivityItem[]): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {};

  items.forEach((item) => {
    const date = parseISO(item.fecha);
    let label: string;

    if (isToday(date)) {
      label = "Hoy";
    } else if (isYesterday(date)) {
      label = "Ayer";
    } else {
      label = date.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile/activity-timeline.tsx
git commit -m "feat: add ActivityTimeline component"
```

---

## Phase 3: Layout Mobile

### Task 8: Crear layout mobile con BottomNav

**Files:**
- Create: `src/app/(mobile)/layout.tsx`

- [ ] **Step 1: Crear layout (mobile)/layout.tsx**

```typescript
import { auth } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/mobile/bottom-nav";

export default async function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-ios-bg-secondary">
      <main className="px-4 py-6 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/layout.tsx
git commit -m "feat: add mobile layout with BottomNav"
```

---

## Phase 4: Pages Mobile

### Task 9: Dashboard page con ActivityTimeline

**Files:**
- Create: `src/app/(mobile)/dashboard/page.tsx`

- [ ] **Step 1: Crear dashboard page**

```typescript
"use client";

import { ActivityTimeline } from "@/components/mobile/activity-timeline";
import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useGastosStore } from "@/stores/use-gastos-store";
import { formatCurrency } from "@/lib/utils/cn";

export default function DashboardPage() {
  const ingresos = useIngresosStore((s) => s.ingresos);
  const gastos = useGastosStore((s) => s.gastos);

  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const balance = totalIngresos - totalGastos;

  return (
    <div className="space-y-6">
      {/* Balance Hero Card */}
      <div className="bg-ios-bg-primary rounded-2xl p-6 shadow-card">
        <p className="text-xs tracking-[0.2em] uppercase text-ios-text-secondary mb-1">
          Balance total
        </p>
        <p className="text-4xl font-bold text-ios-text-primary tracking-tight">
          {formatCurrency(balance)}
        </p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-xs text-ios-text-secondary uppercase tracking-wide">Ingresos</p>
            <p className="text-lg font-bold text-ios-success">{formatCurrency(totalIngresos)}</p>
          </div>
          <div>
            <p className="text-xs text-ios-text-secondary uppercase tracking-wide">Gastos Fijos</p>
            <p className="text-lg font-bold text-ios-danger">{formatCurrency(totalGastos)}</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h2 className="text-sm font-semibold text-ios-text-secondary uppercase tracking-wide mb-4">
          Actividad reciente
        </h2>
        <ActivityTimeline />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/dashboard/page.tsx
git commit -m "feat: add mobile dashboard with activity timeline"
```

---

### Task 10: Gastos page con SwipeableRow y BottomSheet

**Files:**
- Create: `src/app/(mobile)/gastos/page.tsx`

- [ ] **Step 1: Crear gastos page**

```typescript
"use client";

import { useState } from "react";
import { useGastosStore } from "@/stores/use-gastos-store";
import { SwipeableRow } from "@/components/mobile/swipeable-row";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { FAB } from "@/components/mobile/fab";
import { formatCurrency } from "@/lib/utils/cn";
import { useForm } from "react-hook-form";

const CATEGORIAS = ["LUZ", "GAS", "AGUA", "INTERNET", "SUSCRIPCION", "OTRO"];
const PERIODICIDADES = ["MENSUAL", "BIMESTRAL", "TRIMESTRAL", "ANUAL"];

interface GastoForm {
  descripcion: string;
  monto: string;
  categoria: string;
  periodicidad: string;
  fechaCorte: string;
}

export default function GastosPage() {
  const gastos = useGastosStore((s) => s.gastos);
  const addGasto = useGastosStore((s) => s.addGasto);
  const updateGasto = useGastosStore((s) => s.updateGasto);
  const deleteGasto = useGastosStore((s) => s.deleteGasto);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingGasto, setEditingGasto] = useState<string | null>(null);
  const { register, handleSubmit, reset, watch, setValue } = useForm<GastoForm>();

  const handleOpenCreate = () => {
    setEditingGasto(null);
    reset({ descripcion: "", monto: "", categoria: "LUZ", periodicidad: "MENSUAL", fechaCorte: "1" });
    setSheetOpen(true);
  };

  const handleOpenEdit = (gasto: any) => {
    setEditingGasto(gasto.id);
    reset({
      descripcion: gasto.descripcion,
      monto: gasto.monto.toString(),
      categoria: gasto.categoria,
      periodicidad: gasto.periodicidad,
      fechaCorte: gasto.fechaCorte.toString(),
    });
    setSheetOpen(true);
  };

  const onSubmit = async (data: GastoForm) => {
    const gastoData = {
      id: editingGasto || crypto.randomUUID(),
      descripcion: data.descripcion,
      monto: parseFloat(data.monto),
      categoria: data.categoria,
      periodicidad: data.periodicidad,
      fechaCorte: parseInt(data.fechaCorte),
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingGasto) {
      updateGasto(editingGasto, gastoData);
      // TODO: API call to update
    } else {
      addGasto(gastoData);
      // TODO: API call to create
    }

    setSheetOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    deleteGasto(id);
    // TODO: API call to delete
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-ios-text-primary">Gastos Fijos</h1>

      {gastos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ios-text-secondary text-sm">Sin gastos fijos registrados</p>
          <p className="text-ios-text-tertiary text-xs mt-1">Toca + para agregar tu primer gasto</p>
        </div>
      ) : (
        <div className="space-y-3">
          {gastos.map((g) => (
            <SwipeableRow
              key={g.id}
              onEdit={() => handleOpenEdit(g)}
              onDelete={() => handleDelete(g.id)}
            >
              <div className="bg-ios-bg-primary rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ios-text-primary">{g.descripcion}</p>
                  <p className="text-xs text-ios-text-secondary">
                    {g.categoria} · {g.periodicidad} · Corte día {g.fechaCorte}
                  </p>
                </div>
                <p className="text-base font-bold text-ios-danger">
                  {formatCurrency(g.monto)}
                </p>
              </div>
            </SwipeableRow>
          ))}
        </div>
      )}

      <FAB onClick={handleOpenCreate} />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingGasto ? "Editar Gasto" : "Nuevo Gasto"}
        height="70%"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Descripción
            </label>
            <input
              {...register("descripcion", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="Luz, Gas, Internet..."
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Monto
            </label>
            <input
              {...register("monto", { required: true })}
              type="number"
              step="0.01"
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="0.00"
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Categoría
            </label>
            <select
              {...register("categoria", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Periodicidad
            </label>
            <select
              {...register("periodicidad", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            >
              {PERIODICIDADES.map((per) => (
                <option key={per} value={per}>{per}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Día de corte (1-31)
            </label>
            <input
              {...register("fechaCorte", { required: true })}
              type="number"
              min="1"
              max="31"
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70"
            style={{ fontSize: 16 }}
          >
            {editingGasto ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/gastos/page.tsx
git commit -m "feat: add mobile gastos page with swipe and bottom sheet"
```

---

### Task 11: Ingresos page (copy of gastos with different fields)

**Files:**
- Create: `src/app/(mobile)/ingresos/page.tsx`

- [ ] **Step 1: Crear ingresos page**

```typescript
"use client";

import { useState } from "react";
import { useIngresosStore } from "@/stores/use-ingresos-store";
import { SwipeableRow } from "@/components/mobile/swipeable-row";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { FAB } from "@/components/mobile/fab";
import { formatCurrency } from "@/lib/utils/cn";
import { useForm } from "react-hook-form";

const FRECUENCIAS = ["SEMANAL", "QUINCENAL", "MENSUAL"];

interface IngresoForm {
  descripcion: string;
  monto: string;
  frecuencia: string;
  earmark: string;
}

export default function IngresosPage() {
  const ingresos = useIngresosStore((s) => s.ingresos);
  const addIngreso = useIngresosStore((s) => s.addIngreso);
  const updateIngreso = useIngresosStore((s) => s.updateIngreso);
  const deleteIngreso = useIngresosStore((s) => s.deleteIngreso);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIngreso, setEditingIngreso] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<IngresoForm>();

  const handleOpenCreate = () => {
    setEditingIngreso(null);
    reset({ descripcion: "", monto: "", frecuencia: "MENSUAL", earmark: "" });
    setSheetOpen(true);
  };

  const handleOpenEdit = (ingreso: any) => {
    setEditingIngreso(ingreso.id);
    reset({
      descripcion: ingreso.descripcion,
      monto: ingreso.monto.toString(),
      frecuencia: ingreso.frecuencia,
      earmark: ingreso.earmark || "",
    });
    setSheetOpen(true);
  };

  const onSubmit = async (data: IngresoForm) => {
    const ingresoData = {
      id: editingIngreso || crypto.randomUUID(),
      descripcion: data.descripcion,
      monto: parseFloat(data.monto),
      frecuencia: data.frecuencia,
      earmark: data.earmark || null,
      fecha: new Date(),
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingIngreso) {
      updateIngreso(editingIngreso, ingresoData);
    } else {
      addIngreso(ingresoData);
    }

    setSheetOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    deleteIngreso(id);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-ios-text-primary">Ingresos</h1>

      {ingresos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ios-text-secondary text-sm">Sin ingresos registrados</p>
          <p className="text-ios-text-tertiary text-xs mt-1">Toca + para agregar tu primer ingreso</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ingresos.map((ing) => (
            <SwipeableRow
              key={ing.id}
              onEdit={() => handleOpenEdit(ing)}
              onDelete={() => handleDelete(ing.id)}
            >
              <div className="bg-ios-bg-primary rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ios-text-primary">{ing.descripcion}</p>
                  <p className="text-xs text-ios-text-secondary">
                    {ing.frecuencia}
                    {ing.earmark ? ` · ${ing.earmark}` : ""}
                  </p>
                </div>
                <p className="text-base font-bold text-ios-success">
                  {formatCurrency(ing.monto)}
                </p>
              </div>
            </SwipeableRow>
          ))}
        </div>
      )}

      <FAB onClick={handleOpenCreate} />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingIngreso ? "Editar Ingreso" : "Nuevo Ingreso"}
        height="60%"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Descripción
            </label>
            <input
              {...register("descripcion", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="Salario, Freelance..."
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Monto
            </label>
            <input
              {...register("monto", { required: true })}
              type="number"
              step="0.01"
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="0.00"
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Frecuencia
            </label>
            <select
              {...register("frecuencia", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            >
              {FRECUENCIAS.map((freq) => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Tarjeta asociada (opcional)
            </label>
            <input
              {...register("earmark")}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="Visa Bancomer..."
              style={{ fontSize: 16 }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70"
            style={{ fontSize: 16 }}
          >
            {editingIngreso ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/ingresos/page.tsx
git commit -m "feat: add mobile ingresos page with swipe and bottom sheet"
```

---

### Task 12: Tarjetas page

**Files:**
- Create: `src/app/(mobile)/tarjetas/page.tsx`

- [ ] **Step 1: Crear tarjetas page**

```typescript
"use client";

import { useState } from "react";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { SwipeableRow } from "@/components/mobile/swipeable-row";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { FAB } from "@/components/mobile/fab";
import { formatCurrency } from "@/lib/utils/cn";
import { useForm } from "react-hook-form";

export default function TarjetasPage() {
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const addTarjeta = useTarjetasStore((s) => s.addTarjeta);
  const updateTarjeta = useTarjetasStore((s) => s.updateTarjeta);
  const deleteTarjeta = useTarjetasStore((s) => s.deleteTarjeta);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTarjeta, setEditingTarjeta] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const handleOpenCreate = () => {
    setEditingTarjeta(null);
    reset({ nombre: "", banco: "", ultimosDigitos: "", fechaCorte: "", limite: "", saldoActual: "" });
    setSheetOpen(true);
  };

  const handleOpenEdit = (tarjeta: any) => {
    setEditingTarjeta(tarjeta.id);
    reset({
      nombre: tarjeta.nombre,
      banco: tarjeta.banco,
      ultimosDigitos: tarjeta.ultimosDigitos,
      fechaCorte: tarjeta.fechaCorte.toString(),
      limite: tarjeta.limite.toString(),
      saldoActual: tarjeta.saldoActual?.toString() || "0",
    });
    setSheetOpen(true);
  };

  const onSubmit = async (data: any) => {
    const tarjetaData = {
      id: editingTarjeta || crypto.randomUUID(),
      nombre: data.nombre,
      banco: data.banco,
      ultimosDigitos: data.ultimosDigitos,
      fechaCorte: parseInt(data.fechaCorte),
      limite: parseFloat(data.limite),
      saldoActual: parseFloat(data.saldoActual || "0"),
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingTarjeta) {
      updateTarjeta(editingTarjeta, tarjetaData);
    } else {
      addTarjeta(tarjetaData);
    }

    setSheetOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    deleteTarjeta(id);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-ios-text-primary">Tarjetas</h1>

      {tarjetas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ios-text-secondary text-sm">Sin tarjetas registradas</p>
          <p className="text-ios-text-tertiary text-xs mt-1">Toca + para agregar tu primera tarjeta</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tarjetas.map((t) => (
            <SwipeableRow
              key={t.id}
              onEdit={() => handleOpenEdit(t)}
              onDelete={() => handleDelete(t.id)}
            >
              <div className="bg-ios-bg-primary rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-ios-text-primary">{t.nombre}</p>
                    <p className="text-xs text-ios-text-secondary">{t.banco} · terminación {t.ultimosDigitos}</p>
                  </div>
                  <p className={`text-base font-bold ${(t.saldoActual || 0) > 0 ? "text-ios-danger" : "text-ios-success"}`}>
                    {formatCurrency(t.saldoActual || 0)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-ios-text-tertiary">
                  <span>Corte día {t.fechaCorte}</span>
                  <span>Límite: {formatCurrency(t.limite)}</span>
                </div>
              </div>
            </SwipeableRow>
          ))}
        </div>
      )}

      <FAB onClick={handleOpenCreate} />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingTarjeta ? "Editar Tarjeta" : "Nueva Tarjeta"}
        height="70%"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Nombre
            </label>
            <input
              {...register("nombre", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="Visa, Mastercard..."
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Banco
            </label>
            <input
              {...register("banco", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="Bancomer, HSBC..."
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Últimos 4 dígitos
            </label>
            <input
              {...register("ultimosDigitos", { required: true })}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              placeholder="1234"
              maxLength={4}
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Día de corte
            </label>
            <input
              {...register("fechaCorte", { required: true })}
              type="number"
              min="1"
              max="31"
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Límite de crédito
            </label>
            <input
              {...register("limite", { required: true })}
              type="number"
              step="0.01"
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Saldo actual
            </label>
            <input
              {...register("saldoActual")}
              type="number"
              step="0.01"
              defaultValue="0"
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70"
            style={{ fontSize: 16 }}
          >
            {editingTarjeta ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(mobile\)/tarjetas/page.tsx
git commit -m "feat: add mobile tarjetas page with swipe and bottom sheet"
```

---

## Phase 5: Actualizar Routing Principal

### Task 13: Redirigir rutas dashboard existentes a mobile

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx` — hacer redirect a (mobile)
- Modify: `src/app/page.tsx` — redirect a /dashboard

- [ ] **Step 1: Actualizar page.tsx para redirect a dashboard**

```typescript
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
```

- [ ] **Step 2: Actualizar (dashboard)/layout.tsx para usar mobile layout**

Reemplazar contenido con redirect:

```typescript
import { redirect } from "next/navigation";

export default function DashboardLayout() {
  redirect("/dashboard");
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/app/\(dashboard\)/layout.tsx
git commit -m "refactor: redirect old dashboard routes to mobile layout"
```

---

## Verificación

Después de completar todos los tasks:

1. `npm run build` — verificar que no hay errores de tipos
2. Probar swipe en items de lista
3. Probar bottom sheet abre/cierra
4. Probar FAB aparece en páginas de listas
5. Verificar BottomNav muestra tabs correctos y navegación funciona

---

**Total: 13 tasks — 5 fases**

Plan saved to: `docs/superpowers/plans/2026-05-13-móvil-rediseño.md`