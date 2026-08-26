import { Router } from "express";
import { validacionCliente, validacionParcialCliente } from "../schemas/clienteSchema.js";

export const clientesRouter = Router()

clientesRouter.get("/", (req, res) => {
     console.log("se hizo una petición GET");

});

clientesRouter.post("/", (req, res) => {
     const resultado = validacionCliente(req.body)
     console.log(resultado.error);

     if (resultado.error) {
          return res.status(400).json({error: resultado.error.message})
     }
});

clientesRouter.get("/:id", (req, res) => {

});