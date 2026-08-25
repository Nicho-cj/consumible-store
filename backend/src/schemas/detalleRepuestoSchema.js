import { z } from 'zod';

const detalleRepuestoSchema = z.object({
  id_detalle: z.number().int().positive().optional(),
  nombre: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  descripcion: z.string().min(1, 'Requerido').max(100, 'Máximo 100 caracteres'),
  cantidad: z.number().int('Debe ser entero').gt(0, 'La cantidad debe ser mayor a 0').default(1), // Mapea CHECK (cantidad > 0)
  id_orden: z.number().int().positive('ID de orden inválido'),
});

export function validacionDetalleRepuesto ({input}) {
     return detalleRepuestoSchema.safeParse(input)
}

export function validacionParcialDetalleRepuesto ({input}) {
     return detalleRepuestoSchema.partial().safeParse(input)
}