"use client";

import { useEffect, useState } from "react";
import { useGastosStore } from "@/stores/use-gastos-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GastosFijosPage() {
  const { gastos, setGastos, addGasto, deleteGasto } = useGastosStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descripcion: "", monto: "", categoria: "LUZ", fechaCorte: "", periodicidad: "MENSUAL" });

  useEffect(() => {
    fetch("/api/gastos-fijos").then(r => r.json()).then(j => { if (j.data) setGastos(j.data); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/gastos-fijos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, monto: parseFloat(form.monto), fechaCorte: parseInt(form.fechaCorte) }),
    });
    const json = await res.json();
    if (json.data) { addGasto(json.data); setShowForm(false); setForm({ descripcion: "", monto: "", categoria: "LUZ", fechaCorte: "", periodicidad: "MENSUAL" }); }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/gastos-fijos/${id}`, { method: "DELETE" });
    deleteGasto(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gastos Fijos</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancelar" : "+ Agregar"}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Nuevo Gasto Fijo</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Descripción</Label><Input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} required /></div>
              <div><Label>Monto</Label><Input type="number" step="0.01" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} required /></div>
              <div><Label>Categoría</Label>
                <Select value={form.categoria} onValueChange={v => setForm({ ...form, categoria: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUZ">Luz</SelectItem>
                    <SelectItem value="GAS">Gas</SelectItem>
                    <SelectItem value="AGUA">Agua</SelectItem>
                    <SelectItem value="INTERNET">Internet</SelectItem>
                    <SelectItem value="SUSCRIPCION">Suscripción</SelectItem>
                    <SelectItem value="OTRO">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Día de corte</Label><Input type="number" min="1" max="31" value={form.fechaCorte} onChange={e => setForm({ ...form, fechaCorte: e.target.value })} required /></div>
              <div><Label>Periodicidad</Label>
                <Select value={form.periodicidad} onValueChange={v => setForm({ ...form, periodicidad: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MENSUAL">Mensual</SelectItem>
                    <SelectItem value="BIMESTRAL">Bimestral</SelectItem>
                    <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                    <SelectItem value="ANUAL">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {gastos.map(g => (
          <Card key={g.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{g.descripcion}</p>
                <p className="text-sm text-muted-foreground">{g.categoria} — Corte día {g.fechaCorte}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-red-600">${Number(g.monto).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(g.id)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {gastos.length === 0 && <p className="text-muted-foreground text-center py-8">Sin gastos fijos registrados</p>}
      </div>
    </div>
  );
}
