import { OrdenModel } from "../models/orden.js";

export class OrdenController {
     static async getAll(req, res) {
          const estado = req.query.estado
          let ordenes = []

          switch (estado) {
               case 'abierto':
                    ordenes = await OrdenModel.getAbierto()
                    break;
               case 'recibido':
                    ordenes = await OrdenModel.getRecibidos()
                    break;
               case 'diagnostico':
                    ordenes = await OrdenModel.getDiagnostico()
                    break;
               case 'cotizacion':
                    ordenes = await OrdenModel.getCotizacion()
                    break;
               case 'reparacion':
                    ordenes = await OrdenModel.getReparacion()
                    break;
               case 'entregable':
                    ordenes = await OrdenModel.getEntregable()
                    break;
               case 'finalizado':
                    ordenes = await OrdenModel.getFinalizado()
                    break;
               case 'cancelado':
                    ordenes = await OrdenModel.getCancelado()
                    break;
               default:
                    ordenes = await OrdenModel.getAll()
          }

          res.status(200).json(ordenes)
     }

     static async create(req, res) {
          const data = req.body
          const resultado = await OrdenModel.create(data)

          res.status(200).json(resultado)
     }

     static async getById(req, res) {
          const id = req.params.id
          const orden = await OrdenModel.getById(id)

          res.status(200).json(orden)
     }

     static async update(req, res) {
          const id = req.params.id
          const data = req.body
          const orden = await OrdenModel.update(id, data)

          res.status(200).json(orden)
     }

     static async patch (req, res) {
          const id = req.params.id
          const data = req.body
          const orden = await OrdenModel.patch(id, data)

          res.status(200).json(orden)
     }

     static async delete (req, res) {
          const id = req.params.id
          const resultado = await OrdenModel.delete(id)

          res.status(200).json(resultado)
     }

     static async getEntidad(req, res, next) {
          const id = req.params.id
          const entidad = req.params.entidad
          let resultado = []

          switch (entidad) {
               case 'cliente':
                    resultado = await OrdenModel.getCliente(id)
                    break;
               case 'equipo':
                    resultado = await OrdenModel.getEquipo(id)
                    break;
               case 'usuario':
                    resultado = await OrdenModel.getUsuario(id)
                    break;
               case 'tecnico':
                    resultado = await OrdenModel.getTecnico(id)
                    break;
               case 'servicio':
                    resultado = await OrdenModel.getServicio(id)
                    break;
               case 'repuestos':
                    resultado = await OrdenModel.getRespuestos(id)
                    break;
               default:
                    return next()
          }

          res.status(200).json(resultado)
     }
}