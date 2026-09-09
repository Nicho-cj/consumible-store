import { Router } from "express";
import { ServicioController } from "../controllers/servicio.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { notaServicioSchema } from "../schemas/notaServicioSchema.js";

export const serviciosRouter = Router()

serviciosRouter.route("/")
     .get(ServicioController.getAll)
     .post(validate(notaServicioSchema), ServicioController.create)

// @REVISAR: La ruta /:id/orden debe ir ANTES de /:id para que Express no la tome como /:id
serviciosRouter.get("/:id/orden", ServicioController.getOrden)

serviciosRouter.route("/:id")
     .get(ServicioController.getById)
     .put(validate(notaServicioSchema), ServicioController.update)
     .patch(validatePartial(notaServicioSchema), ServicioController.patch)
     .delete(ServicioController.delete);
