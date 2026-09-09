import { query } from "../config/db.js";
import { SELECT_CAMPOS, FROM_BASE } from "./ordenQueryBase.js";

export class EquipoModel {
    // @REVISAR: whitelist de columnas permitidas para filtros (evita inyeccion SQL por nombre de columna)
    static #ALLOWED_FILTERS = ['nro_serial', 'marca', 'modelo'];

    static async getAll(filters = {}) {
        let consulta = `SELECT e.*, c.nombre_completo AS cliente_nombre
                        FROM equipo e
                        LEFT JOIN cliente c ON c.id_cliente = e.id_cliente`
        const values = []
        const conditions = [];

        const filterKeys = Object.keys(filters)
            // @REVISAR: solo se permiten columnas conocidas. Antes cualquier key se interpolaba en el SQL (inyeccion SQL)
            .filter((key) => EquipoModel.#ALLOWED_FILTERS.includes(key));

        if (filterKeys.length > 0) {
            filterKeys.forEach((key, index) => {
                values.push(`%${filters[key]}%`);
                conditions.push(`e.${key} ILIKE $${index + 1}`);
            });
            consulta += ` WHERE ${conditions.join(' AND ')}`;
        }
        consulta += ' ORDER BY e.id_equipo DESC';

        const result = await query(consulta, values);
        return result.rows;
    }

    // @REVISAR: nuevo metodo - resuelve la busqueda por numero serial (clave de negocio)
    static async getBySerial(nro_serial) {
        const result = await query(
            `SELECT e.*, c.nombre_completo AS cliente_nombre, COALESCE(
                json_agg(distinct o) FILTER (WHERE o.id_orden IS NOT NULL),
                '[]'
             ) AS ordenes
             FROM equipo e
             LEFT JOIN cliente c ON c.id_cliente = e.id_cliente
             LEFT JOIN orden_servicio o ON o.id_equipo = e.id_equipo
             WHERE e.nro_serial = $1
             GROUP BY e.id_equipo, c.nombre_completo`,
            [nro_serial]
        );
        return result.rows[0];
    }

    static async getById(id_equipo) {
        const result = await query(
            `SELECT e.*, c.nombre_completo AS cliente_nombre
             FROM equipo e
             LEFT JOIN cliente c ON c.id_cliente = e.id_cliente
             WHERE e.id_equipo = $1`,
            [id_equipo]
        );
        return result.rows[0];
    }

    static async create(data) {
        const { nro_serial, marca, modelo, descripcion, tipo_equipo, id_cliente, contador_bn, contador_color } = data;
        const result = await query(
            `INSERT INTO equipo (nro_serial, marca, modelo, descripcion, tipo_equipo, id_cliente, contador_bn, contador_color)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nro_serial, marca, modelo, descripcion, tipo_equipo, id_cliente ?? null, contador_bn, contador_color]
        );
        return result.rows[0];
    }

    static async update(id_equipo, data) {
        const { nro_serial, marca, modelo, descripcion, tipo_equipo, id_cliente, contador_bn, contador_color } = data;
        const result = await query(
            `UPDATE equipo SET nro_serial = $1, marca = $2, modelo = $3, descripcion = $4,
                tipo_equipo = $5, id_cliente = $6, contador_bn = $7, contador_color = $8
             WHERE id_equipo = $9 RETURNING *`,
            [nro_serial, marca, modelo, descripcion, tipo_equipo, id_cliente ?? null, contador_bn, contador_color, id_equipo]
        );
        return result.rows[0];
    }

    static async patch(id_equipo, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // @REVISAR: whitelist de columnas permitidas para UPDATE (evita inyeccion SQL por nombre de columna)
        const allowed = ['nro_serial', 'marca', 'modelo', 'descripcion', 'tipo_equipo', 'id_cliente', 'contador_bn', 'contador_color'];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            // @REVISAR: no aplicar valores undefined (Zod emite undefined en campos nullish no enviados)
            if (value === undefined) continue;
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
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.id_equipo = $1`, [id_equipo]);
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