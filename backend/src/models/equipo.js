import { query } from "../config/db.js";

export class EquipoModel {
    // @REVISAR: whitelist de columnas permitidas para filtros (evita inyeccion SQL por nombre de columna)
    static #ALLOWED_FILTERS = ['nro_serial', 'marca', 'modelo'];

    static async getAll(filters = {}) {
        let consulta = 'SELECT * FROM equipo'
        const values = []
        const conditions = [];

        const filterKeys = Object.keys(filters)
            // @REVISAR: solo se permiten columnas conocidas. Antes cualquier key se interpolaba en el SQL (inyeccion SQL)
            .filter((key) => EquipoModel.#ALLOWED_FILTERS.includes(key));

        if (filterKeys.length > 0) {
            filterKeys.forEach((key, index) => {
                values.push(`%${filters[key]}%`);
                conditions.push(`${key} ILIKE $${index + 1}`);
            });
            consulta += ` WHERE ${conditions.join(' AND ')}`;
        }
        consulta += ' ORDER BY id_equipo DESC';

        const result = await query(consulta, values);
        return result.rows;
    }

    // @REVISAR: nuevo metodo - resuelve la busqueda por numero serial (clave de negocio)
    static async getBySerial(nro_serial) {
        const result = await query(
            `SELECT e.*, COALESCE(
                json_agg(distinct o) FILTER (WHERE o.id_orden IS NOT NULL),
                '[]'
             ) AS ordenes
             FROM equipo e
             LEFT JOIN orden_servicio o ON o.id_equipo = e.id_equipo
             WHERE e.nro_serial = $1
             GROUP BY e.id_equipo`,
            [nro_serial]
        );
        return result.rows[0];
    }

    static async getById(id_equipo) {
        const result = await query('SELECT * FROM equipo WHERE id_equipo = $1', [id_equipo]);
        return result.rows[0];
    }

    static async create(data) {
        const { nro_serial, marca, modelo, descripcion } = data;
        const result = await query(
            `INSERT INTO equipo (nro_serial, marca, modelo, descripcion)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nro_serial, marca, modelo, descripcion]
        );
        return result.rows[0];
    }

    static async update(id_equipo, data) {
        const { nro_serial, marca, modelo, descripcion } = data;
        const result = await query(
            `UPDATE equipo SET nro_serial = $1, marca = $2, modelo = $3, descripcion = $4
             WHERE id_equipo = $5 RETURNING *`,
            [nro_serial, marca, modelo, descripcion, id_equipo]
        );
        return result.rows[0];
    }

    static async patch(id_equipo, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // @REVISAR: whitelist de columnas permitidas para UPDATE (evita inyeccion SQL por nombre de columna)
        const allowed = ['nro_serial', 'marca', 'modelo', 'descripcion'];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_equipo);
        const result = await query(
            `UPDATE equipo SET ${fields.join(', ')} WHERE id_equipo = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_equipo) {
        const result = await query('DELETE FROM equipo WHERE id_equipo = $1 RETURNING *', [id_equipo]);
        return result.rows[0];
    }

    static async getOrdenes(id_equipo) {
        const result = await query('SELECT * FROM orden_servicio WHERE id_equipo = $1', [id_equipo]);
        return result.rows;
    }

    static async getClientes(id_equipo) {
        const result = await query(
            `SELECT DISTINCT c.* FROM cliente c
             JOIN orden_servicio o ON c.id_cliente = o.id_cliente
             WHERE o.id_equipo = $1`,
            [id_equipo]
        );
        return result.rows;
    }
}