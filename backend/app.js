import express, { json } from 'express'
import { clientesRouter } from './src/routes/cliente.js'
import { corsMiddleware } from './src/middlewares/cors.js'
import 'dotenv/config'

const PORT = process.env.BACK_PORT
const HOST = process.env.FRONT_HOST

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware(HOST))

//  ENDPOINTS
app.use('/ordenes', clientesRouter)
app.use('/equipos', clientesRouter)
app.use('/clientes', clientesRouter)
app.use('/tecnicos', clientesRouter)


//  Valor por defecto
app.use( (req, res)=>{
  res.status(400).json({error: 'API inexistente'})
})

app.listen(PORT, () => {
  console.log(`Backend funcionando en la ruta http://localhost:${PORT}`)
})