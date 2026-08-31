import express, { json } from 'express'
import 'dotenv/config'

const PORT = process.env.BACK_PORT
const HOST = process.env.FRONT_HOST

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware(HOST))

//  ENRUTADORES
import { corsMiddleware } from './src/middlewares/cors.js'
import { clientesRouter } from './src/routes/cliente.js'
import { equiposRouter } from './src/routes/equipo.js'
import { tecnicosRouter } from './src/routes/tecnico.js'
import { ordenesRouter } from './src/routes/ordenServicio.js'

//  ENDPOINTS
app.use('/clientes', clientesRouter)
app.use('/equipos', equiposRouter)
app.use('/tecnicos', tecnicosRouter)
app.use('/ordenes', ordenesRouter)

//  Valor por defecto
app.use((req, res) => {
  res.status(400).json({error: 'API inexistente'})
})

app.listen(PORT, () => {
  console.log(`Backend funcionando ( http://localhost:${PORT} )`)
})

// import { query } from "./src/config/db.js";

// async function intento() {
//   const { rows } = await query(
// // `CREATE TABLE cliente (
// //     id_cliente          SERIAL PRIMARY KEY,
// //     identificacion      VARCHAR(12) NOT NULL UNIQUE,
// //     nombre              VARCHAR(100),
// //     telefono            VARCHAR(20),
// //     direccion           TEXT
// // );`

//     // `INSERT INTO cliente (identificacion, nombre, telefono, direccion)
//     //  VALUES ($1, $2, $3, $4);`,
//     // ["V-32026655", "Janna Nicholzon", "04120916450", "Puerto Ordaz"]

//     `SELECT * FROM cliente`
//   )
//   console.log(rows);
// }

// intento()