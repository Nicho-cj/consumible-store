// FASE 9 - tiempo real por WebSockets (WebSocket nativo del navegador, sin dependencias).
// Un solo socket por pestaña (gestor singleton): las paginas se suscriben con useOrdenesRealtime
// y al recibir el evento "ordenes:update" recargan en silencio sin tocar loading/filtros.

import { useEffect, useRef } from 'react';
import { getToken } from './client';

// WS relativo al mismo origen (igual que /api): en produccion lo resuelve nginx, en
// dev el proxy del vite.config. VITE_API_BASE solo como override absoluto (p.ej. https://dominio:puerto).
const VITE_API_BASE = import.meta.env.VITE_API_BASE || '';
const OVERRIDE = VITE_API_BASE.length > 0;
const host = OVERRIDE ? VITE_API_BASE.replace(/^https?:\/\//, '') : (typeof window !== 'undefined' ? window.location.host : 'localhost');
const isTls = OVERRIDE ? VITE_API_BASE.startsWith('https:') : (typeof window !== 'undefined' && window.location.protocol === 'https:');
const WS_URL = `${isTls ? 'wss' : 'ws'}://${host}/ws`;

let socket = null;
let tokenAtConnect = null;
let reconnectTimer = null;
let attempts = 0;
const subscribers = new Set();

function connect() {
    if (typeof window === 'undefined' || socket) return;
    const token = getToken();
    tokenAtConnect = token;
    const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

    try {
        socket = new WebSocket(url);
    } catch {
        return;
    }

    socket.onmessage = (evt) => {
        try {
            const data = JSON.parse(evt.data);
            if (data?.type === 'ordenes:update') {
                subscribers.forEach((cb) => {
                    try { cb(); } catch { /* el suscriptor falla sin romper el resto */ }
                });
            }
        } catch { /* mensaje no JSON: ignorar */ }
    };

    socket.onopen = () => {
        attempts = 0;
    };

    socket.onclose = () => {
        socket = null;
        if (subscribers.size === 0) return;
        const delay = Math.min(1000 * 2 ** attempts, 15000);
        attempts += 1;
        reconnectTimer = setTimeout(connect, delay);
    };

    socket.onerror = () => {
        try { socket.close(); } catch { /* ya cerrado */ }
    };
}

// Si el token cambia (login/logout en la misma pestaña), reconectar con el nuevo
function reconnectIfTokenChanged() {
    if (!socket) return connect(); // sin conexion activa, la proxima connect() usara el token fresco
    const token = getToken();
    if (tokenAtConnect !== token) {
        try { socket.close(); } catch { /* ya cerrado */ }
        connect();
    }
}

export function subscribeOrdenes(callback) {
    subscribers.add(callback);
    connect();
    reconnectIfTokenChanged();
    return () => {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
            attempts = 0;
            if (socket) {
                try { socket.close(); } catch { /* ya cerrado */ }
            }
            socket = null;
        }
    };
}

export function useOrdenesRealtime(callback, deps = []) {
    const callbackRef = useRef(callback);

    // Mantener el ref al dia tras cada render (los refs solo se escriben en efectos)
    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        return subscribeOrdenes(() => callbackRef.current());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}