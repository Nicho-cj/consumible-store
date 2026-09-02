import { z } from 'zod';

export const clienteSchema = z.object({
  ci_rif: z.string().min(7).max(12),
  nombre: z.string().min(2).max(50).nullish(),
  telefono: z.string().max(15).nullish(),
  direccion: z.string().nullish(),
});