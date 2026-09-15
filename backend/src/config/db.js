import { Pool } from "pg";
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

// @REVISAR: cargar env en db.js porque es el primer modulo evaluado (los imports ESM se resuelven antes que el body de app.js).
// .env.local sobreescribe .env (permite config local sin tocar el .env del dev con Docker).
// override: true necesario porque dotenv NO pisa variables ya presentes en process.env
dotenvConfig({ path: resolve('.env') })
dotenvConfig({ path: resolve('.env.local'), override: false })  //  Nicho: para que te funcione ponle true

// @REVISAR: se agrego parseInt al DB_PORT (antes pasaba un string) y manejo de error del pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432
});

// @REVISAR: manejo de errores en conexiones ociosas para evitar que el proceso Node muera
// sin un mensaje util cuando la BD se desconecta.
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

export const query = (text, params) => pool.query(text, params);
