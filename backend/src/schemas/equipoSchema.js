import { z } from 'zod';

export const equipoSchema = z.object({
  nro_serial: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  marca: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  modelo: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  descripcion: z.string().nullish(),
});