import { query } from "../config/db.js";

// Select con nombre del catalogo (JOIN repuesto) para no exponer solo ids.
const SELECT_CON_NOMBRE = `
    SELECT dr.id_detalle, dr.id_repuesto, dr.id_orden, r.nombre
    FROM detalle_repuesto dr
    JOIN repuesto r ON r.id_repuesto = dr.id_repuesto
`;

export class DetalleRepuestoModel {
    static async getAll() {
        const result = await query(`${SELECT_CON_NOMBRE} ORDER BY dr.id_detalle DESC`);
        return result.rows;
    }

    static async getById(id_detalle) {
        const result = await query(`${SELECT_CON_NOMBRE} WHERE dr.id_detalle = $1`, [id_detalle]);
        return result.rows[0];
    }

    static async create(data) {
        const { id_repuesto, id_orden } = data;
        const result = await query(
            `INSERT INTO detalle_repuesto (id_repuesto, id_orden)
             VALUES ($1, $2)
             ON CONFLICT (id_repuesto, id_orden) DO NOTHING
             RETURNING id_detalle`,
            [id_repuesto, id_orden]
        );
        if (result.rows[0]) {
            return this.getById(result.rows[0].id_detalle);
        }
        const existing = await query(
            'SELECT id_detalle FROM detalle_repuesto WHERE id_repuesto = $1 AND id_orden = $2',
            [id_repuesto, id_orden]
        );
        return this.getById(existing.rows[0].id_detalle);
    }

    static async update(id_detalle, data) {
        const { id_repuesto, id_orden } = data;
        await query(
            `UPDATE detalle_repuesto SET id_repuesto = $1, id_orden = $2
             WHERE id_detalle = $3`,
            [id_repuesto, id_orden, id_detalle]
        );
        return this.getById(id_detalle);
    }

    static async patch(id_detalle, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // Allowlist de columnas permitidas para UPDATE (evita inyeccion SQL por nombre de columna)
        const allowed = ['id_repuesto', 'id_orden'];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            // no aplicar valores undefined (Zod emite undefined en campos nullish no enviados)
            if (value === undefined) continue;
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_detalle);
        await query(
            `UPDATE detalle_repuesto SET ${fields.join(', ')} WHERE id_detalle = $${index}`,
            values
        );
        return this.getById(id_detalle);
    }

    static async delete(id_detalle) {
        const result = await query('DELETE FROM detalle_repuesto WHERE id_detalle = $1 RETURNING *', [id_detalle]);
        return result.rows[0];
    }

    static async getByOrden(id_orden) {
        const result = await query(`${SELECT_CON_NOMBRE} WHERE dr.id_orden = $1`, [id_orden]);
        return result.rows;
    }

    static async getByCliente(id_cliente) {
        const result = await query(
            `${SELECT_CON_NOMBRE}
             JOIN orden_servicio o ON dr.id_orden = o.id_orden
             WHERE o.id_cliente = $1`,
            [id_cliente]
        );
        return result.rows;
    }

    static async getByEquipo(id_equipo) {
        const result = await query(
            `${SELECT_CON_NOMBRE}
             JOIN orden_servicio o ON dr.id_orden = o.id_orden
             WHERE o.id_equipo = $1`,
            [id_equipo]
        );
        return result.rows;
    }
}