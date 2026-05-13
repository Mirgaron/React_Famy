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