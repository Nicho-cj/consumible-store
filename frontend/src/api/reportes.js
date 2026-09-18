// FASE 4 - reportes y backup (FASE 5-3 los usa)

import { apiFetch, API_BASE } from './client';

// GET /reportes/servicios?tecnico_id=X&desde=YYYY-MM-DD&hasta=YYYY-MM-DD (RF-12)
export async function reporteServicios({ tecnicoId, desde, hasta } = {}) {
    const params = new URLSearchParams();
    if (tecnicoId) params.set('tecnico_id', tecnicoId);
    if (desde) params.set('desde', desde);
    if (hasta) params.set('hasta', hasta);
    const qs = params.toString();
    const data = await apiFetch(`/reportes/servicios${qs ? `?${qs}` : ''}`, { auth: true });
    return Array.isArray(data) ? data : [];
}

// GET /auditoria -> bitacora real de eventos del sistema (FASE 8, admin)
export async function listAuditoria() {
    const data = await apiFetch('/auditoria', { auth: true });
    return Array.isArray(data) ? data : [];
}

// GET /backup -> dump SQL de la BD (RNF-06)
export async function descargarBackup() {
    const resp = await fetch(`${API_BASE}/backup`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('cs_token') || ''}`,
        },
    });
    const text = await resp.text();
    if (!resp.ok) throw new Error(text || 'Error generando backup');
    return text;
}