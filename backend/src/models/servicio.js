import { query } from "../config/db.js";

export class NotaServicioModel {
    static async getAll() {
        const result = await query('SELECT * FROM nota_servicio ORDER BY id_nota DESC');
        return result.rows;
    }

    static async getByOrden(id_orden) {
        const result = await query('SELECT * FROM nota_servicio WHERE id_orden = $1', [id_orden]);
        return result.rows[0];
    }

    static async create(data) {
        const { fecha_fin, diagnostico_falla, trabajo_realizado, contador_final, observaciones, id_orden } = data;
        const result = await query(
            `INSERT INTO nota_servicio (fecha_fin, diagnostico_falla, trabajo_realizado, contador_final, observaciones, id_orden)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [fecha_fin, diagnostico_falla, trabajo_realizado, contador_final, observaciones, id_orden]
        );
        return result.rows[0];
    }

    static async update(id_orden, data) {
        const { fecha_fin, diagnostico_falla, trabajo_realizado, contador_final, observaciones } = data;
        const result = await query(
            `UPDATE nota_servicio SET fecha_fin = $1, diagnostico_falla = $2, trabajo_realizado = $3, contador_final = $4, observaciones = $5
             WHERE id_orden = $6 RETURNING *`,
            [fecha_fin, diagnostico_falla, trabajo_realizado, contador_final, observaciones, id_orden]
        );
        return result.rows[0];
    }

    static async patch(id_orden, data) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_orden);
        const result = await query(
            `UPDATE nota_servicio SET ${fields.join(', ')} WHERE id_orden = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_orden) {
        const result = await query('DELETE FROM nota_servicio WHERE id_orden = $1 RETURNING *', [id_orden]);
        return result.rows[0];
    }

    static async getByCliente(id_cliente) {
        const result = await query(
            `SELECT n.* FROM nota_servicio n
             JOIN orden_servicio o ON n.id_orden = o.id_orden
             WHERE o.id_cliente = $1`,
            [id_cliente]
        );
        return result.rows;
    }

    static async getByEquipo(id_equipo) {
        const result = await query(
            `SELECT n.* FROM nota_servicio n
             JOIN orden_servicio o ON n.id_orden = o.id_orden
             WHERE o.id_equipo = $1`,
            [id_equipo]
        );
        return result.rows;
    }
}