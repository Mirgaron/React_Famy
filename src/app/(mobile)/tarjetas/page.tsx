"use client";

import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { SwipeableRow } from "@/components/mobile/swipeable-row";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { FAB } from "@/components/mobile/fab";
import { formatCurrency } from "@/lib/utils/cn";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api/client";

export default function TarjetasPage() {
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const addTarjeta = useTarjetasStore((s) => s.addTarjeta);
  const updateTarjeta = useTarjetasStore((s) => s.updateTarjeta);
  const deleteTarjeta = useTarjetasStore((s) => s.deleteTarjeta);
  const addCargo = useTarjetasStore((s) => s.addCargo);
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);
  const cargos = useTarjetasStore((s) => s.cargos);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTarjeta, setEditingTarjeta] = useState<string | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedTarjetaId, setSelectedTarjetaId] = useState<string | null>(null);
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
        console.log(data);

    const tarjetaData: any = {
      nombre: data.nombre,
      banco: data.banco,
      ultimosDigitos: data.ultimosDigitos,
      fechaCorte: parseInt(data.fechaCorte),
      limite: parseFloat(data.limite),
      saldoActual: parseFloat(data.saldoActual || "0"),
    };

    if (editingTarjeta) {
      updateTarjeta(editingTarjeta, tarjetaData);
    } else {
      addTarjeta({ ...tarjetaData, id: uuidv4(), userId: "", createdAt: new Date(), updatedAt: new Date() });
    }

    setSheetOpen(false);
    reset();
  };

  const handleAddCargo = async (data: any) => {
    console.log("Data recibida:", JSON.stringify(data));
    console.log("selectedTarjetaId:", selectedTarjetaId);
    console.log("descripcion:", data.descripcion);
    console.log("monto:", data.monto);
    console.log("msi:", data.msi);
    if (!data.descripcion || !data.monto) {
      alert("Completa todos los campos");
      return;
    }
    try {
      await apiClient("/cargos", {
        method: "POST",
        body: {
          descripcion: data.descripcion,
          monto: parseFloat(data.monto),
          tarjetaId: selectedTarjetaId,
          msi: parseInt(data.msi || "1"),
          fecha: new Date().toISOString(),
        },
      });
      reset({ descripcion: "", monto: "", msi: "1" });
      await fetchTarjetas();
    } catch (e: any) {
      console.error("Error al agregar cargo:", e);
      alert("Error: " + (e.message || "No se pudo agregar el cargo"));
    }
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
              onEdit={() => { console.log("Tocando tarjeta:", t.id); if (t.id) { setSelectedTarjetaId(t.id); setDetailSheetOpen(true); } }}
              onDelete={() => handleDelete(t.id!)}
            >
              <div className="bg-ios-bg-primary rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-ios-text-primary">{t.nombre}</p>
                    <p className="text-xs text-ios-text-secondary">{t.banco} · terminacion {t.ultimosDigitos}</p>
                  </div>
                  <p className={`text-base font-bold ${(t.saldoActual || 0) > 0 ? "text-ios-danger" : "text-ios-success"}`}>
                    {formatCurrency(t.saldoActual || 0)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-ios-text-tertiary">
                  <span>Corte dia {t.fechaCorte}</span>
                  <span>Limite: {formatCurrency(t.limite)}</span>
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
        height="90%"
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
              Ultimos 4 digitos
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
              Dia de corte
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
              Limite de credito
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

      <BottomSheet
        isOpen={detailSheetOpen}
        onClose={() => { setDetailSheetOpen(false); setSelectedTarjetaId(null); }}
        title={tarjetas.find(t => t.id === selectedTarjetaId)?.nombre || "Detalle de Tarjeta"}
        height="85%"
      >
        <div className="space-y-4">
          {/* Lista de cargos */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Cargos Recientes</h3>
            {cargos.filter(c => c.tarjetaId === selectedTarjetaId).length === 0 ? (
              <p className="text-ios-text-secondary text-sm text-center py-4">Sin cargos registrados</p>
            ) : (
              <div className="space-y-2">
                {cargos.filter(c => c.tarjetaId === selectedTarjetaId).map((cargo) => (
                  <div key={cargo.id} className="bg-ios-bg-secondary rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-ios-text-primary">{cargo.descripcion}</p>
                      <p className="text-xs text-ios-text-tertiary">
                        {cargo.msi && cargo.msi > 1 ? `${cargo.msi} MSI` : "Sin MSI"} · {(cargo as any).createdAt ? new Date((cargo as any).createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-ios-text-primary">{formatCurrency(cargo.monto)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario para agregar cargo */}
          <div className="border-t border-ios-bg-tertiary pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Agregar Cargo</h3>
            <div className="space-y-3">
              <input
                {...register("descripcion")}
                placeholder="Descripción del cargo"
                className="w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm"
              />
              <input
                {...register("monto")}
                type="number"
                step="0.01"
                placeholder="Monto"
                className="w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm"
              />
              <div>
                <label className="text-xs font-medium text-ios-text-secondary uppercase">Meses sin intereses</label>
                <select
                  {...register("msi")}
                  className="mt-1 w-full h-11 px-4 rounded-lg bg-ios-bg-secondary text-ios-text-primary text-sm"
                >
                  <option value="1">Sin MSI</option>
                  <option value="3">3 meses</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  const descripcion = (document.querySelector('input[placeholder="Descripción del cargo"]') as HTMLInputElement)?.value;
                  const monto = (document.querySelector('input[placeholder="Monto"]') as HTMLInputElement)?.value;
                  const msiSelect = document.querySelector('select') as HTMLSelectElement;
                  console.log("Valores directos:", { descripcion, monto, msi: msiSelect?.value });
                  if (selectedTarjetaId && descripcion && monto) {
                    apiClient("/cargos", {
                      method: "POST",
                      body: { descripcion, monto: parseFloat(monto), tarjetaId: selectedTarjetaId, msi: parseInt(msiSelect?.value || "1"), fecha: new Date().toISOString() }
                    }).then(() => { console.log("Cargo agregado"); fetchTarjetas(); }).catch((e) => { console.error("Error:", e); });
                  } else { console.log("Faltan campos"); }
                }}
                className="w-full h-11 bg-ios-accent text-white font-semibold rounded-xl"
              >
                Agregar Cargo
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}