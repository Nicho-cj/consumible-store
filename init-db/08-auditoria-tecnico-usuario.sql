-- =========================================
-- 08-auditoria-tecnico-usuario.sql
-- Auditoria real (RNF-07)
-- DECISION DEL NEGOCIO: los tecnicos NO tienen usuario de login; usan la vista
-- comunitaria (sin credenciales). Solo ADMIN_RECEPCION inicia sesion.
-- (Versión corregida: ya NO se crean usuarios TECNICO ni columna id_tecnico.
--  Ver LOG-ERRORES.md -> FASE 8 aclaración.)
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