import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middlewares/auth.js';

// Tiempo real: un WebSocket elevado sobre el mismo servidor HTTP del backend.
// - Ruta /ws, mensajes tipo "ordenes:update" para que las vistas recarguen en silencio.
// - El token es OPCIONAL: la vista comunitaria (sin login) lee sin token; si se envia
//   un token invalido se rechaza la conexion con codigo 4001.

let wss = null;

export function setupRealtime(server) {
    wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', (socket, req) => {
        const query = new URL(req.url, 'http://localhost').searchParams;
        const token = query.get('token');
        if (token) {
            try {
                jwt.verify(token, JWT_SECRET);
            } catch {
                socket.close(4001, 'Token inválido');
                return;
            }
        }

        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });
        socket.on('error', () => {});
    });

    // Heartbeat: limpia conexiones muertas
    const interval = setInterval(() => {
        if (!wss) return;
        for (const socket of wss.clients) {
            if (socket.isAlive === false) {
                socket.terminate();
                continue;
            }
            socket.isAlive = false;
            socket.ping();
        }
    }, 30000);

    wss.on('close', () => clearInterval(interval));
    return wss;
}

// Notifica a todos los clientes conectados que las ordenes cambiaron
export function notificarOrdenes() {
    if (!wss) return;
    const msg = JSON.stringify({ type: 'ordenes:update', timestamp: Date.now() });
    for (const socket of wss.clients) {
        if (socket.readyState === 1) socket.send(msg);
    }
}