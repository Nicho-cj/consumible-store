import { z } from 'zod';

export const detalleRepuestoSchema = z.object({
  id_detalle: z.number().int().positive().optional(),
  id_repuesto: z.number().int().positive('ID de repuesto inválido'),
  id_orden: z.number().int().positive('ID de orden inválido'),
});