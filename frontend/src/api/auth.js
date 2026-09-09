// FASE 4 - sesion y login (antes estaba embebido en App.jsx)

import { apiFetch, getToken } from './client';

export async function loginAdmin({ usuario, password }) {
    const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { nombre: usuario, contrasena: password },
    });

    // Sesion por PESTANA (sessionStorage): cada pestaña/ventana es independiente,
    // permitiendo varias vistas en simultaneo (varios admins + vista tecnica comunitaria).
    sessionStorage.setItem('cs_rol', data.usuario.rol);
    sessionStorage.setItem('cs_usuario', JSON.stringify(data.usuario));
    sessionStorage.setItem('cs_token', data.token);

    return data;
}

export function getCurrentUser() {
    const saved = sessionStorage.getItem('cs_usuario');
    return saved ? JSON.parse(saved) : null;
}

export function getCurrentRole() {
    return sessionStorage.getItem('cs_rol') || null;
}

export function hasToken() {
    return Boolean(getToken());
}

export function clearSession() {
    sessionStorage.removeItem('cs_rol');
    sessionStorage.removeItem('cs_usuario');
    sessionStorage.removeItem('cs_token');
}

// Acceso tecnico comunitario: sin credenciales
export function accessTechnician() {
    sessionStorage.setItem('cs_rol', 'TECNICO');
    sessionStorage.removeItem('cs_usuario');
    sessionStorage.removeItem('cs_token');
}