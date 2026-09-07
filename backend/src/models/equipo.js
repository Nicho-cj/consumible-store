import { query } from "../config/db.js";

export class EquipoModel {
    static async getAll(filters = {}) {
        let consulta = 'SELECT * FROM equipo'
        const values = []
        const conditions = [];

        const filterKeys = Object.keys(filters);
        if (filterKeys.length > 0) {
            filterKeys.forEach((key, index) => {
                filters[key] = `%${filters[key]}%`
                values.push(filters[key]);
                conditions.push(`${key} LIKE $${index + 1}`);
            });
            consulta += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await query(consulta, values);
        return result.rows;
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

        for (const [key, value] of Object.entries(data)) {
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