import { create } from "zustand";
import { apiClient } from "@/lib/api/client";

interface Payment {
  id: string;
  monto: number;
  tipo: "PAGO" | "CARGO";
  tarjetaCreditoId: string | null;
  tarjetaOrigenId: string | null;
  createdAt: string;
}

interface CorteData {
  tarjeta: { id: string; nombre: string; banco: string; limite: number; saldoActual: number; disponible: number };
  gastosPeriodo: number;
  saldoDisponible: number;
  sinMSITotal: number;
  msiTotal: number;
  msiInfo: Record<string, { monto: number; exhibits: any[] }>;
  cargos: Payment[];
}

interface PaymentsState {
  cortes: CorteData[];
  payments: Payment[];
  isLoading: boolean;
  fetchCortes: () => Promise<void>;
  fetchPayments: (tarjetaId?: string) => Promise<void>;
  createPayment: (data: { tarjetaCreditoId: string; tarjetaOrigenId?: string; monto: number; tipoOrigen: string }) => Promise<void>;
}

export const usePaymentsStore = create<PaymentsState>()((set) => ({
  cortes: [],
  payments: [],
  isLoading: false,
  fetchCortes: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient<{ data: CorteData[] }>("/corte");
      set({ cortes: res.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  fetchPayments: async (tarjetaId?: string) => {
    const endpoint = tarjetaId ? `/payments?tarjetaId=${tarjetaId}` : "/payments";
    const res = await apiClient<{ data: Payment[] }>(endpoint);
    set({ payments: res.data });
  },
  createPayment: async (data) => {
    await apiClient("/payments", { method: "POST", body: data });
  },
}));