import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Ingreso } from "@/lib/schemas/ingreso.schema";

interface IngresosState {
  ingresos: Ingreso[];
  isLoading: boolean;
  addIngreso: (ingreso: Ingreso) => void;
  updateIngreso: (id: string, ingreso: Partial<Ingreso>) => void;
  deleteIngreso: (id: string) => void;
  setIngresos: (ingresos: Ingreso[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useIngresosStore = create<IngresosState>()(
  persist(
    (set) => ({
      ingresos: [],
      isLoading: false,
      addIngreso: (ingreso) =>
        set((state) => ({ ingresos: [...state.ingresos, ingreso] })),
      updateIngreso: (id, updated) =>
        set((state) => ({
          ingresos: state.ingresos.map((i) =>
            i.id === id ? { ...i, ...updated } : i
          ),
        })),
      deleteIngreso: (id) =>
        set((state) => ({
          ingresos: state.ingresos.filter((i) => i.id !== id),
        })),
      setIngresos: (ingresos) => set({ ingresos }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "ingresos-storage" }
  )
);
