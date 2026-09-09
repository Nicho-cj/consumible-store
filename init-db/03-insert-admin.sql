-- =========================================
-- 03-insert-admin.sql
-- @REVISAR: Script nuevo - inserta el usuario admin (RNF-05)
-- Admin: nombre = 'jesus', contrasena = '123456' (bcrypt hashed)
-- Se pueden insertar multiples admins agregando mas filas.
-- =========================================

INSERT INTO usuario (nombre, contrasena, rol, activo) VALUES
('jesus', '$2b$10$4vyAD3DjqN3KOSQVxjIuw.bt3KgvVBKFKaoOv/Z0wr82EO/hwMFVK', 'ADMIN_RECEPCION', TRUE);
