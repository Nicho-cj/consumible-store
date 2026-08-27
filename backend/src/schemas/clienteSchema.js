import { z } from 'zod';

export const clienteSchema = z.object({
  identificacion: z.string('Entrada inválida: se esperaba String').min(1, 'Requerido').max(12,'Máximo 12 caracteres'),
  nombre: z.string().max(50,'Máximo 50 caracteres').nullish(),
  telefono: z.number().max(15, 'Máximo 15 caracteres').nullish(),
  direccion: z.string().nullish(),
});