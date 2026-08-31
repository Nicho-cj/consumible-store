import { query } from "../config/db.js";

export class DetalleRepuestoModel {
    static async getAll() {
        const result = await query('SELECT * FROM detalle_repuesto ORDER BY id_detalle DESC');
        return result.rows;
    }

    static async getById(id_detalle) {
        const result = await query('SELECT * FROM detalle_repuesto WHERE id_detalle = $1', [id_detalle]);
        return result.rows[0];
    }

    static async create(data) {
        const { nombre, descripcion, cantidad, id_orden } = data;
        const result = await query(
            `INSERT INTO detalle_repuesto (nombre, descripcion, cantidad, id_orden)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, descripcion, cantidad ?? 1, id_orden]
        );
        return result.rows[0];
    }

    static async update(id_detalle, data) {
        const { nombre, descripcion, cantidad, id_orden } = data;
        const result = await query(
            `UPDATE detalle_repuesto SET nombre = $1, descripcion = $2, cantidad = $3, id_orden = $4
             WHERE id_detalle = $5 RETURNING *`,
            [nombre, descripcion, cantidad, id_orden, id_detalle]
        );
        return result.rows[0];
    }

    static async patch(id_detalle, data) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_detalle);
        const result = await query(
            `UPDATE detalle_repuesto SET ${fields.join(', ')} WHERE id_detalle = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_detalle) {
        const result = await query('DELETE FROM detalle_repuesto WHERE id_detalle = $1 RETURNING *', [id_detalle]);
        return result.rows[0];
    }

    static async getByOrden(id_orden) {
        const result = await query('SELECT * FROM detalle_repuesto WHERE id_orden = $1', [id_orden]);
        return result.rows;
    }

    static async getByCliente(id_cliente) {
        const result = await query(
            `SELECT dr.* FROM detalle_repuesto dr
             JOIN orden_servicio o ON dr.id_orden = o.id_orden
             WHERE o.id_cliente = $1`,
            [id_cliente]
        );
        return result.rows;
    }

    static async getByEquipo(id_equipo) {
        const result = await query(
            `SELECT dr.* FROM detalle_repuesto dr
             JOIN orden_servicio o ON dr.id_orden = o.id_orden
             WHERE o.id_equipo = $1`,
            [id_equipo]
        );
        return result.rows;
    }
}