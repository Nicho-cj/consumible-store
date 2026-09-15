import { query } from "../config/db.js";

export class RepuestoModel {
    static async getAll() {
        const result = await query('SELECT id_repuesto, nombre FROM repuesto ORDER BY nombre ASC');
        return result.rows;
    }

    static async getById(id_repuesto) {
        const result = await query('SELECT id_repuesto, nombre FROM repuesto WHERE id_repuesto = $1', [id_repuesto]);
        return result.rows[0];
    }

    static async findByNombre(nombre) {
        const result = await query('SELECT id_repuesto, nombre FROM repuesto WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }

    // Crea el repuesto del catalogo. Si el nombre ya existe, devuelve el existente.
    static async create(nombre) {
        const result = await query(
            `INSERT INTO repuesto (nombre) VALUES ($1)
             ON CONFLICT (nombre) DO NOTHING
             RETURNING id_repuesto, nombre`,
            [nombre]
        );
        if (result.rows[0]) {
            return { repuesto: result.rows[0], created: true };
        }
        return { repuesto: await this.findByNombre(nombre), created: false };
    }
}