import { z } from 'zod';

const clienteSchema = z.object({
  identificacion: z.string().min(1, 'Requerido').max(12, 'Máximo 12 caracteres'),
  nombre: z.string().max(50, 'Máximo 50 caracteres').nullish(),
  telefono: z.string().max(15, 'Máximo 15 caracteres').nullish(),
  direccion: z.string().nullish(),
});

export function validacionCliente ({input}) {
     return clienteSchema.safeParse(input)
}

export function validacionParcialCliente ({input}) {
     return clienteSchema.partial().safeParse(input)
}