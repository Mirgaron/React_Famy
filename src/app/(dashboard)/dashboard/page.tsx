"use client";

import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useGastosStore } from "@/stores/use-gastos-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/cn";

export default function DashboardPage() {
  const ingresos = useIngresosStore((s) => s.ingresos);
  const gastos = useGastosStore((s) => s.gastos);
  const tarjetas = useTarjetasStore((s) => s.tarjetas);

  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const totalSaldos = tarjetas.reduce((sum, t) => sum + (t.saldoActual || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIngresos)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gastos Fijos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalGastos)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo en Tarjetas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalSaldos)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {ingresos.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sin ingresos registrados</p>
            ) : (
              <ul className="space-y-2">
                {ingresos.slice(0, 5).map((ing) => (
                  <li key={ing.id} className="flex justify-between text-sm">
                    <span>{ing.descripcion}</span>
                    <span className="font-medium text-green-600">{formatCurrency(ing.monto)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos Fijos</CardTitle>
          </CardHeader>
          <CardContent>
            {gastos.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sin gastos fijos registrados</p>
            ) : (
              <ul className="space-y-2">
                {gastos.slice(0, 5).map((g) => (
                  <li key={g.id} className="flex justify-between text-sm">
                    <span>{g.descripcion}</span>
                    <span className="font-medium text-red-600">{formatCurrency(g.monto)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
