-- =========================================
-- 1. DATOS MAESTROS INICIALES
-- =========================================

INSERT INTO usuario (nombre, contrasena, rol, activo) VALUES
('jesus', '$2b$10$4vyAD3DjqN3KOSQVxjIuw.bt3KgvVBKFKaoOv/Z0wr82EO/hwMFVK', 'ADMIN_RECEPCION', TRUE),
('Maria Reyes', '$2b$10$4vyAD3DjqN3KOSQVxjIuw.bt3KgvVBKFKaoOv/Z0wr82EO/hwMFVK', 'ADMIN_RECEPCION', TRUE),
('Danirys Sucre', '$2b$10$4vyAD3DjqN3KOSQVxjIuw.bt3KgvVBKFKaoOv/Z0wr82EO/hwMFVK', 'ADMIN_RECEPCION', TRUE);

INSERT INTO tecnico (nombre, activo) VALUES
('Hector', TRUE),
('Dario', TRUE),
('Eloy', TRUE),
('Jesus', TRUE),
('Hector M', TRUE),
('Domingo', TRUE);

-- =========================================
-- 2. BACKFILL / UPDATE DE ESTADOS
-- =========================================

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