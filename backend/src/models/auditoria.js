import { query } from "../config/db.js";

// @REVISAR: modelo de auditoria - log_auditoria con JOIN a usuario (nombre del actor)
export class AuditoriaModel {
    static async getAll(limit = 300) {
        const result = await query(
            `SELECT l.id_log, l.fecha, l.id_usuario, l.rol, l.modulo, l.accion, l.detalles,
                    u.nombre AS usuario_nombre
             FROM log_auditoria l
             LEFT JOIN usuario u ON l.id_usuario = u.id_usuario
             ORDER BY l.id_log DESC
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    }
}