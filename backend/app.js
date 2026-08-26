import express, { json } from 'express'
import { clientesRouter } from './src/routes/cliente.js'
import { corsMiddleware } from './src/middlewares/cors.js'
import 'dotenv/config'

const PORT = process.env.BACK_PORT
const HOST = process.env.FRONT_HOST

const app = express()
app.use(json())
app.use(corsMiddleware(HOST))
app.disable('x-powered-by')

app.use('/clientes', clientesRouter)

app.listen(PORT, () => {
  console.log(`Backend funcionando en la ruta http://localhost:${PORT}`)
})