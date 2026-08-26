export const mockEquipos = [
    {
        id: 1,
        serial: 'SER-KY2040-001',
        tipo: 'Multifuncional / Fotocopiadora',
        marca: 'Kyocera',
        modelo: 'ECOSYS M2040dn',
        descripcion: 'Dúplex, Red, Bandeja 250h. Tóner TK-1175.',
        cliente: 'DellAcuatica CA',
        cedulaRif: 'J-12345678-0',
        contadorBN: 45210,
        contadorColor: 0,
        historial: [
            {
                orden: 'ORD-2026-088',
                fecha: '2026-08-15',
                tipo: 'Correctivo',
                tecnico: 'J. Medina',
                diagnostico: 'Atasco en bandeja 1. Limpieza y cambio de rodillo de arrastre.',
                repuestos: 'Pickup Roller Kit',
                contador: 45210
            },
            {
                orden: 'ORD-2026-012',
                fecha: '2026-03-02',
                tipo: 'Preventivo',
                tecnico: 'R. Saavedra',
                diagnostico: 'Mantenimiento preventivo por ciclo 30K y recarga.',
                repuestos: 'Tóner TK-1175',
                contador: 30150
            }
        ]
    },
    {
        id: 2,
        serial: 'SER-HP404-998',
        tipo: 'Impresora Láser',
        marca: 'HP',
        modelo: 'LaserJet Pro M404dn',
        descripcion: 'Láser monocromática departamental.',
        cliente: 'Nexus Corp',
        cedulaRif: 'V-80012234-9',
        contadorBN: 18450,
        contadorColor: 0,
        historial: [
            {
                orden: 'ORD-2026-064',
                fecha: '2026-07-22',
                tipo: 'Preventivo',
                tecnico: 'J. Medina',
                diagnostico: 'Mantenimiento y cambio de cartucho de tóner.',
                repuestos: 'Tóner HP 58A',
                contador: 18450
            }
        ]
    },
    {
        id: 3,
        serial: 'SER-EPS-L3110',
        tipo: 'Tinta Continua',
        marca: 'Epson',
        modelo: 'EcoTank L3110',
        descripcion: 'Multifuncional de inyección continua.',
        cliente: 'Oak Valley Clinic',
        cedulaRif: 'V-12345678',
        contadorBN: 8900,
        contadorColor: 14200,
        historial: []
    }
];

// Diccionario indexado por serial para búsquedas rápidas (O(1))
export const EQUIPOS_MOCK = mockEquipos.reduce((acc, equipo) => {
    acc[equipo.serial] = equipo;
    return acc;
}, {});