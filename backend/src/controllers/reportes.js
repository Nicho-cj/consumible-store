import { query } from "../config/db.js";

// @REVISAR: controller de reportes - RF-12: reporte de servicios por tecnico en rango de fechas
export class ReportesController {
    // GET /reportes/servicios?tecnico_id=X&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
    static async serviciosPorTecnico(req, res) {
        const { tecnico_id, desde, hasta } = req.query;

        let consulta = `
            SELECT o.id_orden, o.codigo_orden, o.fecha_ingreso, o.fecha_salida,
                   o.monto_cobro, o.tipo_servicio, o.falla_reportada, o.cotizacion_aprobada,
                   t.id_tecnico, t.nombre AS tecnico_nombre,
                   n.diagnostico_falla, n.trabajo_realizado, n.contador_final,
                   c.nombre_completo AS cliente_nombre,
                   e.nro_serial, e.marca, e.modelo
            FROM orden_servicio o
            LEFT JOIN tecnico t ON o.id_tecnico = t.id_tecnico
            LEFT JOIN nota_servicio n ON o.id_orden = n.id_orden
            LEFT JOIN cliente c ON o.id_cliente = c.id_cliente
            LEFT JOIN equipo e ON o.id_equipo = e.id_equipo
            WHERE o.fecha_salida IS NOT NULL
        `;
        const values = [];

        if (tecnico_id) {
            values.push(tecnico_id);
            consulta += ` AND o.id_tecnico = $${values.length}`;
        }

        if (desde) {
            values.push(desde);
            consulta += ` AND o.fecha_salida >= $${values.length}`;
        }

        if (hasta) {
            values.push(hasta);
            consulta += ` AND o.fecha_salida <= $${values.length}`;
        }

        consulta += ` ORDER BY t.nombre, o.fecha_salida`;

        const result = await query(consulta, values);
        res.status(200).json(result.rows);
    }

    // GET /reportes/liquidacion?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
    static async liquidacionPorTecnico(req, res) {
        const { desde, hasta } = req.query;

        let consulta = `
            SELECT t.id_tecnico, t.nombre AS tecnico_nombre,
                   COUNT(o.id_orden) FILTER (WHERE o.fecha_salida IS NOT NULL AND o.cotizacion_aprobada = TRUE) AS total_servicios,
                   COALESCE(SUM(o.monto_cobro) FILTER (WHERE o.fecha_salida IS NOT NULL AND o.cotizacion_aprobada = TRUE), 0) AS total_monto
            FROM tecnico t
            LEFT JOIN orden_servicio o ON o.id_tecnico = t.id_tecnico
               AND o.fecha_salida IS NOT NULL
               AND o.cotizacion_aprobada = TRUE
        `;
        const values = [];
        const conditions = [];

        if (desde) {
            conditions.push(`o.fecha_salida >= $${values.length + 1}`);
            values.push(desde);
        }
        if (hasta) {
            conditions.push(`o.fecha_salida <= $${values.length + 1}`);
            values.push(hasta);
        }

        if (conditions.length > 0) {
            consulta += ` WHERE ${conditions.join(' AND ')}`;
        }

        consulta += ` GROUP BY t.id_tecnico, t.nombre ORDER BY t.nombre`;

        const result = await query(consulta, values);
        res.status(200).json(result.rows);
    }
}
