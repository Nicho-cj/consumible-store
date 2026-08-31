import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { tecnicoSchema } from "../schemas/tecnicoSchema.js";

export const tecnicosRouter = Router()

tecnicosRouter.get("/", (req, res) => {
     console.log("TODOS LOS TECNICOS");
});

tecnicosRouter.get("/:id", (req, res) => {
     console.log("TECNICO EN ESPECÍFICO");
});

tecnicosRouter.get("/:id/ordenes", (req, res) => {
     console.log("ORDENES ENLAZADOS A UN TECNICO ESPECÍFICO");
});

tecnicosRouter.post("/", validate(tecnicoSchema) )     // REGISTRA NUEVO TECNICO

tecnicosRouter.put("/:id", validate(tecnicoSchema),)  // MODIFICA TECNICO EN ESPECÍFICO

tecnicosRouter.patch("/:id/estado", validatePartial(tecnicoSchema),)  // MODIFICA TECNICO EN ESPECÍFICO

tecnicosRouter.delete("/:id", (req, res) => {
     console.log("ELIMINA UN TECNICO ESPECÍFICO");
});