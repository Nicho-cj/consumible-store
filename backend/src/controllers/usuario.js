import { UsuarioModel } from "../models/usuario.js";

export class UsuarioController {
     static async getAll(req, res) {
          const usuarios = await UsuarioModel.getAll()
          res.status(200).json(usuarios)
     }

     static async create(req, res) {
          const data = req.body
          const resultado = await UsuarioModel.create(data)

          res.status(200).json(resultado)
     }

     static async getById(req, res) {
          const id = req.params.id
          const usuario = await UsuarioModel.getById(id)

          res.status(200).json(usuario)
     }

     static async update(req, res) {
          const id = req.params.id
          const data = req.body
          const usuario = await UsuarioModel.update(id, data)

          res.status(200).json(usuario)
     }

     static async patch (req, res) {
          const id = req.params.id
          const data = req.body
          const usuario = await UsuarioModel.patch(id, data)

          res.status(200).json(usuario)
     }

     static async delete (req, res) {
          const id = req.params.id
          const resultado = await UsuarioModel.delete(id)

          res.status(200).json(resultado)
     }

     static async getOrdenes(req, res) {
          const id = req.params.id
          const resultados = await UsuarioModel.getOrdenes(id)

          res.status(200).json(resultados)
     }
}