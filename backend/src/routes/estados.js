import { Router } from "express";

export const estadosRouter = Router()

estadosRouter.get("/", (req, res) => {
     console.log("Todos los estados");
});

estadosRouter.get("/recibidos", (req, res) => {
     console.log("fecha de entrada sin tecnico asignado");
});

estadosRouter.get("/diagnostico", (req, res) => {
     console.log("tecnico sin diagnóstico");
});

estadosRouter.get("/esperando-aprobacion", (req, res) => {
     console.log("diagnóstico sin aprobación");
});

estadosRouter.get("/reparacion", (req, res) => {
     console.log("aprobación sin fecha fin (tecnico)");
});

estadosRouter.get("/entregable", (req, res) => {
     console.log("fecha fin (tecnico) sin fecha salida");
});

estadosRouter.get("/finalizado", (req, res) => {
     console.log("aporbación true y fecha salida");
});

estadosRouter.get("/cancelado", (req, res) => {
     console.log("aprobación false y fecha de salida");
});