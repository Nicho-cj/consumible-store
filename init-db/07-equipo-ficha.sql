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