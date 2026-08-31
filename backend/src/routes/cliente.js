import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { clienteSchema } from "../schemas/clienteSchema.js";

export const clientesRouter = Router()

clientesRouter.get("/", (req, res) => {
     console.log("TODOS LOS CLIENTES");
});

clientesRouter.get("/:id", (req, res) => {
     console.log("CLIENTE EN ESPECÍFICO");
});

clientesRouter.get("/:id/equipos", (req, res) => {
     console.log("EQUIPOS ENLAZADOS A UN CLIENTE ESPECÍFICO");
});

clientesRouter.get("/:id/ordenes", (req, res) => {
     console.log("ORDENES DE UN CLIENTE ESPECÍFICO");
});

clientesRouter.post("/", validate(clienteSchema) )     // REGISTRA NUEVO CLIENTES

clientesRouter.put("/:id", validatePartial(clienteSchema),)  // MODIFICA CLIENTE EN ESPECÍFICO

clientesRouter.delete("/:id", (req, res) => {
     console.log("ELIMINA UN CLIENTE EN ESPECÍFICO");
});