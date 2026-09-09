import { Router } from "express";
import { ordenSchema } from "../schemas/ordenSchema.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { OrdenController } from "../controllers/ordenes.js";

export const ordenesRouter = Router()

ordenesRouter.route("/")
     .get(OrdenController.getAll)
     .post(validate(ordenSchema), OrdenController.create);

// @REVISAR: rutas especificas definidas ANTES de /:id para que Express no las tome como /:id
ordenesRouter.patch("/:id/cotizacion", OrdenController.responderCotizacion);
ordenesRouter.patch("/:id/cambiar-tecnico", OrdenController.cambiarTecnico);
ordenesRouter.patch("/:id/factura", OrdenController.registrarFactura);

// @REVISAR: la ruta /:id/:entidad debe ir DESPUES de las rutas especificas de /:id/...
ordenesRouter.get("/:id/:entidad", OrdenController.getEntidad)

ordenesRouter.route("/:id")
     .get(OrdenController.getById)
     .put(validate(ordenSchema), OrdenController.update)
     .patch(validatePartial(ordenSchema), OrdenController.patch)
     // @REVISAR: BUG corregido - se pasaba la clase OrdenController como middleware (crasheaba el endpoint). Debe ser solo OrdenController.delete
     .delete(OrdenController.delete);
