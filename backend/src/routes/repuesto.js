import { Router } from "express";
import { DetalleRepuestoController } from "../controllers/repuesto.js";
import { RepuestoCatalogoController } from "../controllers/repuestoCatalogo.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { detalleRepuestoSchema } from "../schemas/detalleRepuestoSchema.js";
import { repuestoSchema } from "../schemas/repuestoSchema.js";

// @REVISAR: rutas nuevas - antes no existia routes/repuesto.js
export const repuestosRouter = Router()

// Catalogo de repuestos (tabla independiente, solo nombres).
// Se registra ANTES de route("/:id") para que "/catalogo" no lo absorba el param.
repuestosRouter.route("/catalogo")
     .get(RepuestoCatalogoController.getAll)
     .post(validate(repuestoSchema), RepuestoCatalogoController.create)

repuestosRouter.route("/")
     .get(DetalleRepuestoController.getAll)
     .post(validate(detalleRepuestoSchema), DetalleRepuestoController.create)

repuestosRouter.route("/:id")
     .get(DetalleRepuestoController.getById)
     .put(validate(detalleRepuestoSchema), DetalleRepuestoController.update)
     .patch(validatePartial(detalleRepuestoSchema), DetalleRepuestoController.patch)
     .delete(DetalleRepuestoController.delete);

repuestosRouter.get("/orden/:idOrden", DetalleRepuestoController.getByOrden)