CREATE TABLE cliente (
    id_cliente          SERIAL PRIMARY KEY,
    ci_rif              VARCHAR(12) NOT NULL UNIQUE,
    nombre_completo     VARCHAR(60),
    telefono            VARCHAR(15),
    direccion           TEXT
);

CREATE TABLE equipo (
    id_equipo   SERIAL PRIMARY KEY,
    nro_serial  VARCHAR(30) NOT NULL UNIQUE,
    marca       VARCHAR(60) NOT NULL,
    modelo      VARCHAR(60) NOT NULL,
    descripcion TEXT
);

CREATE TABLE usuario (
    id_usuario      SERIAL PRIMARY KEY,
    nombre          VARCHAR(60) NOT NULL,
    rol             VARCHAR(30) NOT NULL,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    contrasena      VARCHAR(60)
);

CREATE TABLE tecnico (
    id_tecnico  SERIAL PRIMARY KEY,
    nombre      VARCHAR(60) NOT NULL,
    activo      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE orden_servicio (
    id_orden            SERIAL PRIMARY KEY,
    codigo_orden        VARCHAR(15) NOT NULL UNIQUE,
    fecha_ingreso       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_servicio       VARCHAR(40) NOT NULL,
    falla_reportada     TEXT NOT NULL,
    contador_inicio     INTEGER NULL,
    cotizacion_aprobada BOOLEAN DEFAULT NULL,
    monto_cobro         NUMERIC(10, 2),
    id_cliente          INTEGER NOT NULL,
    id_equipo           INTEGER NOT NULL,
    id_usuario_recep    INTEGER NOT NULL,
    id_tecnico          INTEGER,

    CONSTRAINT fk_orden_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_usuario_recep
        FOREIGN KEY (id_usuario_recep)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_tecnico
        FOREIGN KEY (id_tecnico)
        REFERENCES tecnico(id_tecnico)
        ON DELETE RESTRICT
);

CREATE TABLE nota_servicio (
    id_nota           SERIAL PRIMARY KEY,
    fecha_inicio      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin         TIMESTAMP,
    diagnostico_falla TEXT,
    trabajo_realizado TEXT,
    contador_final    INTEGER,
    observaciones     TEXT,
    id_orden          INTEGER NOT NULL UNIQUE,

    CONSTRAINT fk_nota_orden
        FOREIGN KEY (id_orden)
        REFERENCES orden_servicio (id_orden)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE detalle_repuesto (
    id_detalle           SERIAL PRIMARY KEY,
    nombre               VARCHAR(50) NOT NULL,
    descripcion          VARCHAR(100) NOT NULL,
    cantidad             INTEGER NOT NULL DEFAULT 1,
    id_orden             INTEGER NOT NULL,

    CONSTRAINT chk_cantidad_positiva
        CHECK (cantidad > 0),

    CONSTRAINT fk_repuesto_orden
        FOREIGN KEY (id_orden)
        REFERENCES orden_servicio (id_orden)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =========================================
-- Datos maestros iniciales
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
-- 04-alter-orden.sql
-- @REVISAR: Script nuevo - agrega columnas a orden_servicio
--  1. motivo_cambio_tecnico: justificacion del admin al cambiar de tecnico (flujo taller)
--  2. numero_factura: numero de factura asociada a la orden cuando esta entregada (RF-10)
-- =========================================

ALTER TABLE orden_servicio
    ADD COLUMN IF NOT EXISTS motivo_cambio_tecnico TEXT;

ALTER TABLE orden_servicio
    ADD COLUMN IF NOT EXISTS numero_factura INTEGER;

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

-- En proceso tÃ©cnico (cotizaciÃ³n aprobada, nota en curso)
UPDATE orden_servicio o SET estado = 'PROCESO_TECNICO'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL AND o.cotizacion_aprobada = TRUE
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.fecha_fin IS NULL);

-- En soluciÃ³n y cotizaciÃ³n (diagnÃ³stico registrado, sin respuesta del cliente)
UPDATE orden_servicio o SET estado = 'SOLUCION_COTIZACION'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL AND o.cotizacion_aprobada IS NULL
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.diagnostico_falla IS NOT NULL);

-- En diagnÃ³stico (tÃ©cnico asignado, sin diagnÃ³stico aÃºn)
UPDATE orden_servicio o SET estado = 'EN_DIAGNOSTICO'
WHERE o.estado = 'REGISTRADO' AND o.fecha_salida IS NULL AND o.id_tecnico IS NOT NULL
  AND EXISTS (SELECT 1 FROM nota_servicio n WHERE n.id_orden = o.id_orden AND n.diagnostico_falla IS NULL);

-- FASE 5-1: permite eliminar una orden aunque tenga repuestos registrados.
-- detalle_repuesto hereda el mismo comportamiento de nota_servicio (limpieza en cascada).

ALTER TABLE detalle_repuesto
    DROP CONSTRAINT fk_repuesto_orden;

ALTER TABLE detalle_repuesto
    ADD CONSTRAINT fk_repuesto_orden
        FOREIGN KEY (id_orden)
        REFERENCES orden_servicio (id_orden)
        ON UPDATE CASCADE
        ON DELETE CASCADE;

-- FASE 5-2: RF-03 ficha tecnica de equipo con tipo, cliente propietario y contadores B/N + Color.
-- La tabla equipo original solo tenia nro_serial, marca, modelo y descripcion.

ALTER TABLE equipo
    ADD COLUMN tipo_equipo VARCHAR(40),
    ADD COLUMN contador_bn INTEGER DEFAULT 0,
    ADD COLUMN contador_color INTEGER DEFAULT 0;

ALTER TABLE equipo
    ADD COLUMN id_cliente INTEGER;

ALTER TABLE equipo
    ADD CONSTRAINT fk_equipo_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE RESTRICT;

-- =========================================
-- 08-auditoria-tecnico-usuario.sql
-- Auditoria real (RNF-07)
-- DECISION DEL NEGOCIO: los tecnicos NO tienen usuario de login; usan la vista
-- comunitaria (sin credenciales). Solo ADMIN_RECEPCION inicia sesion.
-- (VersiÃ³n corregida: ya NO se crean usuarios TECNICO ni columna id_tecnico.
--  Ver LOG-ERRORES.md -> FASE 8 aclaraciÃ³n.)
-- =========================================

CREATE TABLE IF NOT EXISTS log_auditoria (
    id_log      SERIAL PRIMARY KEY,
    fecha       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario  INTEGER REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    rol         VARCHAR(30),
    modulo      VARCHAR(40) NOT NULL,
    accion      VARCHAR(60) NOT NULL,
    detalles    TEXT
);

-- El backend conecta con el rol "admin": darle permisos sobre la nueva tabla.
GRANT ALL PRIVILEGES ON TABLE log_auditoria TO admin;
GRANT ALL PRIVILEGES ON SEQUENCE log_auditoria_id_log_seq TO admin;

