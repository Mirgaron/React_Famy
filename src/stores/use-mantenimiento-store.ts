import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MantenimientoState {
  mantenimientos: any[];
  isLoading: boolean;
  addMantenimiento: (m: any) => void;
  updateMantenimiento: (id: string, m: any) => void;
  deleteMantenimiento: (id: string) => void;
  setMantenimientos: (m: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useMantenimientoStore = create<MantenimientoState>()(
  persist(
    (set) => ({
      mantenimientos: [],
      isLoading: false,
      addMantenimiento: (m) =>
        set((state) => ({ mantenimientos: [...state.mantenimientos, m] })),
      updateMantenimiento: (id, updated) =>
        set((state) => ({
          mantenimientos: state.mantenimientos.map((x) =>
            x.id === id ? { ...x, ...updated } : x
          ),
        })),
      deleteMantenimiento: (id) =>
        set((state) => ({
          mantenimientos: state.mantenimientos.filter((x) => x.id !== id),
        })),
      setMantenimientos: (mantenimientos) => set({ mantenimientos }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "mantenimiento-storage" }
  )
);