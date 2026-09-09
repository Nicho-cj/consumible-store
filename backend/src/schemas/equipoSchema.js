import { z } from 'zod';

export const equipoSchema = z.object({
  nro_serial: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  marca: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  modelo: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  descripcion: z.string().nullish(),
  tipo_equipo: z.string().max(40).nullish(),
  id_cliente: z.number().int().positive().nullish(),
  contador_bn: z.number().int().min(0).default(0),
  contador_color: z.number().int().min(0).default(0),
});