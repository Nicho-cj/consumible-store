// FASE 4 - cliente HTTP basico hacia el backend.
// API_BASE es relativa al mismo origen (/api) por defecto: en produccion lo resuelve
// nginx (reverse proxy hacia el backend); en dev lo resuelve el proxy del vite.config.
// VITE_API_BASE solo como override absoluto (p.ej. http://servidor:3000).

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export function getToken() {
    return sessionStorage.getItem('cs_token') || null;
}

export function setToken(token) {
    if (token) sessionStorage.setItem('cs_token', token);
    else sessionStorage.removeItem('cs_token');
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const resp = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
        const error = new Error(data?.message || `Error ${resp.status} en ${path}`);
        error.status = resp.status;
        error.data = data;
        throw error;
    }

    return data;
}