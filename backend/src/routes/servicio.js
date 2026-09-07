import { Router } from "express";
import { ServicioController } from "../controllers/servicio.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { notaServicioSchema } from "../schemas/notaServicioSchema.js";

export const serviciosRouter = Router()

serviciosRouter.route("/")
     .get(ServicioController.getAll)
     .post(validate(notaServicioSchema), ServicioController.create)

serviciosRouter.route("/:id")
     .get(ServicioController.getById)
     .put(validate(notaServicioSchema), ServicioController.update)
     .patch(validatePartial(notaServicioSchema), ServicioController.patch)
     .delete(ServicioController.delete);

serviciosRouter.get("/:id/orden", ServicioController.getOrden)