"use client";

import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import type { Ingreso } from "@/lib/schemas/ingreso.schema";
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
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIngreso, setEditingIngreso] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<IngresoForm>();

  useEffect(() => {
    if (tarjetas.length === 0) fetchTarjetas();
  }, [tarjetas.length, fetchTarjetas]);

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
    const ingresoData: Omit<Ingreso, "id"> = {
      descripcion: data.descripcion,
      monto: parseFloat(data.monto),
      frecuencia: data.frecuencia as "SEMANAL" | "QUINCENAL" | "MENSUAL",
      earmark: data.earmark || undefined,
      fecha: new Date().toISOString(),
    };

    if (editingIngreso) {
      updateIngreso(editingIngreso, ingresoData);
    } else {
      addIngreso({ ...ingresoData, id:uuidv4() } as Ingreso);
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
              onDelete={() => handleDelete(ing.id!)}
            >
              <div className="bg-ios-bg-primary rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ios-text-primary">{ing.descripcion}</p>
                  <p className="text-xs text-ios-text-secondary">
                    {ing.frecuencia}
                    {ing.earmark ? ` · ${tarjetas.find(t => t.id === ing.earmark)?.nombre || ing.earmark}` : ""}
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
            <select
              {...register("earmark")}
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
            {editingIngreso ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}