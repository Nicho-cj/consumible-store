import { Pool } from "pg";
import 'dotenv/config'

const pool = new Pool({
     user: process.env.DB_USER ,
     host: process.env.DB_HOST ,
     database: process.env.DB_NAME ,
     password: process.env.DB_PASSWORD ,
     port: process.env.DB_PORT
});

pool.on('connect' , () => {
     console.log(`Base de datos conectada ( ${process.env.DB_HOST}:${process.env.DB_PORT} )`);
});

// pool.on('error', (err, client) => {
//   console.error('Error inesperado en un cliente inactivo', err);
//   process.exit(-1);
// });

export const query = (text, params) => pool.query(text, params);