import { create } from "zustand";
import { apiClient } from "@/lib/api/client";

interface GastosFijosState {
  gastos: any[];
  isLoading: boolean;
  fetchGastos: () => Promise<void>;
  addGasto: (gasto: any) => Promise<void>;
  updateGasto: (id: string, gasto: any) => Promise<void>;
  deleteGasto: (id: string) => Promise<void>;
  setGastos: (gastos: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useGastosStore = create<GastosFijosState>()((set) => ({
  gastos: [],
  isLoading: false,
  fetchGastos: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient<{ data: any[] }>("/gastos-fijos");
      set({ gastos: res.data, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
  addGasto: async (gasto) => {
    const res = await apiClient<{ data: any }>("/gastos-fijos", {
      method: "POST",
      body: gasto,
    });
    set((state) => ({ gastos: [...state.gastos, res.data] }));
  },
  updateGasto: async (id, updated) => {
    const res = await apiClient<{ data: any }>(`/gastos-fijos/${id}`, {
      method: "PUT",
      body: updated,
    });
    set((state) => ({
      gastos: state.gastos.map((g) => (g.id === id ? res.data : g)),
    }));
  },
  deleteGasto: async (id) => {
    await apiClient(`/gastos-fijos/${id}`, { method: "DELETE" });
    set((state) => ({ gastos: state.gastos.filter((g) => g.id !== id) }));
  },
  setGastos: (gastos) => set({ gastos }),
  setLoading: (isLoading) => set({ isLoading }),
}));
