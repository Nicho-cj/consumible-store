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