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
