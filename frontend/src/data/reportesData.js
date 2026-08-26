import { ORDER_STATUS } from '../utils/status';

export const mockLiquidacionesData = [
    {
        id: 1,
        codigo: 'ORD-2026-001',
        fechaIngreso: '2026-08-10',
        fechaCierre: '2026-08-14',
        tecnico: 'Hector Luis Rodriguez',
        cliente: 'Carlos Rodríguez',
        equipo: 'Epson L3110',
        serial: 'SER-11029',
        tipoServicio: 'Mantenimiento Correctivo',
        trabajoRealizado: 'Limpieza de cabezal y cambio de almohadillas',
        repuestosUsados: 'Almohadillas Epson L3110',
        montoTotal: 35.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 2,
        codigo: 'ORD-2026-002',
        fechaIngreso: '2026-08-12',
        fechaCierre: '2026-08-15',
        tecnico: 'Dario Jose Jimenez',
        cliente: 'María Gómez',
        equipo: 'HP LaserJet M404dn',
        serial: 'SER-990011',
        tipoServicio: 'Revisión y Reparación',
        trabajoRealizado: 'Reemplazo de rodillo de arrastre (Pick-up roller)',
        repuestosUsados: 'Pick-up roller HP M404',
        montoTotal: 45.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 3,
        codigo: 'ORD-2026-003',
        fechaIngreso: '2026-08-13',
        fechaCierre: '2026-08-16',
        tecnico: 'Hector Luis Rodriguez',
        cliente: 'Inversiones C.A.',
        equipo: 'Canon G3110',
        serial: 'SER-443322',
        tipoServicio: 'Mantenimiento Preventivo',
        trabajoRealizado: 'Mantenimiento general de sistema continuo y purga de tintas',
        repuestosUsados: 'Ninguno',
        montoTotal: 25.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 4,
        codigo: 'ORD-2026-005',
        fechaIngreso: '2026-08-15',
        fechaCierre: '2026-08-18',
        tecnico: 'Domingo',
        cliente: 'Pedro Perez',
        equipo: 'Epson L805',
        serial: 'SER-000000',
        tipoServicio: 'Mantenimiento Correctivo',
        trabajoRealizado: 'Destape por ultrasonido de inyectores y calibración',
        repuestosUsados: 'Líquido destapador especializado',
        montoTotal: 50.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 5,
        codigo: 'ORD-2026-008',
        fechaIngreso: '2026-08-18',
        fechaCierre: '2026-08-21',
        tecnico: 'Dario Jose Jimenez',
        cliente: 'DellAcuatica CA',
        equipo: 'Kyocera ECOSYS M2040dn',
        serial: 'SER-882211',
        tipoServicio: 'Mantenimiento Correctivo',
        trabajoRealizado: 'Cambio de engranaje de fusor y limpieza de escáner',
        repuestosUsados: 'Engranaje de tracción de fusor',
        montoTotal: 65.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 6,
        codigo: 'ORD-2026-010',
        fechaIngreso: '2026-08-20',
        fechaCierre: '2026-08-23',
        tecnico: 'Eloy',
        cliente: 'Distribuidora del Sur',
        equipo: 'Brother DCP-T510W',
        serial: 'SER-554433',
        tipoServicio: 'Revisión y Reparación',
        trabajoRealizado: 'Reemplazo de sensor de paso de papel y mantenimiento del mecanismo',
        repuestosUsados: 'Sensor óptico de papel Brother',
        montoTotal: 40.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 7,
        codigo: 'ORD-2026-012',
        fechaIngreso: '2026-08-22',
        fechaCierre: '2026-08-25',
        tecnico: 'Jesús Saavedra',
        cliente: 'Clínica Guayana',
        equipo: 'Zebra ZD220',
        serial: 'SER-776655',
        tipoServicio: 'Mantenimiento Preventivo',
        trabajoRealizado: 'Limpieza de cabezal térmico y calibración de sensor de etiquetas',
        repuestosUsados: 'Ninguno',
        montoTotal: 30.0,
        estado: ORDER_STATUS.ENTREGADO
    }
];

export const mockAuditLogsData = [
    {
        id: 'LOG-109',
        fecha: '2026-08-25 10:45 AM',
        usuario: 'Administrador (Recepción)',
        modulo: 'Órdenes',
        accion: 'Creación de Orden',
        detalles: 'Se registró la orden ORD-2026-015 para el cliente Jesús Saavedra (Serial: SER-990011).'
    },
    {
        id: 'LOG-108',
        fecha: '2026-08-25 09:30 AM',
        usuario: 'Dario Jose Jimenez',
        modulo: 'Taller',
        accion: 'Diagnóstico Técnico',
        detalles: 'Se ingresó diagnóstico y presupuesto de $45.00 en la orden ORD-2026-002.'
    },
    {
        id: 'LOG-107',
        fecha: '2026-08-24 04:15 PM',
        usuario: 'Administrador (Recepción)',
        modulo: 'Liquidación',
        accion: 'Cierre y Cobro de Servicio',
        detalles: 'Orden ORD-2026-008 cambiada a "Entregado / Finalizado". Cobrado $65.00 en punto de venta.'
    },
    {
        id: 'LOG-106',
        fecha: '2026-08-24 02:00 PM',
        usuario: 'Hector Luis Rodriguez',
        modulo: 'Taller',
        accion: 'Cambio de Estatus',
        detalles: 'Orden ORD-2026-003 pasó de "En Reparación" a "Listo para Entrega".'
    },
    {
        id: 'LOG-105',
        fecha: '2026-08-23 11:10 AM',
        usuario: 'Administrador (Recepción)',
        modulo: 'Clientes',
        accion: 'Registro de Cliente',
        detalles: 'Se dio de alta el cliente Inversiones C.A. (RIF: J-12345678-0).'
    },
    {
        id: 'LOG-104',
        fecha: '2026-08-22 05:00 PM',
        usuario: 'Sistema (Automático)',
        modulo: 'Seguridad',
        accion: 'Copia de Seguridad LAN',
        detalles: 'Respaldo automático de base de datos completado exitosamente (backup_20260822.sql).'
    }
];