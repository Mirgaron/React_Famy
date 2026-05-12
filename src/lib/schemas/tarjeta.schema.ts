import { z } from "zod";

export const tarjetaSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  banco: z.string().min(1, "El banco es requerido"),
  ultimosDigitos: z.string().length(4, "Deben ser exactamente 4 dígitos"),
  fechaCorte: z.number().min(1).max(31),
  limite: z.number().positive("El límite debe ser positivo"),
  saldoActual: z.number().min(0).default(0),
});

export type Tarjeta = z.infer<typeof tarjetaSchema>;

export const cargoSchema = z.object({
  id: z.string().uuid().optional(),
  descripcion: z.string().min(1, "La descripción es requerida"),
  monto: z.number().positive("El monto debe ser positivo"),
  msi: z.number().int().min(1).max(12).default(1),
  mesCorte: z.string().regex(/^\d{4}-\d{2}$/, "Formato: YYYY-MM"),
  tarjetaId: z.string().uuid("Selecciona una tarjeta"),
});

export type Cargo = z.infer<typeof cargoSchema>;
