"use client";

import { useEffect, useState } from "react";
import { useIngresosStore } from "@/stores/use-ingresos-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ingresos</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancelar" : "+ Agregar"}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Nuevo Ingreso</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Descripción</Label><Input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} required /></div>
              <div><Label>Monto</Label><Input type="number" step="0.01" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} required /></div>
              <div><Label>Frecuencia</Label>
                <Select value={form.frecuencia} onValueChange={v => setForm({ ...form, frecuencia: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMANAL">Semanal</SelectItem>
                    <SelectItem value="QUINCENAL">Quincenal</SelectItem>
                    <SelectItem value="MENSUAL">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} required /></div>
              <Button type="submit" disabled={isLoading}>Guardar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {ingresos.map(ing => (
          <Card key={ing.id || ""}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{ing.descripcion}</p>
                <p className="text-sm text-muted-foreground">{ing.frecuencia} — {ing.fecha}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600">${Number(ing.monto).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(ing.id!)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {ingresos.length === 0 && <p className="text-muted-foreground text-center py-8">Sin ingresos registrados</p>}
      </div>
    </div>
  );
}
