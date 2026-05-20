"use client";

import { useEffect } from "react";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { useIngresosStore } from "@/stores/use-ingresos-store";
import { useGastosStore } from "@/stores/use-gastos-store";

export function DataLoader() {
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);
  const fetchIngresos = useIngresosStore((s) => s.fetchIngresos);
  const fetchGastos = useGastosStore((s) => s.fetchGastos);

  useEffect(() => {
    fetchTarjetas();
    fetchIngresos();
    fetchGastos();
  }, [fetchTarjetas, fetchIngresos, fetchGastos]);

  return null;
}