import { query } from "../config/db.js";

export class UsuarioModel {
    static async getAll() {
        const result = await query('SELECT * FROM usuario');
        return result.rows;
    }

    static async getById(id_usuario) {
        const result = await query('SELECT * FROM usuario WHERE id_usuario = $1', [id_usuario]);
        return result.rows[0];
    }

    static async create(data) {
        const { nombre, activo } = data;
        const result = await query(
            `INSERT INTO usuario (nombre, activo) VALUES ($1, $2) RETURNING *`,
            [nombre, activo ?? true]
        );
        return result.rows[0];
    }

    static async update(id_usuario, data) {
        const { nombre, activo } = data;
        const result = await query(
            `UPDATE usuario SET nombre = $1, activo = $2 WHERE id_usuario = $3 RETURNING *`,
            [nombre, activo, id_usuario]
        );
        return result.rows[0];
    }

    static async patch(id_usuario, data) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(data)) {
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
        const result = await query('SELECT * FROM orden_servicio WHERE id_usuario_recep = $1', [id_usuario]);
        return result.rows;
    }
}