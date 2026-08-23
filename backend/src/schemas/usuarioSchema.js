import { z } from 'zod';

const usuarioSchema = z.object({
  nombre: z.string().min(1, 'Requerido').max(80, 'Máximo 80 caracteres'),
  rol: z.string().min(1, 'Requerido').max(30, 'Máximo 30 caracteres'),
  activo: z.boolean().default(true),
});

export function validacionUsuario ({input}) {
     return usuarioSchema.safeParse(input)
}

export function validacionParcialUsuario ({input}) {
     return usuarioSchema.partial().safeParse(input)
}