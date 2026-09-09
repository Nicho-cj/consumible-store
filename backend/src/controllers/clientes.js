import { ClienteModel } from "../models/cliente.js";
import { registrarAuditoria } from "../utils/auditoria.js";

export class ClienteController {
     static async getAll(req, res) {
          const clientes = await ClienteModel.getAll(req.query)
          res.status(200).json(clientes)
     }

     static async create(req, res) {

          const data = req.body
          const resultado = await ClienteModel.create(data)

          await registrarAuditoria(req, {
               modulo: 'Clientes',
               accion: 'Registro de Cliente',
               detalles: `Se dio de alta el cliente "${resultado?.nombre_completo}" (${resultado?.ci_rif})`,
          });

          res.status(200).json(resultado)
     }

     static async getById(req, res) {
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

     static async patch (req, res) {
          const id = req.params.id
          const data = req.body
          const cliente = await ClienteModel.patch(id, data)

          await registrarAuditoria(req, {
               modulo: 'Clientes',
               accion: 'Actualización de Cliente',
               detalles: `Se actualizó el cliente id=${id}`,
          });

          res.status(200).json(cliente)
     }

     static async delete (req, res) {
          const id = req.params.id
          const resultado = await ClienteModel.delete(id)

          await registrarAuditoria(req, {
               modulo: 'Clientes',
               accion: 'Eliminación de Cliente',
               detalles: `Se eliminó el cliente id=${id}`,
          });

          res.status(200).json(resultado)
     }

     static async getEquipos (req, res) {
          const id = req.params.id
          const equipos = await ClienteModel.getEquipos(id)

          res.status(200).json(equipos)
     }

     static async getOrdenes(req, res) {
          const id = req.params.id
          const equipos = await ClienteModel.getOrdenes(id)

          res.status(200).json(equipos)
     }
}