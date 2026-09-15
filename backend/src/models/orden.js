import { query } from "../config/db.js";
import { SELECT_CAMPOS, FROM_BASE } from "./ordenQueryBase.js";

export class OrdenModel {
    static async getAll() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    // @REVISAR: metodo nuevo - retorna las ordenes de un tecnico, opcionalmente filtradas por estado
    static async getByTecnico(id_tecnico, estado) {
        let consulta = `SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.id_tecnico = $1`;
        const values = [id_tecnico];

        if (estado) {
            consulta += ` AND o.estado = $2`;
            values.push(estado);
        }

        consulta += ` ORDER BY o.id_orden DESC`;

        const result = await query(consulta, values);
        return result.rows;
    }

    static async getById(id_orden) {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.id_orden = $1`, [id_orden]);
        return result.rows[0];
    }

    static async create(data) {
        let {
            codigo_orden, tipo_servicio, falla_reportada, contador_inicio,
            cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico
        } = data;

        // @REVISAR: FASE 5a - autogenerar codigo_orden si no viene del cliente (evita colisiones con el UNIQUE).
        // Formato: ORD-{YYYY}-{secuencia}. La secuencia se deriva de MAX(id_orden) (SERIAL monotónico),
        // así nunca se reutiliza un número aunque se borre una orden (orden borrada == secuencia perdida).
        if (!codigo_orden) {
            const anio = new Date().getFullYear();
            const result = await query('SELECT COALESCE(MAX(id_orden), 0) AS max_id FROM orden_servicio');
            const nextSeq = Number(result.rows[0].max_id) + 1;
            codigo_orden = `ORD-${anio}-${String(nextSeq).padStart(3, '0')}`;
        }

        const result = await query(
            `INSERT INTO orden_servicio
             (codigo_orden, tipo_servicio, falla_reportada, contador_inicio, cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [codigo_orden, tipo_servicio, falla_reportada, contador_inicio, cotizacion_aprobada, monto_cobro, id_cliente, id_equipo, id_usuario_recep, id_tecnico]
        );

        // @REVISAR: devolver la orden con sus JOINs (cliente/equipo/tecnico) para que
        // el comprobante del frontend tenga serial, cliente y técnico reales.
        return this.getById(result.rows[0].id_orden);
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
            // @REVISAR: no aplicar valores undefined (Zod emite undefined en campos nullish no enviados)
            if (value === undefined) continue;
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
        return result.rows[0] || null;
    }

    static async getEquipo(id_orden) {
        const result = await query('SELECT e.* FROM equipo e JOIN orden_servicio o ON o.id_equipo = e.id_equipo WHERE o.id_orden = $1', [id_orden])
        return result.rows[0] || null;
    }

    static async getUsuario(id_orden) {
        const result = await query('SELECT u.* FROM usuario u JOIN orden_servicio o ON o.id_usuario_recep = u.id_usuario WHERE o.id_orden = $1', [id_orden])
        return result.rows[0] || null;
    }

    static async getTecnico(id_orden) {
        const result = await query('SELECT t.* FROM tecnico t JOIN orden_servicio o ON o.id_tecnico = t.id_tecnico WHERE o.id_orden = $1', [id_orden])
        return result.rows[0] || null;
    }

    static async getServicio(id_orden) {
        const result = await query('SELECT * FROM nota_servicio WHERE id_orden = $1', [id_orden])
        return result.rows[0] || null;
    }

    // @REVISAR: typo corregido - era getRespuestos, ahora getRepuestos
    static async getRepuestos(id_orden) {
        const result = await query(
            `SELECT dr.id_detalle, dr.id_repuesto, dr.id_orden, r.nombre
             FROM detalle_repuesto dr
             JOIN repuesto r ON r.id_repuesto = dr.id_repuesto
             WHERE dr.id_orden = $1`,
            [id_orden]
        )
        return result.rows;
    }

    // ESTADOS
    // @REVISAR: ahora los estados se filtran por la columna explicita `estado`
    // (materializada en 05-add-estado.sql), mas simple y consistente con la state machine.

    static async getAbierto() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado NOT IN ('ENTREGADO', 'CANCELADO') ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getRecibidos() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'REGISTRADO' ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getDiagnostico() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'EN_DIAGNOSTICO' ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getCotizacion() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'SOLUCION_COTIZACION' ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getReparacion() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'PROCESO_TECNICO' ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getEntregable() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'LISTO_ENTREGA' ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getFinalizado() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'ENTREGADO' ORDER BY o.id_orden DESC`);
        return result.rows;
    }

    static async getCancelado() {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.estado = 'CANCELADO' ORDER BY o.id_orden DESC`);
        return result.rows;
    }
}