import { Router } from "express";
import { ordenSchema } from "../schemas/ordenSchema.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { OrdenController } from "../controllers/ordenes.js";

export const ordenesRouter = Router()

ordenesRouter.route("/")
     .get(OrdenController.getAll)
     .post(validate(ordenSchema), OrdenController.create);

ordenesRouter.route("/:id")
     .get(OrdenController.getById)
     .put(validate(ordenSchema), OrdenController.update)
     .patch(validatePartial(ordenSchema), OrdenController.patch)
     .delete(OrdenController, OrdenController.delete);

ordenesRouter.get("/:id/:entidad", OrdenController.getEntidad)
