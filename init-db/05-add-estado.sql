-- =========================================
-- 05-add-estado.sql
-- @REVISAR: agrega las columnas estado y fecha_salida a orden_servicio
-- El controlador (stateMachine) y el modelo ya gestionan `estado` y `fecha_salida`,
-- pero el schema inicial no los inclui.a (el estado se derivaba de otros campos).
-- Este script materializa el estado como columna explicita y agrega fecha_salida.
--   estado. Valores: REGISTRADO, EN_DIAGNOSTICO, SOLUCION_COTIZACION, PROCESO_TECNICO,
--            LISTO_ENTREGA, ENTREGADO, CANCELADO
-- =========================================

ALTER TABLE orden_servicio
    ADD COLUMN IF NOT EXISTS fecha_salida TIMESTAMP;

ALTER TABLE orden_servicio
    ADD COLUMN IF NOT EXISTS estado VARCHAR(30) NOT NULL DEFAULT 'REGISTRADO';

-- Backfill para datos existentes (idempotente: solo toca filas en REGISTRADO)
-- Entregadas
UPDATE orden_servicio SET estado = 'ENTREGADO'
WHERE estado = 'REGISTRADO' AND fecha_salida IS NOT NULL AND cotizacion_aprobada = TRUE;

-- Canceladas
UPDATE orden_servicio SET estado = 'CANCELADO'
WHERE estado = 'REGISTRADO' AND fecha_salida IS NOT NULL
  AND (cotizacion_aprobada = FALSE OR cotizacion_aprobada IS NULL);

-- Listas para entrega (nota cerrada, sin fecha de salida)
UPDATE orden_servicio o SET estado = 'LISTO_ENTREGA'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.fecha_fin IS NOT NULL);

-- En proceso técnico (cotización aprobada, nota en curso)
UPDATE orden_servicio o SET estado = 'PROCESO_TECNICO'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL AND o.cotizacion_aprobada = TRUE
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.fecha_fin IS NULL);

-- En solución y cotización (diagnóstico registrado, sin respuesta del cliente)
UPDATE orden_servicio o SET estado = 'SOLUCION_COTIZACION'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL AND o.cotizacion_aprobada IS NULL
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.diagnostico_falla IS NOT NULL);

-- En diagnóstico (técnico asignado, sin diagnóstico aún)
UPDATE orden_servicio o SET estado = 'EN_DIAGNOSTICO'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL AND o.id_tecnico IS NOT NULL
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.diagnostico_falla IS NULL);