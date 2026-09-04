import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { ordenSchema } from "../schemas/ordenSchema.js";
import { estadosRouter } from "./estados.js";

export const ordenesRouter = Router()

// ordenesRouter.use("/estados", estadosRouter) //   RUTAS DE LOS ESTADOS

ordenesRouter.route("/")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .post(validate(ordenSchema));

ordenesRouter.route("/:id")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .put(validate(ordenSchema))
     .patch(validatePartial(ordenSchema))
     .delete((req, res) => res.status(200).json({"status": "ta'bien"}));