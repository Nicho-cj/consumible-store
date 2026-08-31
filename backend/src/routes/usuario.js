import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { usuarioSchema } from "../schemas/usuarioSchema.js";

export const usuariosRouter = Router()

usuariosRouter.get("/", (req, res) => {
     console.log("TODOS LOS USUARIOS");
});

usuariosRouter.get("/:id", (req, res) => {
     console.log("USUARIO EN ESPECÍFICO");
});

usuariosRouter.post("/", validate(usuarioSchema) )     // REGISTRA NUEVO EQUIPO

usuariosRouter.patch("/:id", validatePartial(usuarioSchema),)  // MODIFICA EQUIPO EN ESPECÍFICO

usuariosRouter.delete("/:id", (req, res) => {
     console.log("ELIMINA UN CLIENTE EN ESPECÍFICO");
});