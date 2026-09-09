import { query } from "../config/db.js";

export class OrdenModel {
    static async getAll() {
        const result = await query('SELECT * FROM orden_servicio ORDER BY id_orden DESC');
        return result.rows;
    }

    // @REVISAR: metodo nuevo - retorna las ordenes de un tecnico, opcionalmente filtradas por estado
    static async getByTecnico(id_tecnico, estado) {
        let consulta = 'SELECT o.* FROM orden_servicio o WHERE o.id_tecnico = $1';
        const values = [id_tecnico];

        if (estado) {
            consulta += ' AND o.estado = $2';
            values.push(estado);
        }

        consulta += ' ORDER BY o.id_orden DESC';

        const result = await query(consulta, values);
        return result.rows;
    }

    static async getById(id_orden) {
        const result = await query('SELECT * FROM orden_servicio WHERE id_orden = $1', [id_orden]);
        // @REVISAR: BUG corregido - retornaba result.rows (array) en vez de result.rows[0] (objeto). El frontend recibía [{...}] en vez de {...}
        return result.rows[0];
    }

    static async create(data) {
        const {
            codigo_orden, tipo_servicio, falla_reportada, contador_inicio,
            cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico
        } = data;
        const result = await query(
            `INSERT INTO orden_servicio
             (codigo_orden, tipo_servicio, falla_reportada, contador_inicio, cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [codigo_orden, tipo_servicio, falla_reportada, contador_inicio, cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico]
        );
        return result.rows[0];
    }

    // @REVISAR: metodo nuevo - crea la nota_servicio vacia vinculada a una orden (al asignar tecnico)
    static async crearNotaServicio(id_orden) {
        const result = await query(
            `INSERT INTO nota_servicio (id_orden) VALUES ($1) RETURNING *`,
            [id_orden]
        );
        return result.rows[0];
    }

    // @REVISAR: metodo nuevo - retorna la nota_servicio de una orden (o null si no existe)
    static async getNotaServicio(id_orden) {
        const result = await query('SELECT * FROM nota_servicio WHERE id_orden = $1', [id_orden]);
        return result.rows[0];
    }

    static async update(id_orden, data) {
        const {
            codigo_orden, fecha_salida, tipo_servicio, falla_reportada, contador_inicio,
            cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico
        } = data;
        const result = await query(
            `UPDATE orden_servicio SET
             codigo_orden = $1, fecha_salida = $2, tipo_servicio = $3, falla_reportada = $4,
             contador_inicio = $5, cotizacion_aprobada = $6, monto_cobro = $7,
             id_cliente = $8, id_equipo = $9, id_usuario_recep = $10, id_tecnico = $11
             WHERE id_orden = $12 RETURNING *`,
            [codigo_orden, fecha_salida, tipo_servicio, falla_reportada, contador_inicio, cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico, id_orden]
        );
        return result.rows[0];
    }

    static async patch(id_orden, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // @REVISAR: whitelist de columnas permitidas para UPDATE (evita inyeccion SQL por nombre de columna)
        const allowed = [
            'estado', 'cotizacion_aprobada', 'monto_cobro', 'contador_inicio',
            'id_tecnico', 'fecha_salida', 'motivo_cambio_tecnico', 'numero_factura',
            'falla_reportada', 'tipo_servicio'
        ];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_orden);
        const result = await query(
            `UPDATE orden_servicio SET ${fields.join(', ')} WHERE id_orden = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_orden) {
        const result = await query('DELETE FROM orden_servicio WHERE id_orden = $1 RETURNING *', [id_orden]);
        return result.rows[0];
    }

    static async getCliente(id_orden) {
        const result = await query('SELECT c.* FROM cliente c JOIN orden_servicio o ON o.id_cliente = c.id_cliente WHERE o.id_orden = $1', [id_orden])
        return result.rows
    }

    static async getEquipo(id_orden) {
        const result = await query('SELECT e.* FROM equipo e JOIN orden_servicio o ON o.id_equipo = e.id_equipo WHERE o.id_orden = $1', [id_orden])
        return result.rows
    }

    static async getUsuario(id_orden) {
        const result = await query('SELECT u.* FROM usuario u JOIN orden_servicio o ON o.id_usuario_recep = u.id_usuario WHERE o.id_orden = $1', [id_orden])
        return result.rows
    }

    static async getTecnico(id_orden) {
        const result = await query('SELECT t.* FROM tecnico t JOIN orden_servicio o ON o.id_tecnico = t.id_tecnico WHERE o.id_orden = $1', [id_orden])
        return result.rows
    }

    static async getServicio(id_orden) {
        const result = await query('SELECT * FROM nota_servicio WHERE id_orden = $1', [id_orden])
        return result.rows
    }

    // @REVISAR: typo corregido - era getRespuestos, ahora getRepuestos
    static async getRepuestos(id_orden) {
        const result = await query('SELECT * FROM detalle_repuesto WHERE id_orden = $1', [id_orden])
        return result.rows
    }

    // ESTADOS

    static async getAbierto() {
        const result = await query('SELECT * FROM orden_servicio WHERE fecha_salida IS NULL');
        return result.rows;
    }

    static async getRecibidos() {
        const result = await query('SELECT * FROM orden_servicio WHERE id_tecnico IS NULL AND fecha_salida IS NULL');
        return result.rows;
    }

    static async getDiagnostico() {
        const result = await query(
            `SELECT o.* FROM orden_servicio o
             LEFT JOIN nota_servicio n ON o.id_orden = n.id_orden
             WHERE o.id_tecnico IS NOT NULL AND (n.diagnostico_falla IS NULL) AND o.fecha_salida IS NULL`
        );
        return result.rows;
    }

    static async getCotizacion() {
        const result = await query(
            `SELECT o.* FROM orden_servicio o
             JOIN nota_servicio n ON o.id_orden = n.id_orden
             WHERE n.diagnostico_falla IS NOT NULL AND o.cotizacion_aprobada IS NULL AND o.fecha_salida IS NULL`
        );
        return result.rows;
    }

    static async getReparacion() {
        const result = await query(
            `SELECT o.* FROM orden_servicio o
             JOIN nota_servicio n ON o.id_orden = n.id_orden
             WHERE o.cotizacion_aprobada = TRUE AND n.fecha_fin IS NULL AND o.fecha_salida IS NULL`
        );
        return result.rows;
    }

    static async getEntregable() {
        const result = await query(
            `SELECT o.* FROM orden_servicio o
             JOIN nota_servicio n ON o.id_orden = n.id_orden
             WHERE n.fecha_fin IS NOT NULL AND o.fecha_salida IS NULL`
        );
        return result.rows;
    }

    static async getFinalizado() {
        const result = await query('SELECT * FROM orden_servicio WHERE fecha_salida IS NOT NULL AND cotizacion_aprobada = TRUE');
        return result.rows;
    }

    static async getCancelado() {
        const result = await query('SELECT * FROM orden_servicio WHERE fecha_salida IS NOT NULL AND cotizacion_aprobada = FALSE');
        return result.rows;
    }
}