"use client";

import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useGastosStore } from "@/stores/use-gastos-store";
import { formatCurrency } from "@/lib/utils/cn";
import { formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { format } from "date-fns";

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

  const items: ActivityItem[] = [
    ...ingresos.map((i) => ({
      id: i.id!,
      type: "ingreso" as const,
      descripcion: i.descripcion,
      monto: i.monto,
      fecha: i.fecha,
      categoria: i.frecuencia,
    })),
    ...gastos.map((g) => ({
      id: g.id!,
      type: "gasto" as const,
      descripcion: g.descripcion,
      monto: g.monto,
      fecha: g.createdAt,
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
                className="bg-ios-bg-primary rounded-xl p-4 shadow-card flex items-center justify-between"
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
                    {formatDistanceToNow(typeof item.fecha === "string" ? parseISO(item.fecha) : item.fecha, { addSuffix: true, locale: es })}
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
    const date = typeof item.fecha === "string" ? parseISO(item.fecha) : item.fecha;
    let label: string;

    if (isToday(date)) {
      label = "Hoy";
    } else if (isYesterday(date)) {
      label = "Ayer";
    } else {
      label = format(date, "MMM d");
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
}