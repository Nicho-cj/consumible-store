import express, { json } from 'express'
import { corsMiddleware } from './src/middlewares/cors.js'
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { authenticate } from './src/middlewares/auth.js';
import { requireRole } from './src/middlewares/role.js';

const PORT = process.env.BACK_PORT
const HOST = process.env.FRONT_HOST

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware(HOST))

// ENRUTADORES
import { clientesRouter } from './src/routes/cliente.js'
import { equiposRouter } from './src/routes/equipo.js'
import { tecnicosRouter } from './src/routes/tecnico.js'
import { usuariosRouter } from "./src/routes/usuario.js";
import { ordenesRouter } from './src/routes/ordenes.js'
import { serviciosRouter } from "./src/routes/servicio.js";
import { repuestosRouter } from "./src/routes/repuesto.js";
import { authRouter } from './src/routes/auth.js';
import { reportesRouter } from './src/routes/reportes.js';
import { backupRouter } from './src/routes/backup.js';

// @REVISAR: Politica de acceso - Lectura publica / Escritura admin.
// La vista tecnica comunitaria (sin login) necesita LEER ordenes, equipos, servicios y repuestos.
// Por eso los GET de esas rutas quedan PUBLICOS.
// Las operaciones de ESCRITURA (POST/PUT/PATCH/DELETE) de esas rutas y toda la gestion requieren
// autenticacion de admin (ADMIN_RECEPCION).

// Solo lectura publica para la vista tecnica
const soloLectura = (rolAdmin, req, res, next) => {
    // Si es GET -> acceso libre (vista comunitaria)
    if (req.method === 'GET' || req.method === 'OPTIONS') return next();
    // Si es escritura -> requiere admin autenticado
    return authenticate(req, res, () => requireRole(['ADMIN_RECEPCION'])(req, res, next));
};

// ENDPOINTS
app.use('/auth', authRouter)

// Gestion exclusiva de admin (escritura y lectura completa)
app.use('/clientes', authenticate, requireRole(['ADMIN_RECEPCION']), clientesRouter)
app.use('/tecnicos', authenticate, requireRole(['ADMIN_RECEPCION']), tecnicosRouter)
app.use('/usuarios', authenticate, requireRole(['ADMIN_RECEPCION']), usuariosRouter)
app.use('/reportes', authenticate, requireRole(['ADMIN_RECEPCION']), reportesRouter)
app.use('/backup', authenticate, requireRole(['ADMIN_RECEPCION']), backupRouter)

// Rutas de la vista tecnica comunitaria (lectura publica, escritura admin)
app.use('/equipos', soloLectura, equiposRouter)
app.use('/ordenes', soloLectura, ordenesRouter)
app.use('/servicios', soloLectura, serviciosRouter)
app.use('/repuestos', soloLectura, repuestosRouter)

// MENSAJE POR DEFECTO
app.use((req, res) => { res.status(404).json({
  "status":"error",
  "message":"Endpoint inexistente"
}) })

// MANEJO DE ERRORES
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Backend funcionando ( http://localhost:${PORT} )`)
})
