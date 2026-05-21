"use client";

import { useEffect, useState } from "react";
import { useGastosStore } from "@/stores/use-gastos-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/cn";

export default function GastosFijosPage() {
  const { gastos, setGastos, addGasto, deleteGasto } = useGastosStore();
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descripcion: "", monto: "", categoria: "LUZ", fechaCorte: "", periodicidad: "MENSUAL", tarjetaId: "" });

  useEffect(() => {
    fetch("/api/gastos-fijos").then(r => r.json()).then(j => { if (j.data) setGastos(j.data); });
    if (tarjetas.length === 0) fetchTarjetas();
  }, [tarjetas.length, fetchTarjetas, setGastos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, monto: parseFloat(form.monto), fechaCorte: parseInt(form.fechaCorte) };
    if (!payload.tarjetaId) delete payload.tarjetaId;
    const res = await fetch("/api/gastos-fijos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.data) { addGasto(json.data); setShowForm(false); setForm({ descripcion: "", monto: "", categoria: "LUZ", fechaCorte: "", periodicidad: "MENSUAL", tarjetaId: "" }); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/gastos-fijos/${id}`, { method: "DELETE" });
    deleteGasto(id);
  };

  const total = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Gastos Fijos</h2>
          <p className="text-sm text-[#6b6b6b]">{gastos.length} gasto{gastos.length !== 1 ? "s" : ""} fijo{gastos.length !== 1 ? "s" : ""}</p>
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
          <h3 className="font-bold text-[#1a1a2e] mb-4 text-[15px]">Nuevo gasto fijo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                placeholder="ej. CFE, Telmex, Netflix..."
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
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Categoría</Label>
                <Select value={form.categoria} onValueChange={v => setForm({ ...form, categoria: v })}>
                  <SelectTrigger className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUZ">Luz ⚡</SelectItem>
                    <SelectItem value="GAS">Gas 🔥</SelectItem>
                    <SelectItem value="AGUA">Agua 💧</SelectItem>
                    <SelectItem value="INTERNET">Internet 🌐</SelectItem>
                    <SelectItem value="SUSCRIPCION">Suscripción 📱</SelectItem>
                    <SelectItem value="OTRO">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Día corte</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={form.fechaCorte}
                  onChange={e => setForm({ ...form, fechaCorte: e.target.value })}
                  placeholder="15"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Periodicidad</Label>
              <Select value={form.periodicidad} onValueChange={v => setForm({ ...form, periodicidad: v })}>
                <SelectTrigger className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MENSUAL">Mensual</SelectItem>
                  <SelectItem value="BIMESTRAL">Bimestral</SelectItem>
                  <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                  <SelectItem value="ANUAL">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Tarjeta asociada (opcional)</Label>
              <Select value={form.tarjetaId} onValueChange={v => setForm({ ...form, tarjetaId: v })}>
                <SelectTrigger className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]">
                  <SelectValue placeholder="Ninguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguna</SelectItem>
                  {tarjetas.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nombre} - {t.banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-[#1a1a2e] hover:bg-[#16213e] text-white font-semibold rounded-xl text-[15px]"
            >
              Guardar gasto
            </Button>
          </form>
        </div>
      )}

      {/* Total */}
      {gastos.length > 0 && (
        <div className="rounded-2xl bg-[#1a1a2e] p-4 flex items-center justify-between">
          <p className="text-sm text-white/50 uppercase tracking-wide">Total gastos fijos</p>
          <p className="text-2xl font-black text-red-400">{formatCurrency(total)}</p>
        </div>
      )}

      {/* List */}
      {gastos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#d4d0c8] py-16 text-center">
          <p className="text-[#b0aea8] text-sm">Sin gastos fijos registrados</p>
          <p className="text-[#b0aea8] text-xs mt-1">Toca "+ Agregar" para comenzar</p>
        </div>
      ) : (
        <div className="space-y-2">
          {gastos.map(g => (
            <div key={g.id} className="rounded-2xl bg-white border border-[#e8e6e1] p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1a1a2e] text-[15px] truncate">{g.descripcion}</p>
                <p className="text-xs text-[#6b6b6b] mt-0.5">
                  {g.categoria} · Corte día {g.fechaCorte} · {g.periodicidad}
                  {g.tarjetaId ? ` · ${tarjetas.find(t => t.id === g.tarjetaId)?.nombre || "Tarjeta"}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="font-black text-red-500 text-[15px] whitespace-nowrap">{formatCurrency(Number(g.monto))}</span>
                <button
                  onClick={() => handleDelete(g.id!)}
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