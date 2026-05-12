import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tarjeta, Cargo } from "@/lib/schemas/tarjeta.schema";

interface TarjetasState {
  tarjetas: Tarjeta[];
  cargos: Cargo[];
  isLoading: boolean;
  addTarjeta: (tarjeta: Tarjeta) => void;
  updateTarjeta: (id: string, tarjeta: Partial<Tarjeta>) => void;
  deleteTarjeta: (id: string) => void;
  addCargo: (cargo: Cargo) => void;
  deleteCargo: (id: string) => void;
  setTarjetas: (tarjetas: Tarjeta[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useTarjetasStore = create<TarjetasState>()(
  persist(
    (set) => ({
      tarjetas: [],
      cargos: [],
      isLoading: false,
      addTarjeta: (tarjeta) =>
        set((state) => ({ tarjetas: [...state.tarjetas, tarjeta] })),
      updateTarjeta: (id, updated) =>
        set((state) => ({
          tarjetas: state.tarjetas.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),
      deleteTarjeta: (id) =>
        set((state) => ({
          tarjetas: state.tarjetas.filter((t) => t.id !== id),
          cargos: state.cargos.filter((c) => c.tarjetaId !== id),
        })),
      addCargo: (cargo) =>
        set((state) => ({ cargos: [...state.cargos, cargo] })),
      deleteCargo: (id) =>
        set((state) => ({
          cargos: state.cargos.filter((c) => c.id !== id),
        })),
      setTarjetas: (tarjetas) => set({ tarjetas }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "tarjetas-storage" }
  )
);
