import { OrdenModel } from "../models/orden.js";
import {
    validarTransicion,
    validarAprobacionCotizacion,
    validarCierreCompleto,
    ESTADO_ORDEN,
} from "../utils/stateMachine.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { notificarOrdenes } from "../utils/realtime.js";

export class OrdenController {
    static async getAll(req, res) {
        const estado = req.query.estado
        // @REVISAR: soporte para filtrar por tecnico asignado (?tecnico_id=X) usado por la vista tecnica comunitaria
        const tecnicoId = req.query.tecnico_id
        let ordenes = []

        // Si se filtra por tecnico, ignorar el switch de estado y devolver sus ordenes
        if (tecnicoId) {
            ordenes = await OrdenModel.getByTecnico(tecnicoId, estado)
        } else {
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
        }

        res.status(200).json(ordenes)
    }

    static async create(req, res) {
        const data = req.body
        const resultado = await OrdenModel.create(data)

        // @REVISAR: al crear la orden con tecnico asignado, se crea automaticamente la nota_servicio vinculada
        if (resultado && resultado.id_orden) {
            await OrdenModel.crearNotaServicio(resultado.id_orden).catch(() => {});
        }

        await registrarAuditoria(req, {
            modulo: 'Órdenes',
            accion: 'Creación de Orden',
            detalles: `Se registró la orden ${resultado?.codigo_orden}`,
        });

        notificarOrdenes();
        res.status(201).json(resultado)
    }

    static async getById(req, res) {
        const id = req.params.id
        const orden = await OrdenModel.getById(id)
        if (!orden) {
            return res.status(404).json({ status: 'error', message: 'Orden no encontrada' })
        }
        res.status(200).json(orden)
    }

    static async update(req, res) {
        const id = req.params.id
        const data = req.body
        const orden = await OrdenModel.update(id, data)
        notificarOrdenes();
        res.status(200).json(orden)
    }

    // @REVISAR: PATCH es donde se validan las reglas de negocio de transicion de estados
    static async patch(req, res) {
        const id = req.params.id
        const data = req.body
        const ordenActual = await OrdenModel.getById(id)

        if (!ordenActual) {
            return res.status(404).json({ status: 'error', message: 'Orden no encontrada' })
        }

        // Si viene un cambio de estado, validar las reglas de negocio
        if (data.estado && data.estado !== ordenActual.estado) {
            const estadoActual = ordenActual.estado;

            // RN-02: transicion secuencial
            const errorTransicion = validarTransicion(estadoActual, data.estado);
            if (errorTransicion) {
                return res.status(400).json({ status: 'error', message: errorTransicion });
            }

            // RN-03: aprobacion de cotizacion para pasar a proceso tecnico
            const errorAprobacion = validarAprobacionCotizacion(
                estadoActual, data.estado, ordenActual.cotizacion_aprobada
            );
            if (errorAprobacion) {
                return res.status(400).json({ status: 'error', message: errorAprobacion });
            }

            // RN-04: cierre con datos completos (la entrega incluye contador_final y monto_cobro de la orden)
            const nota = await OrdenModel.getNotaServicio(id);
            const errorCierre = validarCierreCompleto(
                data.estado,
                nota,
                { ...ordenActual, ...data }
            );
            if (errorCierre) {
                return res.status(400).json({ status: 'error', message: errorCierre });
            }

            // Al entregar (ENTREGADO), registrar fecha_salida
            if (data.estado === ESTADO_ORDEN.ENTREGADO && !data.fecha_salida) {
                data.fecha_salida = new Date();
            }

            // Al pasar a EN_DIAGNOSTICO sin tecnico asignado, exigir uno o asignarlo
            if (data.estado === ESTADO_ORDEN.EN_DIAGNOSTICO && !ordenActual.id_tecnico && !data.id_tecnico) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se puede iniciar el diagnóstico de una orden sin técnico asignado. Asigne un técnico.',
                });
            }
        }

        // @REVISAR: si se asigna un tecnico y no existe nota_servicio, crearla automaticamente
        if (data.id_tecnico && !ordenActual.id_tecnico) {
            const nota = await OrdenModel.getNotaServicio(id);
            if (!nota) {
                await OrdenModel.crearNotaServicio(id).catch(() => {});
            }
        }

        const orden = await OrdenModel.patch(id, data)

        // Auditoria: cambio de estado y/o asignacion de tecnico
        if (data.estado && data.estado !== ordenActual.estado) {
            await registrarAuditoria(req, {
                modulo: 'Órdenes',
                accion: 'Cambio de Estatus',
                detalles: `Orden ${ordenActual.codigo_orden} pasó de "${ordenActual.estado}" a "${data.estado}"`,
            });
        } else if (data.id_tecnico && String(data.id_tecnico) !== String(ordenActual.id_tecnico)) {
            await registrarAuditoria(req, {
                modulo: 'Órdenes',
                accion: 'Asignación de Técnico',
                detalles: `Se asignó técnico id=${data.id_tecnico} a la orden ${ordenActual.codigo_orden}`,
            });
        }

        notificarOrdenes();
        res.status(200).json(orden)
    }

    static async delete(req, res) {
        const id = req.params.id
        const resultado = await OrdenModel.delete(id)
        if (!resultado) {
            return res.status(404).json({ status: 'error', message: 'Orden no encontrada' })
        }
        await registrarAuditoria(req, {
            modulo: 'Órdenes',
            accion: 'Eliminación de Orden',
            detalles: `Se eliminó la orden ${resultado.codigo_orden}`,
        });
        notificarOrdenes();
        res.status(200).json(resultado)
    }

    // @REVISAR: endpoint dedicado para registrar la respuesta del cliente a la cotizacion (RF-07)
    // PATCH /ordenes/:id/cotizacion  body: { aprobada: boolean }
    static async responderCotizacion(req, res) {
        const id = req.params.id
        const { aprobada } = req.body

        if (typeof aprobada !== 'boolean') {
            return res.status(400).json({ status: 'error', message: 'El campo "aprobada" debe ser booleano (true/false)' })
        }

        const ordenActual = await OrdenModel.getById(id)
        if (!ordenActual) {
            return res.status(404).json({ status: 'error', message: 'Orden no encontrada' })
        }

        if (aprobada) {
            // Cliente aprobo -> pasa a PROCESO_TECNICO (dentro de la secuencia valida)
            const resultado = await OrdenModel.patch(id, {
                cotizacion_aprobada: true,
                estado: ESTADO_ORDEN.PROCESO_TECNICO,
            })
            await registrarAuditoria(req, {
                modulo: 'Órdenes',
                accion: 'Cotización Aprobada',
                detalles: `El cliente aprobó la cotización de la orden ${ordenActual.codigo_orden} (pasa a proceso técnico)`,
            });
            notificarOrdenes();
            return res.status(200).json(resultado)
        } else {
            // Cliente rechazo -> se cancela la orden
            const resultado = await OrdenModel.patch(id, {
                cotizacion_aprobada: false,
                estado: ESTADO_ORDEN.CANCELADO,
            })
            await registrarAuditoria(req, {
                modulo: 'Órdenes',
                accion: 'Cotización Rechazada',
                detalles: `El cliente rechazó la cotización de la orden ${ordenActual.codigo_orden} (se cancela)`,
            });
            notificarOrdenes();
            return res.status(200).json(resultado)
        }
    }

    // @REVISAR: endpoint dedicado para cambio de tecnico con justificacion (RF-05 / flujo taller)
    static async cambiarTecnico(req, res) {
        const id = req.params.id
        const { id_tecnico, motivo } = req.body

        if (!id_tecnico || !motivo) {
            return res.status(400).json({ status: 'error', message: 'Se requieren id_tecnico y motivo para el cambio' })
        }

        const ordenActual = await OrdenModel.getById(id)
        if (!ordenActual) {
            return res.status(404).json({ status: 'error', message: 'Orden no encontrada' })
        }

        const resultado = await OrdenModel.patch(id, {
            id_tecnico,
            motivo_cambio_tecnico: motivo,
        })
        await registrarAuditoria(req, {
            modulo: 'Órdenes',
            accion: 'Cambio de Técnico',
            detalles: `Orden ${ordenActual.codigo_orden}: técnico id=${id_tecnico} (motivo: ${motivo})`,
        });
        notificarOrdenes();
        res.status(200).json(resultado)
    }

    // @REVISAR: endpoint para registrar el numero de factura de una orden entregada (RF-10)
    static async registrarFactura(req, res) {
        const id = req.params.id
        const { numero_factura } = req.body

        if (numero_factura === undefined || numero_factura === null) {
            return res.status(400).json({ status: 'error', message: 'El campo numero_factura es requerido' })
        }

        const ordenActual = await OrdenModel.getById(id)
        if (!ordenActual) {
            return res.status(404).json({ status: 'error', message: 'Orden no encontrada' })
        }

        if (ordenActual.estado !== ESTADO_ORDEN.ENTREGADO) {
            return res.status(400).json({ status: 'error', message: 'Solo se puede registrar el número de factura en órdenes entregadas' })
        }

        const resultado = await OrdenModel.patch(id, { numero_factura })
        await registrarAuditoria(req, {
            modulo: 'Liquidación',
            accion: 'Registro de Factura',
            detalles: `Factura ${numero_factura} registrada en la orden ${ordenActual.codigo_orden}`,
        });
        notificarOrdenes();
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
            // @REVISAR: typo corregido en controller - era getRespuestos, ahora getRepuestos
            case 'repuestos':
                resultado = await OrdenModel.getRepuestos(id)
                break;
            default:
                return next()
        }

        res.status(200).json(resultado)
    }
}
