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
import { ordenesRouter } from './src/routes/ordenServicio.js'
import { usuariosRouter } from "./src/routes/usuario.js";

//  ENDPOINTS
app.use('/clientes', clientesRouter)
app.use('/equipos', equiposRouter)
app.use('/tecnicos', tecnicosRouter)
app.use('/ordenes', ordenesRouter)
app.use('/usuarios', usuariosRouter)

//  MANEJO DE ERRORES
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Backend funcionando ( http://localhost:${PORT} )`)
})