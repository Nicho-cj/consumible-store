import { z } from 'zod';

export const usuarioSchema = z.object({
  nombre: z.string().min(1, 'Requerido').max(80, 'Máximo 80 caracteres'),
  rol: z.string().min(1, 'Requerido').max(30, 'Máximo 30 caracteres'),
  activo: z.boolean().default(true),
});