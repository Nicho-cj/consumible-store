import { Router } from "express";
import { validate, validatePartial } from "../middlewares/validate.js";
import { clienteSchema } from "../schemas/clienteSchema.js";

export const clientesRouter = Router()

clientesRouter.get("/", (req, res) => {
     console.log("se hizo una petición GET");

});

clientesRouter.post("/", validate(clienteSchema) )

clientesRouter.patch("/:identificacion", validatePartial(clienteSchema),)

clientesRouter.delete("/", (req, res) => {
     console.log("se hizo una petición GET");
});