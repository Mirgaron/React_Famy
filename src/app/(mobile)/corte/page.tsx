"use client";

import { useEffect, useState } from "react";
import { usePaymentsStore } from "@/stores/use-payments-store";
import { useTarjetasStore } from "@/stores/use-tarjetas-store";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { formatCurrency } from "@/lib/utils/cn";

export default function CortePage() {
  const cortes = usePaymentsStore((s) => s.cortes);
  const fetchCortes = usePaymentsStore((s) => s.fetchCortes);
  const createPayment = usePaymentsStore((s) => s.createPayment);
  const tarjetas = useTarjetasStore((s) => s.tarjetas);
  const fetchTarjetas = useTarjetasStore((s) => s.fetchTarjetas);

  const [selectedCorte, setSelectedCorte] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [origenId, setOrigenId] = useState<string>("");
  const [tipoOrigen, setTipoOrigen] = useState<string>("TARJETA");

  useEffect(() => {
    fetchCortes();
    if (tarjetas.length === 0) fetchTarjetas();
  }, []);

  const handlePagar = (corte: any) => {
    setSelectedCorte(corte);
    setSheetOpen(true);
  };

  const confirmarPago = async () => {
    if (!selectedCorte || (tipoOrigen === "TARJETA" && !origenId)) return;
    await createPayment({
      tarjetaCreditoId: selectedCorte.tarjeta.id,
      tarjetaOrigenId: tipoOrigen === "TARJETA" ? origenId : "",
      monto: selectedCorte.gastosPeriodo,
      tipoOrigen,
    });
    setSheetOpen(false);
    fetchCortes();
  };

  if (cortes.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-ios-text-secondary">No hay cortes pendientes hoy</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-ios-text-primary">
        Corte del {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
      </h1>

      {cortes.map((corte) => (
        <div key={corte.tarjeta.id} className="bg-ios-bg-primary rounded-xl p-4 shadow-card">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold text-ios-text-primary">{corte.tarjeta.nombre}</p>
              <p className="text-xs text-ios-text-secondary">{corte.tarjeta.banco}</p>
            </div>
            <p className="text-sm text-ios-text-tertiary">Límite: {formatCurrency(corte.tarjeta.limite)}</p>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-ios-text-secondary">Disponible:</span>
              <span className="font-medium">{formatCurrency(corte.tarjeta.disponible)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ios-text-secondary">Sin MSI:</span>
              <span className="font-medium">{formatCurrency(corte.sinMSITotal)}</span>
            </div>
            {corte.msiTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ios-text-secondary">MSI:</span>
                <span className="font-medium">{formatCurrency(corte.msiTotal)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-ios-bg-tertiary pt-3 mb-3">
            <div className="flex justify-between">
              <span className="font-semibold text-ios-text-primary">Total a pagar:</span>
              <span className="font-bold text-ios-danger">{formatCurrency(corte.gastosPeriodo)}</span>
            </div>
          </div>

          <button
            onClick={() => handlePagar(corte)}
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70"
          >
            PAGAR {formatCurrency(corte.gastosPeriodo)}
          </button>
        </div>
      ))}

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Confirmar pago" height="60%">
        <div className="space-y-4">
          <div className="bg-ios-bg-secondary rounded-lg p-4">
            <p className="text-sm text-ios-text-secondary">A:</p>
            <p className="font-semibold">{selectedCorte?.tarjeta.nombre}</p>
            <p className="text-xs text-ios-text-tertiary">{selectedCorte?.tarjeta.banco}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-ios-text-secondary uppercase mb-2">Pagar desde:</p>
            <div className="space-y-2">
              {tarjetas.filter(t => t.id !== selectedCorte?.tarjeta.id).map((t) => (
                <label key={t.id} className="flex items-center gap-3 p-3 bg-ios-bg-secondary rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="origen"
                    value={t.id}
                    checked={origenId === t.id && tipoOrigen === "TARJETA"}
                    onChange={() => { setOrigenId(t.id); setTipoOrigen("TARJETA"); }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.nombre} - {t.banco}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 p-3 bg-ios-bg-secondary rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="origen"
                  value="efectivo"
                  checked={tipoOrigen === "EFECTIVO"}
                  onChange={() => setTipoOrigen("EFECTIVO")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Efectivo</span>
              </label>
            </div>
          </div>

          <button
            onClick={confirmarPago}
            disabled={tipoOrigen === "TARJETA" && !origenId}
            className="w-full h-12 bg-ios-accent text-white font-semibold rounded-xl active:opacity-70 disabled:opacity-50"
          >
            CONFIRMAR PAGO {selectedCorte ? formatCurrency(selectedCorte.gastosPeriodo) : ""}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}