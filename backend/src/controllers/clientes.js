import { ClienteModel } from "../models/cliente.js";
import { AppError } from "../utils/appError.js";

export class ClienteController {
     static async getAll(req, res) {

          const clientes = await ClienteModel.getAll()
          res.status(200).json(clientes)
     }

     static async create(req, res, next) {

          const data = req.body
          const resultado = await ClienteModel.create(data)

          res.status(200).json(resultado)
     }

     static async getById(req, res, next) {
          const id = req.params.id
          const cliente = await ClienteModel.getById(id)

          res.status(200).json(cliente)
     }

     static async update(req, res, next) {
          const id = req.params.id
          const data = req.body
          const cliente = await ClienteModel.update(id, data)

          res.status(200).json(cliente)
     }

     static async patch (req, res, next) {
          const id = req.params.id
          const data = req.body
          const cliente = await ClienteModel.patch(id, data)

          res.status(200).json(cliente)
     }

     static async delete (req, res, next) {
          const id = req.params.id
          const resultado = await ClienteModel.delete(id)

          res.status(200).json(resultado)
     }

     static async getEquipos (req, res, next) {
          const id = req.params.id
          const equipos = await ClienteModel.getOrdenes(id)

          res.status(200).json(equipos)
     }

     static async getOrdenes(req, res, next) {
          const id = req.params.id
          const equipos = await ClienteModel.getOrdenes(id)

          res.status(200).json(equipos)
     }
}