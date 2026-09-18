import { Router } from 'express';

// Importación de middlewares globales para este nivel de rutas
import { authenticate } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';

// Importación de todos los sub-routers
import { clientesRouter } from './cliente.js';
import { equiposRouter } from './equipo.js';
import { tecnicosRouter } from './tecnico.js';
import { usuariosRouter } from "./usuario.js";
import { ordenesRouter } from './ordenes.js';
import { serviciosRouter } from "./servicio.js";
import { repuestosRouter } from "./repuesto.js";
import { authRouter } from './auth.js';
import { reportesRouter } from './reportes.js';
import { backupRouter } from './backup.js';
import { auditoriaRouter } from './auditoria.js';
import { TecnicoController } from '../controllers/tecnico.js';

const apiRouter = Router();

// --- 1. RUTAS PÚBLICAS Y DE AUTENTICACIÓN ---
apiRouter.use('/auth', authRouter);

// Endpoint público para la vista técnica comunitaria
apiRouter.get('/tecnicos/publicos', TecnicoController.getPublicos);

// --- 2. RUTAS PROTEGIDAS (Gestión exclusiva de Admin / Recepción) ---
apiRouter.use('/clientes', authenticate, requireRole(['ADMIN_RECEPCION']), clientesRouter)
     .use('/tecnicos', authenticate, requireRole(['ADMIN_RECEPCION']), tecnicosRouter)
     .use('/usuarios', authenticate, requireRole(['ADMIN_RECEPCION']), usuariosRouter)
     .use('/reportes', authenticate, requireRole(['ADMIN_RECEPCION']), reportesRouter)
     .use('/backup', authenticate, requireRole(['ADMIN_RECEPCION']), backupRouter)
     .use('/auditoria', authenticate, requireRole(['ADMIN_RECEPCION']), auditoriaRouter);

// --- 3. VISTA TÉCNICA (Lectura y escritura abiertas - Opción A) ---
apiRouter.use('/equipos', equiposRouter)
     .use('/ordenes', ordenesRouter)
     .use('/servicios', serviciosRouter)
     .use('/repuestos', repuestosRouter);

export { apiRouter };