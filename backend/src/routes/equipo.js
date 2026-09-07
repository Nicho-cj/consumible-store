import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { equipoSchema } from "../schemas/equipoSchema.js";
import { EquipoController } from "../controllers/equipo.js";

export const equiposRouter = Router()

equiposRouter.route("/")
     .get(EquipoController.getAll)
     .post(validate(equipoSchema), EquipoController.create);

equiposRouter.route("/:serial")
     .get(EquipoController.getById)
     .put(validate(equipoSchema), EquipoController.update)
     .patch(validatePartial(equipoSchema), EquipoController.patch)
     .delete(EquipoController.delete);

equiposRouter.get("/:serial/ordenes", EquipoController.getOrdenes);

equiposRouter.get("/:serial/clientes", EquipoController.getClientes);      //   OPCIONAL