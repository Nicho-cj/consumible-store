import { query } from "../config/db.js";

// @REVISAR: registro de auditoria (RNF-07). Se usa en los controladores tras una
// operacion exitosa. NUNCA debe romper la operacion principal (try/catch silencioso).
// `usuario` opcional permite registrar acciones previas al login (id_usuario null).
export async function registrarAuditoria(req, { modulo, accion, detalles, usuario } = {}) {
    try {
        const actor = usuario || req.user || null;
        const idActor = actor?.id_usuario ?? actor?.id ?? null;
        await query(
            `INSERT INTO log_auditoria (id_usuario, rol, modulo, accion, detalles)
             VALUES ($1, $2, $3, $4, $5)`,
            [idActor, actor?.rol ?? 'SISTEMA', modulo, accion, detalles ?? '']
        );
    } catch (error) {
        console.error('Error registrando auditoría:', error.message);
    }
}