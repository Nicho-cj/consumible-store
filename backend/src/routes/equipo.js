import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { equipoSchema } from "../schemas/equipoSchema.js";

export const equiposRouter = Router()

equiposRouter.route("/")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .post(validate(equipoSchema));

equiposRouter.route("/:serial")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .put(validate(equipoSchema))
     .patch(validatePartial(equipoSchema))
     .delete((req, res) => res.status(200).json({"status": "ta'bien"}));

equiposRouter.get("/:serial/clientes", (req, res) => res.status(200).json({"status": "ta'bien"}));

equiposRouter.get("/:serial/ordenes", (req, res) => res.status(200).json({"status": "ta'bien"}));

