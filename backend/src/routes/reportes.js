import { Router } from "express";
import { ReportesController } from "../controllers/reportes.js";

// @REVISAR: rutas de reportes - RF-12 (servicios por tecnico en rango de fechas) y liquidacion
export const reportesRouter = Router()

// GET /reportes/servicios?tecnico_id=X&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
reportesRouter.get("/servicios", ReportesController.serviciosPorTecnico)

// GET /reportes/liquidacion?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
reportesRouter.get("/liquidacion", ReportesController.liquidacionPorTecnico)
