import express, { json } from 'express'
import { corsMiddleware } from './src/middlewares/cors.js'
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { authenticate } from './src/middlewares/auth.js';
import { requireRole } from './src/middlewares/role.js';
import { setupRealtime } from './src/utils/realtime.js';

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
import { auditoriaRouter } from './src/routes/auditoria.js';
import { TecnicoController } from './src/controllers/tecnico.js';

// @REVISAR: Politica de acceso (OPCION A - acceso comunitario siempre activo).
// Lectura PUBLICA y escritura ABIERTA en ordenes/servicios/repuestos/equipos para que la
// vista tecnica comunitaria (sin login) funcione completa (decision del negocio).
// La gestion exclusiva (clientes, tecnicos, usuarios, reportes, backup, auditoria) es
// solo ADMIN_RECEPCION (requiere login con rol admin).
// El login con distincion de roles (RNF-05) personaliza la UI: tecnicos credenciados ven
// solo sus ordenes; el resto usa el modo comunitario.

// ENDPOINTS
app.use('/auth', authRouter)

// @REVISAR: FASE 3 - lista publica de tecnicos para la vista tecnica comunitaria.
// Debe registrarse ANTES de /tecnicos (que exige admin) para que Express la resuelva primero.
app.get('/tecnicos/publicos', TecnicoController.getPublicos)

// Gestion exclusiva de admin (escritura y lectura completa)
app.use('/clientes', authenticate, requireRole(['ADMIN_RECEPCION']), clientesRouter)
app.use('/tecnicos', authenticate, requireRole(['ADMIN_RECEPCION']), tecnicosRouter)
app.use('/usuarios', authenticate, requireRole(['ADMIN_RECEPCION']), usuariosRouter)
app.use('/reportes', authenticate, requireRole(['ADMIN_RECEPCION']), reportesRouter)
app.use('/backup', authenticate, requireRole(['ADMIN_RECEPCION']), backupRouter)
app.use('/auditoria', authenticate, requireRole(['ADMIN_RECEPCION']), auditoriaRouter)

// Vista tecnica: lectura y escritura abiertas (acceso comunitario siempre activo, OPCION A)
app.use('/equipos', equiposRouter)
app.use('/ordenes', ordenesRouter)
app.use('/servicios', serviciosRouter)
app.use('/repuestos', repuestosRouter)

// MENSAJE POR DEFECTO
app.use((req, res) => { res.status(404).json({
  "status":"error",
  "message":"Endpoint inexistente"
}) })

// MANEJO DE ERRORES
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Backend funcionando ( http://localhost:${PORT} )`)
})

// Tiempo real: WS /ws para que las vistas de ordenes se refresquen al instante
setupRealtime(server)
