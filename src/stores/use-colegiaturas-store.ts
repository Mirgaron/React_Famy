import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ColegiaturasState {
  colegiaturas: any[];
  isLoading: boolean;
  addColegiatura: (c: any) => void;
  updateColegiatura: (id: string, c: any) => void;
  deleteColegiatura: (id: string) => void;
  setColegiaturas: (c: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useColegiaturasStore = create<ColegiaturasState>()(
  persist(
    (set) => ({
      colegiaturas: [],
      isLoading: false,
      addColegiatura: (c) =>
        set((state) => ({ colegiaturas: [...state.colegiaturas, c] })),
      updateColegiatura: (id, updated) =>
        set((state) => ({
          colegiaturas: state.colegiaturas.map((x) =>
            x.id === id ? { ...x, ...updated } : x
          ),
        })),
      deleteColegiatura: (id) =>
        set((state) => ({
          colegiaturas: state.colegiaturas.filter((x) => x.id !== id),
        })),
      setColegiaturas: (colegiaturas) => set({ colegiaturas }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "colegiaturas-storage" }
  )
);