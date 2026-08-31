import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { equipoSchema } from "../schemas/equipoSchema.js";

export const equiposRouter = Router()

equiposRouter.get("/", (req, res) => {
     console.log("TODOS LOS EQUIPOS");
});

equiposRouter.get("/:serial", (req, res) => {
     console.log("EQUIPO EN ESPECÍFICO");
});

equiposRouter.get("/:serial/clientes", (req, res) => {
     console.log("CLIENTES ENLAZADOS A UN EQUIPO ESPECÍFICO");
});

equiposRouter.get("/:serial/ordenes", (req, res) => {
     console.log("ORDENES DE UN EQUIPOS ESPECÍFICO");
});

equiposRouter.post("/", validate(equipoSchema) )     // REGISTRA NUEVO EQUIPO

equiposRouter.put("/:serial", validatePartial(equipoSchema),)  // MODIFICA EQUIPO EN ESPECÍFICO

equiposRouter.delete("/:serial", (req, res) => {
     console.log("ELIMINA UN CLIENTE EN ESPECÍFICO");
});