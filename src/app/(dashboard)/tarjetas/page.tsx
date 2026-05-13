"use client";

import { useEffect, useState } from "react";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils/cn";

export default function TarjetasPage() {
  const { tarjetas, setTarjetas, addTarjeta, deleteTarjeta } = useTarjetasStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", banco: "", ultimosDigitos: "", fechaCorte: "", limite: "", saldoActual: "0" });

  useEffect(() => {
    fetch("/api/tarjetas").then(r => r.json()).then(j => { if (j.data) setTarjetas(j.data); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/tarjetas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, limite: parseFloat(form.limite), saldoActual: parseFloat(form.saldoActual) }),
    });
    const json = await res.json();
    if (json.data) { addTarjeta(json.data); setShowForm(false); setForm({ nombre: "", banco: "", ultimosDigitos: "", fechaCorte: "", limite: "", saldoActual: "0" }); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tarjetas/${id}`, { method: "DELETE" });
    deleteTarjeta(id);
  };

  const totalSaldo = tarjetas.reduce((sum, t) => sum + Number(t.saldoActual || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Tarjetas</h2>
          <p className="text-sm text-[#6b6b6b]">{tarjetas.length} tarjeta{tarjetas.length !== 1 ? "s" : ""}</p>
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
          <h3 className="font-bold text-[#1a1a2e] mb-4 text-[15px]">Nueva tarjeta</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Nombre en la tarjeta</Label>
              <Input
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                placeholder="ej. Visa Oro, Mastercard..."
                className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Banco</Label>
              <Input
                value={form.banco}
                onChange={e => setForm({ ...form, banco: e.target.value })}
                placeholder="ej. BBVA, HSBC..."
                className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Últimos 4 dígitos</Label>
                <Input
                  maxLength={4}
                  value={form.ultimosDigitos}
                  onChange={e => setForm({ ...form, ultimosDigitos: e.target.value })}
                  placeholder="1234"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                  required
                />
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Límite (MXN)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.limite}
                  onChange={e => setForm({ ...form, limite: e.target.value })}
                  placeholder="0.00"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold tracking-wide uppercase text-[#6b6b6b]">Saldo actual</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.saldoActual}
                  onChange={e => setForm({ ...form, saldoActual: e.target.value })}
                  placeholder="0.00"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px]"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-[#1a1a2e] hover:bg-[#16213e] text-white font-semibold rounded-xl text-[15px]"
            >
              Guardar tarjeta
            </Button>
          </form>
        </div>
      )}

      {/* Total */}
      {tarjetas.length > 0 && (
        <div className="rounded-2xl bg-[#1a1a2e] p-4 flex items-center justify-between">
          <p className="text-sm text-white/50 uppercase tracking-wide">Total saldo en tarjetas</p>
          <p className="text-2xl font-black text-red-400">{formatCurrency(totalSaldo)}</p>
        </div>
      )}

      {/* Cards */}
      {tarjetas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#d4d0c8] py-16 text-center">
          <p className="text-[#b0aea8] text-sm">Sin tarjetas registradas</p>
          <p className="text-[#b0aea8] text-xs mt-1">Toca "+ Agregar" para comenzar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tarjetas.map(t => (
            <div key={t.id || ""} className="rounded-2xl bg-white border border-[#e8e6e1] p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-black text-[#1a1a2e] text-[15px]">{t.nombre}</p>
                  <p className="text-xs text-[#6b6b6b]">{t.banco} · ****{t.ultimosDigitos}</p>
                </div>
                <button
                  onClick={() => handleDelete(t.id!)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 text-sm flex items-center justify-center hover:bg-red-100 transition-colors font-bold"
                  aria-label="Eliminar"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#faf9f7] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#6b6b6b]">Corte</p>
                  <p className="font-bold text-[#1a1a2e] text-sm">Día {t.fechaCorte}</p>
                </div>
                <div className="bg-[#faf9f7] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#6b6b6b]">Límite</p>
                  <p className="font-bold text-[#1a1a2e] text-sm">{formatCurrency(Number(t.limite))}</p>
                </div>
                <div className="bg-[#faf9f7] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#6b6b6b]">Saldo</p>
                  <p className={`font-black text-sm ${Number(t.saldoActual || 0) > 0 ? "text-red-500" : "text-green-600"}`}>
                    {formatCurrency(Number(t.saldoActual || 0))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}