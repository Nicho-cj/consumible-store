// FASE 4 - operaciones de ordenes y nota de servicio contra el backend

import { apiFetch } from './client';
import {
    normalizeOrden,
    denormalizeOrdenPayload,
    denormalizeNotaPayload,
    normalizeRepuesto,
} from './mappers';

// estados soportados por el GET /ordenes?estado= del backend
export const ESTADO_FILTRO = {
    abierto: 'abierto',
    recibido: 'recibido',
    diagnostico: 'diagnostico',
    cotizacion: 'cotizacion',
    reparacion: 'reparacion',
    entregable: 'entregable',
    finalizado: 'finalizado',
    cancelado: 'cancelado',
};

export async function listOrdenes({ estado, tecnicoId } = {}) {
    const params = new URLSearchParams();
    if (estado) params.set('estado', estado);
    if (tecnicoId) params.set('tecnico_id', tecnicoId);
    const qs = params.toString();
    const data = await apiFetch(`/ordenes${qs ? `?${qs}` : ''}`);
    return (Array.isArray(data) ? data : []).map(normalizeOrden);
}

export async function getOrden(id) {
    return normalizeOrden(await apiFetch(`/ordenes/${id}`));
}

export async function createOrden(order) {
    const data = await apiFetch('/ordenes', {
        method: 'POST',
        body: denormalizeOrdenPayload(order),
    });
    return normalizeOrden(data);
}

export async function patchOrden(id, data) {
    return normalizeOrden(await apiFetch(`/ordenes/${id}`, { method: 'PATCH', body: data }));
}

// PATCH /ordenes/:id/cambiar-tecnico { id_tecnico, motivo } -> FASE 11 (reasignar técnico)
export async function cambiarTecnicoOrden(id, idTecnico, motivo) {
    return normalizeOrden(await apiFetch(`/ordenes/${id}/cambiar-tecnico`, {
        method: 'PATCH',
        body: { id_tecnico: idTecnico, motivo },
    }));
}

// PATCH /ordenes/:id/cotizacion { aprobada: true|false } -> RF-07
export async function responderCotizacion(id, aprobada) {
    return normalizeOrden(await apiFetch(`/ordenes/${id}/cotizacion`, {
        method: 'PATCH',
        body: { aprobada },
    }));
}

// PATCH /ordenes/:id/factura { numero_factura } -> RF-10 (solo entregadas)
export async function registrarFactura(id, numero_factura) {
    return normalizeOrden(await apiFetch(`/ordenes/${id}/factura`, {
        method: 'PATCH',
        body: { numero_factura },
    }));
}

// Nota de servicio. El backend identifica la nota por id_orden (UNA nota por orden).
export async function getNota(idOrden) {
    return apiFetch(`/ordenes/${idOrden}/servicio`);
}

export async function patchNota(idOrden, data) {
    return apiFetch(`/servicios/${idOrden}`, {
        method: 'PATCH',
        body: denormalizeNotaPayload(data),
    });
}

// Guarda la nota de servicio. La nota existe cuando la orden tiene tecnico asignado
// (el backend la crea en ese momento). Si por algun motivo no existe (orden sin tecnico),
// la crea con POST /servicios { id_orden, ... }.
export async function saveNota(idOrden, data) {
    try {
        return await patchNota(idOrden, data);
    } catch (err) {
        if (err.status === 404) {
            return apiFetch('/servicios', {
                method: 'POST',
                body: { id_orden: idOrden, ...denormalizeNotaPayload(data) },
            });
        }
        throw err;
    }
}

// Catalogo de repuestos (tabla independiente, solo nombres)
export async function listRepuestosCatalogo() {
    const data = await apiFetch('/repuestos/catalogo');
    return (Array.isArray(data) ? data : []).map((r) => ({ id: r.id_repuesto, nombre: r.nombre }));
}

// Repuestos (detalle_repuesto)
export async function listRepuestos(idOrden) {
    const data = await apiFetch(`/repuestos/orden/${idOrden}`);
    return (Array.isArray(data) ? data : []).map(normalizeRepuesto);
}

export async function crearRepuesto({ idOrden, idRepuesto }) {
    const data = await apiFetch('/repuestos', {
        method: 'POST',
        body: { id_orden: idOrden, id_repuesto: idRepuesto },
    });
    return normalizeRepuesto(data);
}

export async function eliminarRepuesto(idDetalle) {
    return apiFetch(`/repuestos/${idDetalle}`, { method: 'DELETE' });
}

// Sincroniza la lista de repuestos de una orden: crea los nuevos, elimina los removidos
export async function syncRepuestos(idOrden, prev = [], next = []) {
    // remover los que estaban y ya no estan (usan id = id_detalle persisitdo)
    const prevIds = new Set(prev.map((r) => r.id));
    const nextIds = new Set(next.map((r) => r.id).filter((id) => typeof id === 'number'));
    const removidos = [...prevIds].filter((id) => typeof id === 'number' && !nextIds.has(id));
    const creados = next.filter((r) => r.id === undefined || typeof r.id !== 'number');

    for (const id of removidos) {
        try { await eliminarRepuesto(id); } catch { /* best effort */ }
    }
    for (const r of creados) {
        try { await crearRepuesto({ idOrden, idRepuesto: r.id_repuesto }); } catch { /* best effort */ }
    }
}