import { Router } from "express";
import { DetalleRepuestoController } from "../controllers/repuesto.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { detalleRepuestoSchema } from "../schemas/detalleRepuestoSchema.js";

// @REVISAR: rutas nuevas - antes no existia routes/repuesto.js
export const repuestosRouter = Router()

repuestosRouter.route("/")
     .get(DetalleRepuestoController.getAll)
     .post(validate(detalleRepuestoSchema), DetalleRepuestoController.create)

repuestosRouter.route("/:id")
     .get(DetalleRepuestoController.getById)
     .put(validate(detalleRepuestoSchema), DetalleRepuestoController.update)
     .patch(validatePartial(detalleRepuestoSchema), DetalleRepuestoController.patch)
     .delete(DetalleRepuestoController.delete);

repuestosRouter.get("/orden/:idOrden", DetalleRepuestoController.getByOrden)
