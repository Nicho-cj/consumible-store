import { ORDER_STATUS } from '../utils/status';
import { mockOrdenes } from './ordenesData';
import { getTecnicoNombre } from './tecnicosData';

export const mockLiquidacionesData = mockOrdenes
    .filter(
        (o) =>
            o.estado === ORDER_STATUS.LISTO_ENTREGA ||
            o.estado === ORDER_STATUS.ENTREGADO
    )
    .map((o) => ({
        id: o.id,
        codigo: o.codigo,
        fechaIngreso: o.fechaIngreso,
        fechaCierre: o.fechaEntregado,
        tecnico: o.tecnicoAsignado,
        cliente: o.clienteNombre,
        equipo: `${o.equipoMarca} ${o.equipoModelo}`,
        serial: o.equipoSerie,
        tipoServicio: o.diagnosticoInicial ? 'Reparación / Mantenimiento' : 'Diagnóstico',
        trabajoRealizado: o.diagnostico || o.fallaReportada,
        repuestosUsados: o.repuestosUsados.length > 0
            ? o.repuestosUsados.map((r) => r.nombre).join(', ')
            : 'Ninguno',
        montoTotal: o.montoCobro || 0,
        estado: o.estado,
    }));

export const mockAuditLogsData = [
    {
        id: 'LOG-109',
        fecha: '2026-08-26 10:45 AM',
        usuario: 'Administrador (Recepción)',
        modulo: 'Órdenes',
        accion: 'Creación de Orden',
        detalles: `Se registró la orden ORD-2026-005 para el cliente Lucía Fernández (Serial: HST-11029).`,
    },
    {
        id: 'LOG-108',
        fecha: '2026-08-26 09:30 AM',
        usuario: 'Dario Jose Jimenez',
        modulo: 'Taller',
        accion: 'Diagnóstico Técnico',
        detalles: 'Se ingresó diagnóstico y presupuesto en la orden ORD-2026-003. Pendiente de aprobación del cliente.',
    },
    {
        id: 'LOG-107',
        fecha: '2026-08-25 04:15 PM',
        usuario: 'Administrador (Recepción)',
        modulo: 'Liquidación',
        accion: 'Cierre y Cobro de Servicio',
        detalles: 'Orden ORD-2026-000 cambiada a "Entregado / Cerrado". Cobrado $50.00.',
    },
    {
        id: 'LOG-106',
        fecha: '2026-08-25 02:00 PM',
        usuario: 'Hector Luis Rodriguez',
        modulo: 'Taller',
        accion: 'Cambio de Estatus',
        detalles: 'Orden ORD-2026-005 pasó de "En Reparación" a "Listo para Entrega".',
    },
    {
        id: 'LOG-105',
        fecha: '2026-08-24 11:10 AM',
        usuario: 'Administrador (Recepción)',
        modulo: 'Clientes',
        accion: 'Registro de Cliente',
        detalles: 'Se dio de alta el cliente Inversiones C.A. (RIF: J-40123987-0).',
    },
    {
        id: 'LOG-104',
        fecha: '2026-08-22 05:00 PM',
        usuario: 'Sistema (Automático)',
        modulo: 'Seguridad',
        accion: 'Copia de Seguridad LAN',
        detalles: 'Respaldo automático de base de datos completado exitosamente (backup_20260822.sql).',
    },
];
