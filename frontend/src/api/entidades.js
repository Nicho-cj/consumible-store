// FASE 4 - clientes, equipos y tecnicos

import { apiFetch } from './client';
import { normalizeCliente, normalizeEquipo, normalizeTecnico, normalizeOrden } from './mappers';
import { sanitizeForApi } from '../utils/text';

// ---- CLIENTES (solo admin) ----
export async function listClientes() {
    const data = await apiFetch('/clientes', { auth: true });
    return (Array.isArray(data) ? data : []).map(normalizeCliente);
}

export async function createCliente(cliente) {
    const data = await apiFetch('/clientes', { method: 'POST', body: {
        ci_rif: sanitizeForApi(cliente.cedulaRif),
        nombre_completo: sanitizeForApi(cliente.nombre),
        telefono: sanitizeForApi(cliente.telefono),
        direccion: sanitizeForApi(cliente.direccion),
    }, auth: true });
    return normalizeCliente(data);
}

export async function getClienteOrdenes(idCliente) {
    const data = await apiFetch(`/clientes/${idCliente}/ordenes`, { auth: true });
    return (Array.isArray(data) ? data : []).map(normalizeOrden);
}

export async function getClienteEquipos(idCliente) {
    const data = await apiFetch(`/clientes/${idCliente}/equipos`, { auth: true });
    return (Array.isArray(data) ? data : []).map(normalizeEquipo);
}

// ---- EQUIPOS (GET publico, escritura admin) ----
export async function listEquipos() {
    const data = await apiFetch('/equipos');
    return (Array.isArray(data) ? data : []).map(normalizeEquipo);
}

export async function getEquipoOrdenes(idEquipo) {
    const data = await apiFetch(`/equipos/${idEquipo}/ordenes`);
    return (Array.isArray(data) ? data : []).map(normalizeOrden);
}

export async function createEquipo(equipo) {
    const data = await apiFetch('/equipos', { method: 'POST', body: {
        nro_serial: sanitizeForApi(equipo.serial),
        marca: sanitizeForApi(equipo.marca),
        modelo: sanitizeForApi(equipo.modelo),
        descripcion: sanitizeForApi(equipo.descripcion),
        tipo_equipo: sanitizeForApi(equipo.tipo),
        id_cliente: equipo.clienteId,
        contador_bn: equipo.contadorBN ?? 0,
        contador_color: equipo.contadorColor ?? 0,
    }, auth: true });
    return normalizeEquipo(data);
}

export async function getEquipoClientes(idEquipo) {
    const data = await apiFetch(`/equipos/${idEquipo}/clientes`);
    return Array.isArray(data) ? data : [];
}

// ---- TECNICOS (GET /tecnicos/publicos publico; gestion admin) ----
export async function listTecnicosPublicos() {
    const data = await apiFetch('/tecnicos/publicos');
    return (Array.isArray(data) ? data : []).map((t) => ({ id: t.id_tecnico, nombre: t.nombre }));
}

export async function listTecnicos() {
    const data = await apiFetch('/tecnicos', { auth: true });
    return (Array.isArray(data) ? data : []).map(normalizeTecnico);
}

export async function createTecnico(tecnico) {
    const data = await apiFetch('/tecnicos', { method: 'POST', body: {
        nombre: sanitizeForApi(tecnico.nombre),
        activo: tecnico.estado === 'ACTIVE',
    }, auth: true });
    return normalizeTecnico(data);
}

// PATCH /tecnicos/:id - permitido (whitelist) activar/desactivar: { activo: boolean }
export async function updateTecnico(id, data) {
    const res = await apiFetch(`/tecnicos/${id}`, { method: 'PATCH', body: data, auth: true });
    return normalizeTecnico(res);
}