import { EquipoModel } from "../models/equipo.js";

export class EquipoController {
     // @REVISAR: Todos los params cambiaron de req.params.serial a req.params.id (entero id_equipo)
     static async getAll(req, res) {
          const equipos = await EquipoModel.getAll(req.query)
          res.status(200).json(equipos)
     }

     static async create(req, res) {
          const data = req.body
          const resultado = await EquipoModel.create(data)
          res.status(201).json(resultado)
     }

     // @REVISAR: Busca por serial (string), retorna el equipo con historial de ordenes
     static async getBySerial(req, res) {
          const serial = req.params.serial
          const equipo = await EquipoModel.getBySerial(serial)
          if (!equipo) {
               return res.status(404).json({ status: 'error', message: 'Equipo no encontrado por serial' })
          }
          res.status(200).json(equipo)
     }

     static async getById(req, res) {
          const id = req.params.id
          const equipo = await EquipoModel.getById(id)
          if (!equipo) {
               return res.status(404).json({ status: 'error', message: 'Equipo no encontrado' })
          }
          res.status(200).json(equipo)
     }

     static async update(req, res) {
          const id = req.params.id
          const data = req.body
          const equipo = await EquipoModel.update(id, data)
          res.status(200).json(equipo)
     }

     static async patch(req, res) {
          const id = req.params.id
          const data = req.body
          const equipo = await EquipoModel.patch(id, data)
          res.status(200).json(equipo)
     }

     static async delete(req, res) {
          const id = req.params.id
          const resultado = await EquipoModel.delete(id)
          if (!resultado) {
               return res.status(404).json({ status: 'error', message: 'Equipo no encontrado' })
          }
          res.status(200).json(resultado)
     }

     static async getClientes(req, res) {
          const id = req.params.id
          const clientes = await EquipoModel.getClientes(id)
          res.status(200).json(clientes)
     }

     static async getOrdenes(req, res) {
          const id = req.params.id
          const ordenes = await EquipoModel.getOrdenes(id)
          res.status(200).json(ordenes)
     }
}
