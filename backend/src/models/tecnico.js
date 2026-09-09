import { query } from "../config/db.js";
import { SELECT_CAMPOS, FROM_BASE } from "./ordenQueryBase.js";

export class TecnicoModel {
    static async getAll() {
        const result = await query('SELECT * FROM tecnico ORDER BY id_tecnico DESC');
        return result.rows;
    }

    // @REVISAR: FASE 3 - lista publica (vista tecnica comunitaria, sin login).
    // Solo expone id_tecnico y nombre de tecnicos ACTIVOS para el selector.
    static async getPublicos() {
        const result = await query(
            'SELECT id_tecnico, nombre FROM tecnico WHERE activo = TRUE ORDER BY nombre'
        );
        return result.rows;
    }

    static async getById(id_tecnico) {
        const result = await query('SELECT * FROM tecnico WHERE id_tecnico = $1', [id_tecnico]);
        return result.rows[0];
    }

    static async create(data) {
        const { nombre, activo } = data;
        const result = await query(
            `INSERT INTO tecnico (nombre, activo) VALUES ($1, $2) RETURNING *`,
            [nombre, activo ?? true]
        );
        return result.rows[0];
    }

    static async update(id_tecnico, data) {
        const { nombre, activo } = data;
        const result = await query(
            `UPDATE tecnico SET nombre = $1, activo = $2 WHERE id_tecnico = $3 RETURNING *`,
            [nombre, activo, id_tecnico]
        );
        return result.rows[0];
    }

    static async patch(id_tecnico, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // @REVISAR: whitelist de columnas permitidas para UPDATE (evita inyeccion SQL por nombre de columna)
        const allowed = ['nombre', 'activo'];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            // @REVISAR: no aplicar valores undefined (Zod emite undefined en campos nullish no enviados)
            if (value === undefined) continue;
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_tecnico);
        const result = await query(
            `UPDATE tecnico SET ${fields.join(', ')} WHERE id_tecnico = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_tecnico) {
        const result = await query('DELETE FROM tecnico WHERE id_tecnico = $1 RETURNING *', [id_tecnico]);
        return result.rows[0];
    }

    static async getOrdenes(id_tecnico) {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.id_tecnico = $1 ORDER BY o.id_orden DESC`, [id_tecnico]);
        return result.rows;
    }
}
