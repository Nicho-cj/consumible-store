import { query } from "../config/db.js";

export class ClienteModel {
    static async getAll() {
        const result = await query('SELECT * FROM cliente ORDER BY id_cliente DESC');
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

    // static async #columns() {
    //     const colmuns = await query(
    //         ``
    //     )
    //     return colmuns.rows
    // }

    static async patch(id_cliente, data) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(data)) {
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
        const result = await query('SELECT * FROM orden_servicio WHERE id_cliente = $1', [id_cliente]);
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