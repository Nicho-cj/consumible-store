CREATE TABLE cliente (
    id_cliente          SERIAL PRIMARY KEY,
    identificacion      VARCHAR(20) NOT NULL UNIQUE,
    nombre              VARCHAR(100) NOT NULL,
    telefono            VARCHAR(20) ,
    direccion           TEXT
);

CREATE TABLE equipo (
    id_equipo   SERIAL PRIMARY KEY,
    serial      VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    marca       VARCHAR(50) NOT NULL,
    modelo      VARCHAR(50) NOT NULL,

    CONSTRAINT fk_equipo_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE usuario (
    id_usuario      SERIAL PRIMARY KEY,
    nombre_apellido VARCHAR(80) NOT NULL,
    rol             VARCHAR(30) NOT NULL,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_usuario_rol
        CHECK (rol IN ('Administrador Técnico', 'Técnico de
Taller'))
);

CREATE TABLE orden_servicio (
    id_orden            SERIAL PRIMARY KEY,
    codigo_orden        VARCHAR(20) NOT NULL UNIQUE,
    fecha_ingreso       DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo_servicio       VARCHAR(40) NOT NULL,
    falla_reportada     TEXT NOT NULL,
    contador_inicio     INTEGER NOT NULL,
    contador_final      INTEGER,
    estatus             VARCHAR(30) NOT NULL DEFAULT 'Registrado',
    cotizacion_aprobada BOOLEAN,
    monto_cobro         NUMERIC(10, 2),
    id_cliente          INTEGER NOT NULL,
    id_equipo           INTEGER NOT NULL,
    id_usuario_recep    INTEGER NOT NULL,
    id_usuario_tecnico  INTEGER NOT NULL,

    CONSTRAINT chk_tipo_servicio
        CHECK (tipo_servicio IN ('Revisión', 'Mantenimiento
Preventivo', 'Mantenimiento Correctivo')),

    CONSTRAINT chk_estatus_orden
        CHECK (estatus IN (
            'Registrado',
            'En Revisión / Diagnóstico',
            'Solución y Cotización',
            'Proceso Técnico',
            'Listo para Entrega',
            'Entregado / Cerrado'
        )),

    CONSTRAINT chk_contador_inicio_valido
        CHECK (contador_inicio >= 0),

    CONSTRAINT chk_contador_final_valido
28
        CHECK (contador_final IS NULL OR contador_final >=
contador_inicio),

    CONSTRAINT chk_monto_cobro_valido
        CHECK (monto_cobro IS NULL OR monto_cobro >= 0),

    CONSTRAINT fk_orden_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo (id_equipo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_usuario_recep
        FOREIGN KEY (id_usuario_recep)
        REFERENCES usuario (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_usuario_tecnico
        FOREIGN KEY (id_usuario_tecnico)
        REFERENCES usuario (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE nota_servicio (
    id_nota           SERIAL PRIMARY KEY,
    fecha_inicio      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin         TIMESTAMP,
    diagnostico_falla TEXT,
    trabajo_realizado TEXT,
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
    descripcion_repuesto VARCHAR(100) NOT NULL,
    cantidad             INTEGER NOT NULL DEFAULT 1,
    estado_repuesto      VARCHAR(20) NOT NULL DEFAULT 'Utilizado',
    id_nota              INTEGER NOT NULL,
    CONSTRAINT chk_cantidad_positiva
        CHECK (cantidad > 0),
    CONSTRAINT chk_estado_repuesto
        CHECK (estado_repuesto IN ('Utilizado', 'Pendiente')),
    CONSTRAINT fk_repuesto_nota
        FOREIGN KEY (id_nota)
        REFERENCES nota_servicio (id_nota)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);