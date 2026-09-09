import { Router } from "express";
import { AuditoriaController } from "../controllers/auditoria.js";

export const auditoriaRouter = Router();

auditoriaRouter.get("/", AuditoriaController.getAll);