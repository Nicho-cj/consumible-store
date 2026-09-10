import { DetalleRepuestoModel } from "../models/repuesto.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { notificarOrdenes } from "../utils/realtime.js";

// @REVISAR: controller nuevo - antes no existia controllers/repuesto.js
export class DetalleRepuestoController {
     static async getAll(req, res) {
          const repuestos = await DetalleRepuestoModel.getAll()
          res.status(200).json(repuestos)
     }

     static async getById(req, res) {
          const id = req.params.id
          const repuesto = await DetalleRepuestoModel.getById(id)
          if (!repuesto) {
               return res.status(404).json({ status: 'error', message: 'Detalle de repuesto no encontrado' })
          }
          res.status(200).json(repuesto)
     }

     static async create(req, res) {
          const data = req.body
          const resultado = await DetalleRepuestoModel.create(data)
          await registrarAuditoria(req, {
               modulo: 'Taller',
               accion: 'Registro de Repuesto',
               detalles: `Repuesto "${data.nombre}" (${data.cantidad}) en la orden id=${data.id_orden}`,
          });
          notificarOrdenes();
          res.status(201).json(resultado)
     }

     static async update(req, res) {
          const id = req.params.id
          const data = req.body
          const repuesto = await DetalleRepuestoModel.update(id, data)
          res.status(200).json(repuesto)
     }

     static async patch(req, res) {
          const id = req.params.id
          const data = req.body
          const repuesto = await DetalleRepuestoModel.patch(id, data)
          res.status(200).json(repuesto)
     }

     static async delete(req, res) {
          const id = req.params.id
          const resultado = await DetalleRepuestoModel.delete(id)
          await registrarAuditoria(req, {
               modulo: 'Taller',
               accion: 'Eliminación de Repuesto',
               detalles: `Se eliminó el detalle de repuesto id=${id}`,
          });
          notificarOrdenes();
          res.status(200).json(resultado)
     }

     static async getByOrden(req, res) {
          const idOrden = req.params.idOrden
          const repuestos = await DetalleRepuestoModel.getByOrden(idOrden)
          res.status(200).json(repuestos)
     }
}
