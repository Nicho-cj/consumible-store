import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { tecnicoSchema } from "../schemas/tecnicoSchema.js";
import { TecnicoController } from "../controllers/tecnico.js";

export const tecnicosRouter = Router()

tecnicosRouter.route("/")
     .get(TecnicoController.getAll)
     .post(validate(tecnicoSchema), TecnicoController.create);

tecnicosRouter.route("/:id")
     .get(TecnicoController.getById)
     .put(validate(tecnicoSchema), TecnicoController.update)
     .patch(validatePartial(tecnicoSchema), TecnicoController.patch)
     // @REVISAR: BUG corregido - se pasaba la clase TecnicoController como middleware (crasheaba el endpoint). Debe ser solo TecnicoController.delete
     .delete(TecnicoController.delete);

tecnicosRouter.get("/:id/ordenes", TecnicoController.getOrdenes);