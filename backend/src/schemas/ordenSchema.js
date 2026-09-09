import { z } from 'zod';
import { ESTADOS_VALIDOS } from '../utils/stateMachine.js';

export const ordenSchema = z.object({
  // @REVISAR: FASE 5a - nullish para que el backend autogenere ORD-{YYYY}-{sec} si el cliente no lo envia
  codigo_orden: z.string().min(1, 'Requerido').max(20, 'Máximo 20 caracteres').nullish(),
  // @REVISAR: sin .default(() => new Date()) para no inyectar valores en PATCH parciales.
  // La BD ya aplica DEFAULT CURRENT_TIMESTAMP al crear.
  fecha_ingreso: z.coerce.date().nullish(),
  tipo_servicio: z.string().min(1, 'Requerido').max(40, 'Máximo 40 caracteres'),
  falla_reportada: z.string().min(1, 'La falla es requerida'),
  // @REVISAR: sin .default(0) — el default se inyectaba en cualquier PATCH parcial y sobreescribia
  // el contador_inicio real en BD. La columna es nullable.
  contador_inicio: z.number().int('Debe ser entero').min(0, 'No puede ser negativo').nullish(),
  // @REVISAR: FASE 5-1 - contador_final faltaba en el schema y zod lo eliminaba en PATCH parciales,
  // por eso RN-04 rechazaba la entrega (el contador final se registra en la orden al entregar).
  contador_final: z.number().int('Debe ser entero').min(0, 'No puede ser negativo').nullish(),
  cotizacion_aprobada: z.boolean().nullish(),
  monto_cobro: z.number().min(0, 'El monto no puede ser negativo').nullish(),
  id_cliente: z.number().int().positive('ID de cliente inválido'),
  id_equipo: z.number().int().positive('ID de equipo inválido'),
  id_usuario_recep: z.number().int().positive('ID de usuario inválido'),
  // @REVISAR: se cambio a nullish() porque la BD permite id_tecnico NULL (orden sin asignar). El admin asigna el tecnico al recibir el equipo.
  id_tecnico: z.number().int().positive('ID de técnico inválido').nullish(),
  // @REVISAR: campo agregado 'estado' — sin esto Zod lo eliminaba al validar (strip) y la state machine nunca aplicaba cambios de estado.
  estado: z.enum(ESTADOS_VALIDOS, { message: 'Estado inválido' }).nullish(),
  // @REVISAR: campos agregados - fecha_salida (entrega), motivo_cambio_tecnico (cambio de tecnico), numero_factura (factura asociada)
  fecha_salida: z.coerce.date().nullish(),
  motivo_cambio_tecnico: z.string().nullish(),
  numero_factura: z.number().int().positive('Número de factura inválido').nullish(),
});
