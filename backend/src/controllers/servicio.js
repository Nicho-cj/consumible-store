import { NotaServicioModel } from "../models/servicio.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { notificarOrdenes } from "../utils/realtime.js";

// @REVISAR: controller nuevo - antes NO existia controllers/servicio.js, por eso la ruta crasheaba al importarla
export class ServicioController {
     static async getAll(req, res) {
          const servicios = await NotaServicioModel.getAll()
          res.status(200).json(servicios)
     }

     static async getById(req, res) {
          const id = req.params.id
          const servicio = await NotaServicioModel.getById(id)
          if (!servicio) {
               return res.status(404).json({ status: 'error', message: 'Nota de servicio no encontrada' })
          }
          res.status(200).json(servicio)
     }

     static async create(req, res) {
          const data = req.body
          const resultado = await NotaServicioModel.create(data)
          await registrarAuditoria(req, {
               modulo: 'Taller',
               accion: 'Diagnóstico Técnico',
               detalles: `Se registró la nota de servicio de la orden id=${data.id_orden}`,
          });
          notificarOrdenes();
          res.status(201).json(resultado)
     }

     static async update(req, res) {
          const id = req.params.id
          const data = req.body
          const servicio = await NotaServicioModel.update(id, data)
          notificarOrdenes();
          res.status(200).json(servicio)
     }

     static async patch(req, res) {
          const id = req.params.id
          const data = req.body
          const servicio = await NotaServicioModel.patch(id, data)
          await registrarAuditoria(req, {
               modulo: 'Taller',
               accion: 'Actualización de Nota de Servicio',
               detalles: `Se actualizó la nota de servicio id=${id}`,
          });
          notificarOrdenes();
          res.status(200).json(servicio)
     }

     static async delete(req, res) {
          const id = req.params.id
          const resultado = await NotaServicioModel.delete(id)
          await registrarAuditoria(req, {
               modulo: 'Taller',
               accion: 'Eliminación de Nota de Servicio',
               detalles: `Se eliminó la nota de servicio id=${id}`,
          });
          res.status(200).json(resultado)
     }

     // @REVISAR: retorna la orden asociada a la nota de servicio
     static async getOrden(req, res) {
          const id = req.params.id
          const nota = await NotaServicioModel.getById(id)
          if (!nota) {
               return res.status(404).json({ status: 'error', message: 'Nota de servicio no encontrada' })
          }
          // La nota se relaciona con su orden por id_orden
          res.status(200).json({ id_orden: nota.id_orden })
     }
}
