import { create } from "zustand";
import type { Ingreso } from "@/lib/schemas/ingreso.schema";
import { apiClient } from "@/lib/api/client";

interface IngresosState {
  ingresos: Ingreso[];
  isLoading: boolean;
  fetchIngresos: () => Promise<void>;
  addIngreso: (ingreso: Ingreso) => Promise<void>;
  updateIngreso: (id: string, updated: Partial<Ingreso>) => Promise<void>;
  deleteIngreso: (id: string) => Promise<void>;
  setIngresos: (ingresos: Ingreso[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useIngresosStore = create<IngresosState>()((set) => ({
  ingresos: [],
  isLoading: false,
  fetchIngresos: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient<{ data: Ingreso[] }>("/ingresos");
      set({ ingresos: res.data, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
  addIngreso: async (ingreso) => {
    const res = await apiClient<{ data: Ingreso }>("/ingresos", {
      method: "POST",
      body: ingreso,
    });
    set((state) => ({ ingresos: [res.data, ...state.ingresos] }));
  },
  updateIngreso: async (id, updated) => {
    const res = await apiClient<{ data: Ingreso }>(`/ingresos/${id}`, {
      method: "PUT",
      body: updated,
    });
    set((state) => ({
      ingresos: state.ingresos.map((i) => (i.id === id ? res.data : i)),
    }));
  },
  deleteIngreso: async (id) => {
    await apiClient(`/ingresos/${id}`, { method: "DELETE" });
    set((state) => ({ ingresos: state.ingresos.filter((i) => i.id !== id) }));
  },
  setIngresos: (ingresos) => set({ ingresos }),
  setLoading: (isLoading) => set({ isLoading }),
}));