import { z } from 'zod';

// @REVISAR: schema actualizado. Ahora incluye contrasena y rol. La contrasena se almacena hasheada (bcrypt)
export const usuarioSchema = z.object({
  nombre: z.string().min(1, 'Requerido').max(80, 'Máximo 80 caracteres'),
  contrasena: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres').max(60),
  rol: z.enum(['ADMIN_RECEPCION', 'TECNICO'], { message: 'Rol inválido. Solo ADMIN_RECEPCION o TECNICO' }),
  activo: z.boolean().default(true),
});
