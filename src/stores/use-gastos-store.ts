import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GastosFijosState {
  gastos: any[];
  isLoading: boolean;
  addGasto: (gasto: any) => void;
  updateGasto: (id: string, gasto: any) => void;
  deleteGasto: (id: string) => void;
  setGastos: (gastos: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useGastosStore = create<GastosFijosState>()(
  persist(
    (set) => ({
      gastos: [],
      isLoading: false,
      addGasto: (gasto) =>
        set((state) => ({ gastos: [...state.gastos, gasto] })),
      updateGasto: (id, updated) =>
        set((state) => ({
          gastos: state.gastos.map((g) =>
            g.id === id ? { ...g, ...updated } : g
          ),
        })),
      deleteGasto: (id) =>
        set((state) => ({
          gastos: state.gastos.filter((g) => g.id !== id),
        })),
      setGastos: (gastos) => set({ gastos }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "gastos-storage" }
  )
);