import express, { json } from 'express'
import { corsMiddleware } from './src/middlewares/cors.js'
import { errorHandler } from "./src/middlewares/errorHandler.js";
import 'dotenv/config'

const PORT = process.env.BACK_PORT
const HOST = process.env.FRONT_HOST

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware(HOST))

//  ENRUTADORES
import { clientesRouter } from './src/routes/cliente.js'
import { equiposRouter } from './src/routes/equipo.js'
import { tecnicosRouter } from './src/routes/tecnico.js'
import { usuariosRouter } from "./src/routes/usuario.js";
import { ordenesRouter } from './src/routes/ordenes.js'
// import { serviciosRouter } from "./src/routes/servicio.js";
// import { repuestosRouter } from "./src/routes/repuesto.js";

//  ENDPOINTS
app.use('/clientes', clientesRouter)
app.use('/equipos', equiposRouter)
app.use('/tecnicos', tecnicosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/ordenes', ordenesRouter)
// app.use('/servicios', serviciosRouter)
// app.use('/repuestos', repuestosRouter)

//  MENSAJE POR DEFECTO
app.use((req, res) => { res.status(404).json({
  "status":"error",
  "message":"Endpoint inexistente"
}) })

//  MANEJO DE ERRORES
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Backend funcionando ( http://localhost:${PORT} )`)
})