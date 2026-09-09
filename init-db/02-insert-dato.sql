-- En este documento se van a ingresar datos maestros
INSERT INTO cliente (ci_rif, nombre_completo, telefono, direccion) VALUES
('V-12345678-9', 'Juan Pérez', '0414-1234567', 'Av. Principal, Edificio Central, Caracas'),
('J-98765432-1', 'Tecnología Global C.A.', '0212-9876543', 'Zona Industrial, Galpón 4, Valencia'),
('V-8765432-1', 'María Gómez', '0424-5551234', 'Urb. Los Mangos, Calle 3, Maracay');

INSERT INTO equipo (nro_serial, marca, modelo, descripcion) VALUES
('SN-HP-2023-01', 'HP', 'LaserJet Pro M404n', 'Impresora láser monocromática'),
('SN-EPSON-889', 'Epson', 'L3210', 'Impresora multifuncional de tanque de tinta'),
('SN-CANON-441', 'Canon', 'imageRUNNER 2525', 'Fotocopiadora multifuncional láser');

-- @REVISAR: roles alineados con el esquema de la app (ADMIN_RECEPCION / TECNICO).
-- Las contrasenas placeholder no son validas para login. El admin real se inserta en 03-insert-admin.sql
INSERT INTO usuario (nombre, rol, activo, contrasena) VALUES
('Ana Rodríguez', 'ADMIN_RECEPCION', TRUE, NULL),
('Carlos Administrador', 'ADMIN_RECEPCION', TRUE, NULL);

INSERT INTO tecnico (nombre, activo) VALUES
('Pedro Martínez', TRUE),
('Luis Sánchez', TRUE);

INSERT INTO orden_servicio (codigo_orden, tipo_servicio, falla_reportada, contador_inicio, cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico) VALUES
('ORD-2026-001', 'Reparación', 'No enciende y presenta atasco de papel frecuente.', 15000, TRUE, 120.00, 1, 1, 1, 1),
('ORD-2026-002', 'Mantenimiento', 'Mantenimiento preventivo general y revisión de inyectores.', 8500, TRUE, 65.50, 2, 2, 1, 2);

INSERT INTO nota_servicio (fecha_inicio, fecha_fin, diagnostico_falla, trabajo_realizado, contador_final, observaciones, id_orden) VALUES
('2026-09-01 09:00:00', '2026-09-01 14:30:00', 'Fusor dañado y sensor de papel obstruido.', 'Se reemplazó el conjunto de fusor y se limpiaron los sensores.', 15050, 'Equipo probado satisfactoriamente.', 1),
('2026-09-02 10:00:00', NULL, 'Cabezal de impresión con inyectores parcialmente obstruidos.', 'Se realizó ciclo de limpieza profunda de cabezales.', 8520, 'Pendiente prueba final de color.', 2);

INSERT INTO detalle_repuesto (nombre, descripcion, cantidad, id_orden) VALUES
('Kit de Fusor', 'Conjunto de fusor compatible HP M404', 1, 1),
('Rodillo de carga', 'Rodillo de transferencia secundario', 1, 1);