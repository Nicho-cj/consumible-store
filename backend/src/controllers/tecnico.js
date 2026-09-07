import { TecnicoModel } from "../models/tecnico.js";

export class TecnicoController {
     static async getAll(req, res) {
          const tecnicos = await TecnicoModel.getAll()
          res.status(200).json(tecnicos)
     }

     static async create(req, res) {
          const data = req.body
          const resultado = await TecnicoModel.create(data)

          res.status(200).json(resultado)
     }

     static async getById(req, res) {
          const id = req.params.id
          const tecnico = await TecnicoModel.getById(id)

          res.status(200).json(tecnico)
     }

     static async update(req, res) {
          const id = req.params.id
          const data = req.body
          const tecnico = await TecnicoModel.update(id, data)

          res.status(200).json(tecnico)
     }

     static async patch (req, res) {
          const id = req.params.id
          const data = req.body
          const tecnico = await TecnicoModel.patch(id, data)

          res.status(200).json(tecnico)
     }

     static async delete (req, res) {
          const id = req.params.id
          const resultado = await TecnicoModel.delete(id)

          res.status(200).json(resultado)
     }

     static async getOrdenes(req, res) {
          const id = req.params.id
          const resultados = await TecnicoModel.getOrdenes(id)

          res.status(200).json(resultados)
     }
}