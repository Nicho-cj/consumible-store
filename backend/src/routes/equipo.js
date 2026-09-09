import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { equipoSchema } from "../schemas/equipoSchema.js";
import { EquipoController } from "../controllers/equipo.js";

export const equiposRouter = Router()

// @REVISAR: Se corrigio la ruta /:serial -> /:id porque todas las operaciones usan id_equipo (entero PK).
// El serial se usa para filtros via query params: GET /equipos?serial=X3K891234

// Busqueda por serial (ANTES de /:id para evitar conflictos de matching)
equiposRouter.get("/buscar/:serial", EquipoController.getBySerial);

equiposRouter.route("/")
     .get(EquipoController.getAll)
     .post(validate(equipoSchema), EquipoController.create);

equiposRouter.route("/:id")
     .get(EquipoController.getById)
     .put(validate(equipoSchema), EquipoController.update)
     .patch(validatePartial(equipoSchema), EquipoController.patch)
     .delete(EquipoController.delete);

equiposRouter.get("/:id/ordenes", EquipoController.getOrdenes);

equiposRouter.get("/:id/clientes", EquipoController.getClientes);
