import { Router } from "express";
import { usuarioSchema } from "../schemas/usuarioSchema.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { UsuarioController } from "../controllers/usuario.js";

export const usuariosRouter = Router()

usuariosRouter.route("/")
     .get(UsuarioController.getAll)
     .post(validate(usuarioSchema), UsuarioController.create)

usuariosRouter.route("/:id")
     .get(UsuarioController.getById)
     .put(validate(usuarioSchema), UsuarioController.update)
     .patch(validatePartial(usuarioSchema), UsuarioController.patch)
     .delete(UsuarioController.delete);

usuariosRouter.get("/:id/ordenes", UsuarioController.getOrdenes)