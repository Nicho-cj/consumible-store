// @REVISAR: fragmentos SQL compartidos para consultas de orden_servicio con JOINs.
// Usado por OrdenModel y por queries de historial (tecnico, usuario).
// Devuelve los datos de la orden + cliente + equipo + tecnico + usuario recepcion + nota_servicio.

export const SELECT_CAMPOS = `
    o.*,
    c.nombre_completo AS cliente_nombre,
    c.ci_rif AS cliente_ci_rif,
    c.telefono AS cliente_telefono,
    c.direccion AS cliente_direccion,
    e.nro_serial AS equipo_serial,
    e.marca AS equipo_marca,
    e.modelo AS equipo_modelo,
    e.descripcion AS equipo_descripcion,
    t.nombre AS tecnico_nombre,
    t.activo AS tecnico_activo,
    u.nombre AS recepcion_nombre,
    ns.diagnostico_falla,
    ns.trabajo_realizado,
    ns.contador_final,
    ns.fecha_inicio AS nota_fecha_inicio,
    ns.fecha_fin AS nota_fecha_fin,
    ns.observaciones AS nota_observaciones`;

export const FROM_BASE = `
    FROM orden_servicio o
    LEFT JOIN cliente c ON o.id_cliente = c.id_cliente
    LEFT JOIN equipo e ON o.id_equipo = e.id_equipo
    LEFT JOIN tecnico t ON o.id_tecnico = t.id_tecnico
    LEFT JOIN usuario u ON o.id_usuario_recep = u.id_usuario
    LEFT JOIN nota_servicio ns ON o.id_orden = ns.id_orden`;