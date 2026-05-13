"use client";

import { useEffect, useState } from "react";
import { useIngresosStore } from "@/stores/use-ingresos-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/cn";

export default function IngresosPage() {
  const { ingresos, isLoading, setIngresos, addIngreso, deleteIngreso } = useIngresosStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descripcion: "", monto: "", frecuencia: "MENSUAL", fecha: "" });

  useEffect(() => {
    fetch("/api/ingresos").then(r => r.json()).then(j => { if (j.data) setIngresos(j.data); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/ingresos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, monto: parseFloat(form.monto) }),
    });
    const json = await res.json();
    if (json.data) { addIngreso(json.data); setShowForm(false); setForm({ descripcion: "", monto: "", frecuencia: "MENSUAL", fecha: "" }); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/ingresos/${id}`, { method: "DELETE" });
    deleteIngreso(id);
  };

  const total = ingresos.reduce((sum, i) => sum + Number(i.monto), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Ingresos</h2>
          <p className="text-sm text-[#6b6b6b]">{ingresos.length} registro{ingresos.length !== 1 ? "s" : ""}</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={`h-10 px-4 rounded-xl font-semibold text-[14px] transition-all ${showForm ? "bg-[#e8e6e1] text-[#3d3d3d] hover:bg-[#d4d0c8]" : "bg-[#1a1a2e] text-white hover:bg-[#16213e]"}`}
        >
          {showForm ? "Cancelar" : "+ Agregar"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl bg-white border border-[#e8e6e1] p-5">
          <h3 className="font-bold text-[#1a1a2e] mb-4 text-[15px]">Nuevo ingreso</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                placeholder="ej. Salario, Freelance..."
                className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Monto (MXN)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })}
                placeholder="0.00"
                className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Frecuencia</Label>
                <Select value={form.frecuencia} onValueChange={v => setForm({ ...form, frecuencia: v })}>
                  <SelectTrigger className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMANAL">Semanal</SelectItem>
                    <SelectItem value="QUINCENAL">Quincenal</SelectItem>
                    <SelectItem value="MENSUAL">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Fecha</Label>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#1a1a2e] hover:bg-[#16213e] text-white font-semibold rounded-xl text-[15px]"
            >
              Guardar ingreso
            </Button>
          </form>
        </div>
      )}

      {/* Total */}
      {ingresos.length > 0 && (
        <div className="rounded-2xl bg-[#1a1a2e] p-4 flex items-center justify-between">
          <p className="text-sm text-white/50 uppercase tracking-wide">Total ingresos</p>
          <p className="text-2xl font-black text-green-400">{formatCurrency(total)}</p>
        </div>
      )}

      {/* List */}
      {ingresos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#d4d0c8] py-16 text-center">
          <p className="text-[#b0aea8] text-sm">Sin ingresos registrados</p>
          <p className="text-[#b0aea8] text-xs mt-1">Toca "+ Agregar" para comenzar</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ingresos.map(ing => (
            <div key={ing.id || ""} className="rounded-2xl bg-white border border-[#e8e6e1] p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1a1a2e] text-[15px] truncate">{ing.descripcion}</p>
                <p className="text-xs text-[#6b6b6b] mt-0.5">{ing.frecuencia} · {ing.fecha}</p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="font-black text-green-600 text-[15px] whitespace-nowrap">{formatCurrency(Number(ing.monto))}</span>
                <button
                  onClick={() => handleDelete(ing.id!)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 text-sm flex items-center justify-center hover:bg-red-100 transition-colors font-bold"
                  aria-label="Eliminar"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}