import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { ordenSchema } from "../schemas/ordenSchema.js";
import { estadosRouter } from "./estados.js";

export const ordenesRouter = Router()

ordenesRouter.use("/estados", estadosRouter) //   RUTAS DE LOS ESTADOS

ordenesRouter.get("/", (req, res) => {
     console.log("TODAS LAS ORDENES");
});

ordenesRouter.get("/:id", (req, res) => {
     console.log("ORDEN EN ESPECÍFICO");
});


ordenesRouter.post("/", validate(ordenSchema) )     // REGISTRA NUEVO CLIENTE

ordenesRouter.put("/:id", validatePartial(ordenSchema),)  // MODIFICA CLIENTE EN ESPECÍFICO

ordenesRouter.delete("/:id", (req, res) => {
     console.log("ELIMINA UN CLIENTE EN ESPECÍFICO");
});