export const mockTecnicos = [
    {
        id: 1,
        nombre: 'Hector Luis Rodriguez',
        cargo: 'Técnico',
        estado: 'ACTIVE',
        ordenesActuales: [
            { codigo: 'ORD-2026-001', estatus: 'En Proceso' },
            { codigo: 'ORD-2026-004', estatus: 'Diagnóstico' },
        ],
    },
    {
        id: 2,
        nombre: 'Dario Jose Jimenez',
        cargo: 'Técnico',
        estado: 'ACTIVE',
        ordenesActuales: [
            { codigo: 'ORD-2026-002', estatus: 'En Proceso' },
        ],
    },
    {
        id: 3,
        nombre: 'Domingo',
        cargo: 'Técnico',
        estado: 'ON_BREAK',
        ordenesActuales: [
            { codigo: 'ORD-2026-009', estatus: 'En Espera' },
        ],
    },
    {
        id: 4,
        nombre: 'Eloy',
        cargo: 'Técnico',
        estado: 'OFF_DUTY',
        ordenesActuales: [],
    },
];