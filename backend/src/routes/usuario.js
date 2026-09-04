import { Router } from "express";
import { ClienteController } from "../controllers/clientes.js";
import { validate, validatePartial } from "../middlewares/validate.js";
import { usuarioSchema } from "../schemas/usuarioSchema.js";

export const usuariosRouter = Router()

usuariosRouter.route("/")
     .get(ClienteController)
     .post(validate(usuarioSchema))

usuariosRouter.route("/:id")
     .get((req, res) => res.status(200).json({"status": "ta'bien"}))
     .put(validate(usuarioSchema))
     .patch(validatePartial(usuarioSchema))
     .delete((req, res) => res.status(200).json({"status": "ta'bien"}));

usuariosRouter.get("/:id/ordenes", (req, res) => res.status(200).json({"status": "ta'bien"}))