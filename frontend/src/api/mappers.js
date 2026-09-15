// FASE 4 - mapeo snake_case (API) <-> camelCase (paginas/mocks).
// DECISION: la capa api normaliza a camelCase para que las paginas conserven
// sus campos actuales (id, codigo, clienteNombre, equipoSerie, etc.).

import { sanitizeForApi } from '../utils/text';

function toDate(value) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().slice(0, 10);
}

export function normalizeOrden(raw) {
    if (!raw) return null;

    return {
        // identidad
        id: raw.id_orden,
        idOrden: raw.id_orden,
        codigo: raw.codigo_orden,
        codigoOrden: raw.codigo_orden,
        estado: raw.estado,

        // fechas
        fechaIngreso: toDate(raw.fecha_ingreso),
        fechaEntregado: toDate(raw.fecha_salida),
        notaFechaInicio: toDate(raw.nota_fecha_inicio),
        notaFechaFin: toDate(raw.nota_fecha_fin),

        // servicio
        tipoServicio: raw.tipo_servicio,
        fallaReportada: raw.falla_reportada,
        diagnostico: raw.trabajo_realizado || raw.diagnostico_falla || '',
        diagnosticoFalla: raw.diagnostico_falla,
        trabajoRealizado: raw.trabajo_realizado,
        contadorInicial: raw.contador_inicio,
        contadorInicialBN: raw.contador_inicio,
        contadorFinal: raw.contador_final,
        montoCobro: raw.monto_cobro,
        cotizacionAprobada: raw.cotizacion_aprobada,
        numeroFactura: raw.numero_factura,
        motivoCambioTecnico: raw.motivo_cambio_tecnico,
        observaciones: raw.nota_observaciones,
        notaObservaciones: raw.nota_observaciones,

        // id's relacionados
        idCliente: raw.id_cliente,
        idEquipo: raw.id_equipo,
        idUsuarioRecep: raw.id_usuario_recep,
        idTecnico: raw.id_tecnico,

        // cliente plano (OrdenDetalleModal, tablas)
        clienteNombre: raw.cliente_nombre,
        clienteCedulaRif: raw.cliente_ci_rif,
        clienteTelefono: raw.cliente_telefono,
        clienteDireccion: raw.cliente_direccion,
        clienteEmail: '',

        // equipo plano (tablas, TecnicoDiagnosticoModal)
        equipoMarca: raw.equipo_marca,
        equipoModelo: raw.equipo_modelo,
        equipoSerial: raw.equipo_serial,
        equipoSerie: raw.equipo_serial,
        tipoEquipo: raw.equipo_descripcion || raw.equipo_modelo,

        // tecnico
        tecnicoId: raw.id_tecnico,
        tecnicoAsignado: raw.tecnico_nombre,
        tecnicoNombre: raw.tecnico_nombre,
        recepcionNombre: raw.recepcion_nombre,

        // shorthand anidado (OrdenEnvioModal)
        cliente: {
            nombre: raw.cliente_nombre,
            telefono: raw.cliente_telefono,
        },
        equipo: {
            marca: raw.equipo_marca,
            modelo: raw.equipo_modelo,
            serial: raw.equipo_serial,
            falla: raw.falla_reportada,
            observaciones: '',
        },
        tecnico: raw.tecnico_nombre,
        serial: raw.equipo_serial,
        falla: raw.falla_reportada,
        fecha: toDate(raw.fecha_ingreso),
        tipoServicioShort: raw.tipo_servicio,

        repuestosUsados: [],
    };
}

// Payload para POST /ordenes (la API autogenera codigo_orden y fecha_ingreso)
export function denormalizeOrdenPayload(order) {
    const payload = {
        tipo_servicio: sanitizeForApi(order.tipoServicio || 'Revisión y Diagnóstico'),
        falla_reportada: sanitizeForApi(order.fallaReportada || ''),
        contador_inicio: order.contadorInicial || order.contadorInicialBN || 0,
        id_cliente: order.idCliente,
        id_equipo: order.idEquipo,
        id_usuario_recep: order.idUsuarioRecep,
    };
    if (order.idTecnico) payload.id_tecnico = order.idTecnico;
    return payload;
}

// Payload para PATCH /servicios/{id_orden} (nota de servicio)
export function denormalizeNotaPayload(data) {
    return {
        diagnostico_falla: sanitizeForApi(data.diagnosticoFalla ?? data.diagnostico) ?? undefined,
        trabajo_realizado: sanitizeForApi(data.trabajoRealizado ?? data.diagnostico) ?? undefined,
        contador_final: data.contadorFinal ?? undefined,
        observaciones: sanitizeForApi(data.observaciones) ?? undefined,
    };
}

export function normalizeCliente(raw) {
    if (!raw) return null;
    return {
        id: raw.id_cliente,
        nombre: raw.nombre_completo,
        cedulaRif: raw.ci_rif,
        telefono: raw.telefono,
        direccion: raw.direccion,
        email: '',
        estado: 'ACTIVE',
    };
}

export function denormalizeClientePayload(cliente) {
    return {
        ci_rif: cliente.cedulaRif,
        nombre_completo: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
    };
}

export function normalizeEquipo(raw) {
    if (!raw) return null;
    return {
        id: raw.id_equipo,
        serial: raw.nro_serial,
        tipo: raw.tipo_equipo || raw.descripcion || 'Equipo',
        marca: raw.marca,
        modelo: raw.modelo,
        descripcion: raw.descripcion,
        clienteId: raw.id_cliente,
        cliente: raw.cliente_nombre || '',
        contadorBN: raw.contador_bn ?? 0,
        contadorColor: raw.contador_color ?? 0,
    };
}

export function normalizeTecnico(raw) {
    if (!raw) return null;
    return {
        id: raw.id_tecnico,
        nombre: raw.nombre,
        cargo: 'Técnico',
        especialidad: '',
        telefono: '',
        estado: raw.activo === true ? 'ACTIVE' : 'OFF_DUTY',
    };
}

export function normalizeRepuesto(raw) {
    if (!raw) return null;
    return {
        id: raw.id_detalle,
        id_repuesto: raw.id_repuesto,
        nombre: raw.nombre,
    };
}