import { z } from 'zod';

export const repuestoSchema = z.object({
  nombre: z.string().trim().min(1, 'Requerido').max(80, 'Máximo 80 caracteres'),
});