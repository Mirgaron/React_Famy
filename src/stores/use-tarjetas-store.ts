import { create } from "zustand";
import { apiClient } from "@/lib/api/client";
import type { Tarjeta, Cargo } from "@/lib/schemas/tarjeta.schema";

interface TarjetasState {
  tarjetas: Tarjeta[];
  cargos: Cargo[];
  isLoading: boolean;
  fetchTarjetas: () => Promise<void>;
  addTarjeta: (tarjeta: Tarjeta) => Promise<void>;
  updateTarjeta: (id: string, tarjeta: Partial<Tarjeta>) => Promise<void>;
  deleteTarjeta: (id: string) => Promise<void>;
  addCargo: (cargo: Cargo) => Promise<void>;
  deleteCargo: (id: string) => Promise<void>;
  setTarjetas: (tarjetas: Tarjeta[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useTarjetasStore = create<TarjetasState>()((set) => ({
  tarjetas: [],
  cargos: [],
  isLoading: false,
  fetchTarjetas: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient<{ data: Tarjeta[] }>("/tarjetas");
      const tarjetas = res.data;
      const allCargos = tarjetas.flatMap((t) => t.cargos || []);
      set({ tarjetas, cargos: allCargos, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
  addTarjeta: async (tarjeta) => {
    const res = await apiClient<{ data: Tarjeta }>("/tarjetas", {
      method: "POST",
      body: tarjeta,
    });
    set((state) => ({ tarjetas: [...state.tarjetas, res.data] }));
  },
  updateTarjeta: async (id, updated) => {
    const res = await apiClient<{ data: Tarjeta }>(`/tarjetas/${id}`, {
      method: "PUT",
      body: updated,
    });
    set((state) => ({
      tarjetas: state.tarjetas.map((t) => (t.id === id ? res.data : t)),
    }));
  },
  deleteTarjeta: async (id) => {
    await apiClient(`/tarjetas/${id}`, { method: "DELETE" });
    set((state) => ({
      tarjetas: state.tarjetas.filter((t) => t.id !== id),
      cargos: state.cargos.filter((c) => c.tarjetaId !== id),
    }));
  },
  addCargo: async (cargo) => {
    const res = await apiClient<{ data: Cargo }>("/cargos", {
      method: "POST",
      body: cargo,
    });
    set((state) => ({ cargos: [...state.cargos, res.data] }));
  },
  deleteCargo: async (id) => {
    await apiClient(`/cargos/${id}`, { method: "DELETE" });
    set((state) => ({ cargos: state.cargos.filter((c) => c.id !== id) }));
  },
  setTarjetas: (tarjetas) => set({ tarjetas }),
  setLoading: (isLoading) => set({ isLoading }),
}));