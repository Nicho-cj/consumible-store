import { RepuestoModel } from "../models/repuestoCatalogo.js";

export class RepuestoCatalogoController {
    static async getAll(req, res, next) {
        try {
            const repuestos = await RepuestoModel.getAll();
            res.status(200).json(repuestos);
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const { nombre } = req.body;
            const { repuesto, created } = await RepuestoModel.create(nombre);
            res.status(created ? 201 : 200).json(repuesto);
        } catch (err) {
            next(err);
        }
    }
}