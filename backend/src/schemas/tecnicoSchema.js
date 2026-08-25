import { z } from 'zod';

const tecnicoSchema = z.object({
  id_tecnico: z.number().int().positive().optional(),
  nombre: z.string().min(1, 'Requerido').max(80, 'Máximo 80 caracteres'),
  activo: z.boolean().default(true),
});

export function validacionTecnico ({input}) {
     return tecnicoSchema.safeParse(input)
}

export function validacionParcialTecnico ({input}) {
     return tecnicoSchema.partial().safeParse(input)
}