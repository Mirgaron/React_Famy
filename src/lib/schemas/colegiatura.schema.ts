import { z } from "zod";

export const nivelSchema = z.enum(["PRIMARIA", "SECUNDARIA", "PREPARATORIA", "UNIVERSIDAD"]);

export const colegiaturaSchema = z.object({
  id: z.string().uuid().optional(),
  hijo: z.string().min(1, "El nombre del hijo es requerido"),
  nivel: nivelSchema,
  bimestre: z.number().int().min(1).max(6),
  monto: z.number().positive("El monto debe ser positivo"),
  anio: z.number().int().min(2020).max(2100),
});

export type Colegiatura = z.infer<typeof colegiaturaSchema>;

export const mantenimientoSchema = z.object({
  id: z.string().uuid().optional(),
  categoria: z.string().min(1, "La categoría es requerida"),
  proveedor: z.string().optional(),
  descripcion: z.string().optional(),
  monto: z.number().positive("El monto debe ser positivo"),
  fecha: z.string().min(1, "La fecha es requerida"),
});

export type Mantenimiento = z.infer<typeof mantenimientoSchema>;
