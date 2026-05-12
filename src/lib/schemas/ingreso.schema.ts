import { z } from "zod";

export const frecuenciaSchema = z.enum(["SEMANAL", "QUINCENAL", "MENSUAL"]);

export const ingresoSchema = z.object({
  id: z.string().uuid().optional(),
  descripcion: z.string().min(1, "La descripción es requerida"),
  monto: z.number().positive("El monto debe ser positivo"),
  frecuencia: frecuenciaSchema,
  fecha: z.string().min(1, "La fecha es requerida"),
  earmark: z.string().optional(),
});

export type Ingreso = z.infer<typeof ingresoSchema>;
