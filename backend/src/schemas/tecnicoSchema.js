import { z } from 'zod';

export const tecnicoSchema = z.object({
  id_tecnico: z.number().int().positive().optional(),
  nombre: z.string().min(1, 'Requerido').max(80, 'Máximo 80 caracteres'),
  activo: z.boolean().default(true),
});