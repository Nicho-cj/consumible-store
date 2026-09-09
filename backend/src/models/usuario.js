import { query } from "../config/db.js";
import { SELECT_CAMPOS, FROM_BASE } from "./ordenQueryBase.js";

export class UsuarioModel {
    static async getAll() {
        const result = await query('SELECT * FROM usuario ORDER BY id_usuario DESC');
        return result.rows;
    }

    static async getById(id_usuario) {
        const result = await query('SELECT * FROM usuario WHERE id_usuario = $1', [id_usuario]);
        return result.rows[0];
    }

    // @REVISAR: nuevo metodo - busca por nombre para login. Retorna usuario con contrasena hasheada
    static async getByNombre(nombre) {
        const result = await query('SELECT * FROM usuario WHERE nombre = $1 AND activo = TRUE', [nombre]);
        return result.rows[0];
    }

    static async create(data) {
        const { nombre, contrasena, rol, activo } = data;
        const result = await query(
            `INSERT INTO usuario (nombre, contrasena, rol, activo) VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, contrasena, rol, activo ?? true]
        );
        return result.rows[0];
    }

    static async update(id_usuario, data) {
        const { nombre, contrasena, rol, activo } = data;
        const result = await query(
            `UPDATE usuario SET nombre = $1, contrasena = $2, rol = $3, activo = $4 WHERE id_usuario = $5 RETURNING *`,
            [nombre, contrasena, rol, activo, id_usuario]
        );
        return result.rows[0];
    }

    static async patch(id_usuario, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // @REVISAR: whitelist de columnas permitidas para UPDATE. La contrasena se gestiona aparte (bcrypt)
        const allowed = ['nombre', 'activo'];

        for (const [key, value] of Object.entries(data)) {
            if (!allowed.includes(key)) continue;
            // @REVISAR: no aplicar valores undefined (Zod emite undefined en campos nullish no enviados)
            if (value === undefined) continue;
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) return null;

        values.push(id_usuario);
        const result = await query(
            `UPDATE usuario SET ${fields.join(', ')} WHERE id_usuario = $${index} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id_usuario) {
        const result = await query('DELETE FROM usuario WHERE id_usuario = $1 RETURNING *', [id_usuario]);
        return result.rows[0];
    }

    static async getOrdenes(id_usuario) {
        const result = await query(`SELECT ${SELECT_CAMPOS} ${FROM_BASE} WHERE o.id_usuario_recep = $1 ORDER BY o.id_orden DESC`, [id_usuario]);
        return result.rows;
    }
}
