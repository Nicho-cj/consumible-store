import { Router } from "express";
import { BackupController } from "../controllers/backup.js";

// @REVISAR: rutas de backup - RNF-06 (respaldos de la base de datos)
export const backupRouter = Router()

// GET /backup -> descarga el dump SQL de la BD
backupRouter.get("/", BackupController.generar)