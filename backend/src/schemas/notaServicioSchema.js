import { z } from 'zod';

export const notaServicioSchema = z.object({
  id_nota: z.number().int().positive().optional(),
  fecha_inicio: z.coerce.date().default(() => new Date()),
  fecha_fin: z.coerce.date().nullish(),
  diagnostico_falla: z.string().nullish(),
  trabajo_realizado: z.string().nullish(),
  contador_final: z.number().int().min(0).nullish(),
  observaciones: z.string().nullish(),
  id_orden: z.number().int().positive('ID de orden inválido'),
});