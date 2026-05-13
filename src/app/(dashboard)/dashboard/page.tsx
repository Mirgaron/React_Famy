"use client";

import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useGastosStore } from "@/stores/use-gastos-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { formatCurrency } from "@/lib/utils/cn";

export default function DashboardPage() {
  const ingresos = useIngresosStore((s) => s.ingresos);
  const gastos = useGastosStore((s) => s.gastos);
  const tarjetas = useTarjetasStore((s) => s.tarjetas);

  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const balance = totalIngresos - totalGastos;

  return (
    <div className="space-y-8">
      {/* Balance hero */}
      <div className="rounded-2xl bg-[#1a1a2e] p-6 text-white">
        <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-1">
          Balance total
        </p>
        <p className="text-4xl font-black tracking-tight">
          {formatCurrency(balance)}
        </p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide">Ingresos</p>
            <p className="text-lg font-bold text-green-400">{formatCurrency(totalIngresos)}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide">Gastos</p>
            <p className="text-lg font-bold text-red-400">{formatCurrency(totalGastos)}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-[#e8e6e1] p-5">
          <p className="text-xs uppercase tracking-wide text-[#6b6b6b] mb-1">Ingresos</p>
          <p className="text-2xl font-black text-[#1a1a2e]">{formatCurrency(totalIngresos)}</p>
          <p className="text-xs text-[#6b6b6b] mt-1">{ingresos.length} registro{ingresos.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-2xl bg-white border border-[#e8e6e1] p-5">
          <p className="text-xs uppercase tracking-wide text-[#6b6b6b] mb-1">Gastos Fijos</p>
          <p className="text-2xl font-black text-[#1a1a2e]">{formatCurrency(totalGastos)}</p>
          <p className="text-xs text-[#6b6b6b] mt-1">{gastos.length} gasto{gastos.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Tarjetas summary */}
      {tarjetas.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#e8e6e1] p-5">
          <p className="text-xs uppercase tracking-wide text-[#6b6b6b] mb-3">Saldos en tarjetas</p>
          <div className="space-y-3">
            {tarjetas.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1a1a2e] text-[15px]">{t.nombre}</p>
                  <p className="text-xs text-[#6b6b6b]">{t.banco}</p>
                </div>
                <p className={`font-bold text-[15px] ${(t.saldoActual || 0) > 0 ? "text-red-500" : "text-green-600"}`}>
                  {formatCurrency(t.saldoActual || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingresos recientes */}
      <div className="rounded-2xl bg-white border border-[#e8e6e1] p-5">
        <p className="text-xs uppercase tracking-wide text-[#6b6b6b] mb-3">Ingresos recientes</p>
        {ingresos.length === 0 ? (
          <p className="text-sm text-[#b0aea8] py-4 text-center">Sin ingresos registrados</p>
        ) : (
          <div className="space-y-3">
            {ingresos.slice(0, 4).map((ing) => (
              <div key={ing.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1a1a2e] text-[15px]">{ing.descripcion}</p>
                  <p className="text-xs text-[#6b6b6b]">{ing.frecuencia}</p>
                </div>
                <p className="font-bold text-green-600 text-[15px]">{formatCurrency(ing.monto)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gastos recientes */}
      <div className="rounded-2xl bg-white border border-[#e8e6e1] p-5">
        <p className="text-xs uppercase tracking-wide text-[#6b6b6b] mb-3">Gastos fijos</p>
        {gastos.length === 0 ? (
          <p className="text-sm text-[#b0aea8] py-4 text-center">Sin gastos fijos registrados</p>
        ) : (
          <div className="space-y-3">
            {gastos.slice(0, 4).map((g) => (
              <div key={g.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1a1a2e] text-[15px]">{g.descripcion}</p>
                  <p className="text-xs text-[#6b6b6b]">{g.categoria} · {g.periodicidad}</p>
                </div>
                <p className="font-bold text-red-500 text-[15px]">{formatCurrency(g.monto)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}