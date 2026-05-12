"use client";

import { useEffect, useState } from "react";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TarjetasPage() {
  const { tarjetas, setTarjetas, addTarjeta, updateTarjeta, deleteTarjeta } = useTarjetasStore();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tarjetas de Crédito</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancelar" : "+ Agregar"}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Nueva Tarjeta</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Nombre</Label><Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required /></div>
              <div><Label>Banco</Label><Input value={form.banco} onChange={e => setForm({ ...form, banco: e.target.value })} required /></div>
              <div><Label>Últimos 4 dígitos</Label><Input maxLength={4} value={form.ultimosDigitos} onChange={e => setForm({ ...form, ultimosDigitos: e.target.value })} required /></div>
              <div><Label>Día de corte</Label><Input type="number" min="1" max="31" value={form.fechaCorte} onChange={e => setForm({ ...form, fechaCorte: e.target.value })} required /></div>
              <div><Label>Límite</Label><Input type="number" step="0.01" value={form.limite} onChange={e => setForm({ ...form, limite: e.target.value })} required /></div>
              <div><Label>Saldo actual</Label><Input type="number" step="0.01" value={form.saldoActual} onChange={e => setForm({ ...form, saldoActual: e.target.value })} /></div>
              <Button type="submit">Guardar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {tarjetas.map(t => (
          <Card key={t.id || ""}>
            <CardHeader><CardTitle>{t.nombre}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t.banco} — ****{t.ultimosDigitos}</p>
              <p className="text-sm">Corte día {t.fechaCorte}</p>
              <p className="mt-2"><span className="text-muted-foreground">Límite:</span> ${Number(t.limite).toLocaleString("es-MX")}</p>
              <p><span className="text-muted-foreground">Saldo:</span> <span className="font-bold text-orange-600">${Number(t.saldoActual || 0).toLocaleString("es-MX")}</span></p>
              <div className="mt-3 flex gap-2">
                <Button variant="destructive" size="sm" onClick={() => deleteTarjeta(t.id!)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {tarjetas.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">Sin tarjetas registradas</p>}
      </div>
    </div>
  );
}
