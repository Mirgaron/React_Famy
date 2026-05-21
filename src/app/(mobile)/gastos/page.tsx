"use client";

import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useGastosStore } from "@/stores/use-gastos-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
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
  tarjetaId: string;
}

export default function GastosPage() {
  const gastos = useGastosStore((s) => s.gastos);
  const addGasto = useGastosStore((s) => s.addGasto);
  const updateGasto = useGastosStore((s) => s.updateGasto);
  const deleteGasto = useGastosStore((s) => s.deleteGasto);
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingGasto, setEditingGasto] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<GastoForm>();

  useEffect(() => {
    if (tarjetas.length === 0) fetchTarjetas();
  }, [tarjetas.length, fetchTarjetas]);

  const handleOpenCreate = () => {
    setEditingGasto(null);
    reset({ descripcion: "", monto: "", categoria: "LUZ", periodicidad: "MENSUAL", fechaCorte: "1", tarjetaId: "" });
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
      tarjetaId: gasto.tarjetaId || "",
    });
    setSheetOpen(true);
  };

  const onSubmit = async (data: GastoForm) => {
    const gastoData: any = {
      descripcion: data.descripcion,
      monto: parseFloat(data.monto),
      categoria: data.categoria,
      periodicidad: data.periodicidad,
      fechaCorte: parseInt(data.fechaCorte),
    };

    if (data.tarjetaId && data.tarjetaId.trim() !== "") gastoData.tarjetaId = data.tarjetaId;

    if (editingGasto) {
      updateGasto(editingGasto, gastoData);
    } else {
      addGasto({ ...gastoData, id: uuidv4(), userId: "", createdAt: new Date(), updatedAt: new Date() });
    }

    setSheetOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    deleteGasto(id);
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
              onDelete={() => handleDelete(g.id!)}
            >
              <div className="bg-ios-bg-primary rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ios-text-primary">{g.descripcion}</p>
                  <p className="text-xs text-ios-text-secondary">
                    {g.categoria} · {g.periodicidad} · Corte día {g.fechaCorte}
                    {g.tarjetaId ? ` · ${tarjetas.find(t => t.id === g.tarjetaId)?.nombre || "Tarjeta"}` : ""}
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
        height="85%"
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

          <div>
            <label className="text-xs font-medium text-ios-text-secondary uppercase tracking-wide">
              Tarjeta asociada (opcional)
            </label>
            <select
              {...register("tarjetaId")}
              className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm border-0"
              style={{ fontSize: 16 }}
            >
              <option value="">Ninguna</option>
              {tarjetas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} - {t.banco}
                </option>
              ))}
            </select>
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