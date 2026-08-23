import { z } from 'zod';

const ordenServicioSchema = z.object({
  codigo_orden: z.string().min(1, 'Requerido').max(20, 'Máximo 20 caracteres'),
  fecha_ingreso: z.coerce.date().default(() => new Date()),
  tipo_servicio: z.string().min(1, 'Requerido').max(40, 'Máximo 40 caracteres'),     //   OBSERVACIÓN
  falla_reportada: z.string().min(1, 'La falla es requerida'),
  contador_inicio: z.number().int('Debe ser entero').min(0, 'No puede ser negativo').default(0),
  cotizacion_aprobada: z.boolean().nullish(),
  monto_cobro: z.number().min(0, 'El monto no puede ser negativo').nullish(),
  id_cliente: z.number().int().positive('ID de cliente inválido'),
  id_equipo: z.number().int().positive('ID de equipo inválido'),
  id_usuario_recep: z.number().int().positive('ID de usuario inválido'),
  id_tecnico: z.number().int().positive('ID de técnico inválido'),
});

export function validacionOrden ({input}) {
     return ordenServicioSchema.safeParse(input)
}

export function validacionParcialOrden ({input}) {
     return ordenServicioSchema.partial().safeParse(input)
}