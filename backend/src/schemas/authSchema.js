import { z } from 'zod';

// @REVISAR: schema para login. El admin ingresa nombre + contrasena (sin email)
export const authLoginSchema = z.object({
  nombre: z.string().min(1, 'El nombre de usuario es requerido'),
  contrasena: z.string().min(1, 'La contrasena es requerida'),
});
