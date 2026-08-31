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
    contraseña      VARCHAR(60)
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