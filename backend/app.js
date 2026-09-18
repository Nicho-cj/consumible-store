import express, { json } from 'express'
import { corsMiddleware } from './src/middlewares/cors.js'
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { apiRouter } from './src/routes/index.js'; // Tu router centralizado que incluye el /api

const app = express()

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

// Montamos todas las rutas de la API bajo el prefijo /api
app.use('/api', apiRouter)

// Ruta 404 global
app.use((req, res) => {
  res.status(404).json({ "status": "error", "message": "Endpoint inexistente" })
})

// Manejo de errores
app.use(errorHandler)

export { app }