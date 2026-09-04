import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { tecnicoSchema } from "../schemas/tecnicoSchema.js";

export const tecnicosRouter = Router()

tecnicosRouter.route("/")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .post(validate(tecnicoSchema));

tecnicosRouter.route("/:id")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .put(validate(tecnicoSchema))
     .patch(validatePartial(tecnicoSchema))
     .delete((req, res) => res.status(200).json({"status": "ta'bien"}));

tecnicosRouter.get("/:id/ordenes", ((req, res) => res.status(200).json({"status": "ta'bien"})));