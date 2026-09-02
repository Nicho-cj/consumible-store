import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { clienteSchema } from "../schemas/clienteSchema.js";
import { ClienteController } from "../controllers/clientes.js";

export const clientesRouter = Router()

clientesRouter.route("/")
     .get(ClienteController.getAll)
     .post(validate(clienteSchema), ClienteController);

clientesRouter.route("/:id")
     .get(ClienteController.getById)
     .put(validate(clienteSchema), ClienteController.update)
     .patch(validatePartial(clienteSchema), ClienteController.update)
     .delete( ClienteController.delete);

clientesRouter.get("/:id/equipos", ClienteController.getEquipos);

clientesRouter.get("/:id/ordenes", ClienteController.getOrdenes);