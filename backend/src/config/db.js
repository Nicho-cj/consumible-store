import { Pool } from "pg";

// @REVISAR: se agrego parseInt al DB_PORT (antes pasaba un string) y manejo de error del pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10)
});

// @REVISAR: manejo de errores en conexiones ociosas para evitar que el proceso Node muera
// sin un mensaje util cuando la BD se desconecta.
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

export const query = (text, params) => pool.query(text, params);
