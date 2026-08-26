export const ORDER_STATUS = {
    RECIBIDO: 'Recibido',
    EN_DIAGNOSTICO: 'En Diagnóstico',
    ESPERANDO_APROBACION: 'Esperando Aprobación',
    EN_REPARACION: 'En Reparación',
    LISTO: 'Listo para Entregar',
    ENTREGADO: 'Entregado',
};

export const mockOrdenes = [
    {
        id: 1,
        codigo: 'ORD-2026-001',
        serial: 'SER-11029',
        cliente: 'Carlos Rodríguez',
        equipo: 'Epson L3110',
        fecha: '2026-08-20',
        estado: ORDER_STATUS.EN_DIAGNOSTICO
    },
    {
        id: 2,
        codigo: 'ORD-2026-002',
        serial: 'SER-990011',
        cliente: 'María Gómez',
        equipo: 'HP LaserJet M404dn',
        fecha: '2026-08-21',
        estado: ORDER_STATUS.RECIBIDO
    },
    {
        id: 3,
        codigo: 'ORD-2026-003',
        serial: 'SER-443322',
        cliente: 'Inversiones C.A.',
        equipo: 'Canon G3110',
        fecha: '2026-08-22',
        estado: ORDER_STATUS.ESPERANDO_APROBACION
    },
    {
        id: 4,
        codigo: 'ORD-2026-004',
        serial: 'SER-887711',
        cliente: 'Andrés López',
        equipo: 'POS-80 Printer',
        fecha: '2026-08-23',
        estado: ORDER_STATUS.EN_REPARACION
    },
    {
        id: 5,
        codigo: 'ORD-2026-000',
        serial: 'SER-000000',
        cliente: 'Pedro Perez',
        equipo: 'Epson L805',
        fecha: '2026-08-10',
        estado: ORDER_STATUS.ENTREGADO
    },
];