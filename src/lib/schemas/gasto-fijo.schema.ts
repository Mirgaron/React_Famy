import { z } from "zod";

export const categoriaGastoSchema = z.enum(["LUZ", "GAS", "AGUA", "INTERNET", "SUSCRIPCION", "OTRO"]);
export const periodicidadSchema = z.enum(["MENSUAL", "BIMESTRAL", "TRIMESTRAL", "ANUAL"]);

export const gastoFijoSchema = z.object({
  id: z.string().uuid().optional(),
  descripcion: z.string().min(1, "La descripción es requerida"),
  monto: z.number().positive("El monto debe ser positivo"),
  categoria: categoriaGastoSchema,
  fechaCorte: z.number().min(1).max(31),
  periodicidad: periodicidadSchema,
});

export type GastoFijo = z.infer<typeof gastoFijoSchema>;
