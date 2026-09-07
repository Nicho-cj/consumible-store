import { EquipoModel } from "../models/equipo.js";

export class EquipoController {
     static async getAll(req, res) {
          const equipos = await EquipoModel.getAll(req.query)
          res.status(200).json(equipos)
     }

     static async create(req, res) {

          const data = req.body
          const resultado = await EquipoModel.create(data)

          res.status(200).json(resultado)
     }

     static async getById(req, res) {
          const serial = req.params.serial
          const equipo = await EquipoModel.getById(serial)

          res.status(200).json(equipo)
     }

     static async update(req, res) {
          const serial = req.params.serial
          const data = req.body
          const equipo = await EquipoModel.update(serial, data)

          res.status(200).json(equipo)
     }

     static async patch (req, res) {
          const serial = req.params.serial
          const data = req.body
          const equipo = await EquipoModel.patch(serial, data)

          res.status(200).json(equipo)
     }

     static async delete (req, res) {
          const serial = req.params.serial
          const resultado = await EquipoModel.delete(serial)

          res.status(200).json(resultado)
     }

     static async getClientes (req, res) {
          const serial = req.params.serial
          const equipos = await EquipoModel.getClientes(serial)

          res.status(200).json(equipos)
     }

     static async getOrdenes(req, res) {
          const serial = req.params.serial
          const equipos = await EquipoModel.getOrdenes(serial)

          

          res.status(200).json(equipos)
     }
}