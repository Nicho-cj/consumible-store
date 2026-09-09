import { query } from "../config/db.js";
import { SELECT_CAMPOS, FROM_BASE } from "./ordenQueryBase.js";

export class ClienteModel {
    // @REVISAR: whitelist de columnas permitidas para filtros (evita inyeccion SQL por nombre de columna)
    static #ALLOWED_FILTERS = ['ci_rif', 'nombre_completo', 'telefono'];

    static async getAll(filters = {}) {
        let consulta = 'SELECT * FROM cliente'
        const values = []
        const conditions = [];

        // @REVISAR: solo se permiten columnas conocidas. Antes cualquier key se interpolaba en el SQL (inyeccion SQL)
        const filterKeys = Object.keys(filters)
            .filter((key) => ClienteModel.#ALLOWED_FILTERS.includes(key));

        if (filterKeys.length > 0) {
            filterKeys.forEach((key, index) => {
                values.push(`%${filters[key]}%`);
                conditions.push(`${key} ILIKE $${index + 1}`);
            });
            consulta += ` WHERE ${conditions.join(' AND ')}`;
        }
        consulta += ' ORDER BY id_cliente DESC';

        const result = await query(consulta, values);
        return result.rows;
    }

    static async create(data) {
        const { ci_rif, nombre_completo, telefono, direccion } = data;
        const result = await query(
            `INSERT INTO cliente (ci_rif, nombre_completo, telefono, direccion)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [ci_rif, nombre_completo, telefono, direccion]
        );
        return result.rows[0];
    }

    static async getById(id_cliente) {
        const result = await query('SELECT * FROM cliente WHERE id_cliente = $1', [id_cliente]);
        return result.rows[0];
    }

    static async update(id_cliente, data) {
        const { ci_rif, nombre_completo, telefono, direccion } = data;
        const result = await query(
            `UPDATE cliente SET ci_rif = $1, nombre_completo = $2, telefono = $3, direccion = $4
             WHERE id_cliente = $5 RETURNING *`,
            [ci_rif, nombre_completo, telefono, direccion, id_cliente]
        );
        return result.rows[0];
    }

    static async patch(id_cliente, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // @REVISAR: whitelist de columnas permitidas para UPDATE (evita inyeccion SQL por nombre de columna)
        const allowed = ['ci_rif', 'nombre_completo', 'telefono', 'direccion'];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            // @REVISAR: no aplicar valores undefined (Zod emite undefined en campos nullish no enviados)
            if (value === undefined) continue;
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_cliente);
        const result = await query(
            `UPDATE cliente SET ${fields.join(', ')} WHERE id_cliente = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_cliente) {
        const result = await query('DELETE FROM cliente WHERE id_cliente = $1 RETURNING *', [id_cliente]);
        return result.rows[0];
    }

    static async getOrdenes(id_cliente) {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.id_cliente = $1 ORDER BY o.id_orden DESC`, [id_cliente]);
        return result.rows;
    }

    static async getEquipos(id_cliente) {
        const result = await query(
            `SELECT DISTINCT e.* FROM equipo e
             JOIN orden_servicio o ON e.id_equipo = o.id_equipo
             WHERE o.id_cliente = $1`,
            [id_cliente]
        );
        return result.rows;
    }
}
