import { AuditoriaModel } from "../models/auditoria.js";

export class AuditoriaController {
    // GET /auditoria - historial de movimientos (solo ADMIN_RECEPCION)
    static async getAll(req, res) {
        const rows = await AuditoriaModel.getAll();
        res.status(200).json(rows);
    }
}