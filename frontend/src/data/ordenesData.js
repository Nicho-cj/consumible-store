import { ORDER_STATUS } from '../utils/status';

export { ORDER_STATUS };

export const mockOrdenes = [
    {
        id: 1,
        codigo: 'ORD-2026-001',
        fechaIngreso: '2026-08-24',
        fechaEntregado: '2026-08-28',

        clienteId: 1,
        clienteNombre: 'Carlos Rodríguez',
        clienteCedulaRif: 'V-18234567',
        clienteTelefono: '+58 414-1234567',
        clienteEmail: 'carlos.rodriguez@email.com',

        equipoModelo: 'Epson EcoTank L3110',
        tipoEquipo: 'Impresora Multifuncional',
        equipoSerie: 'X3K891234',
        equipoMarca: 'Epson',

        fallaReportada: 'No enciende tras apagón eléctrico y huele a quemado.',
        diagnosticoInicial: 'No enciende tras apagón eléctrico y huele a quemado.',
        diagnostico: 'Tarjeta lógica dañada por sobrevoltaje y fusible quemado.',
        observacionesFisicas: 'Cargador original, sin cable USB, carcasa rayada en el lateral derecho.',
        accesorios: 'Cable de poder, cable USB y bandeja de papel.',

        tecnicoId: 1,
        tecnicoAsignado: 'Hector Luis Rodriguez',

        estado: ORDER_STATUS.ENTREGADO,

        contadorInicial: 12450,
        contadorFinal: 12500,
        montoCobro: 85.0,

        repuestosUsados: [
            { id: 'rep-1', nombre: 'Tarjeta Lógica L3110', cantidad: 1 },
        ],
    },
    {
        id: 2,
        codigo: 'ORD-2026-002',
        fechaIngreso: '2026-08-25',
        fechaEntregado: null,

        clienteId: 2,
        clienteNombre: 'María Gómez',
        clienteCedulaRif: 'V-20112334',
        clienteTelefono: '+58 424-9876543',
        clienteEmail: 'maria.gomez@email.com',

        equipoModelo: 'HP LaserJet Pro M404dn',
        tipoEquipo: 'Impresora Láser',
        equipoSerie: 'CND8K22019',
        equipoMarca: 'HP',

        fallaReportada: 'Atasco constante de papel en la bandeja 2 al imprimir más de 5 páginas.',
        diagnosticoInicial: 'Atasco constante de papel en la bandeja 2 al imprimir más de 5 páginas.',
        diagnostico: 'Rodillos de alimentación desgastados y sensor de papel sucio.',
        observacionesFisicas: 'Equipo completo con tóner usado instalado.',
        accesorios: 'Toner instalado, sin cables.',

        tecnicoId: 2,
        tecnicoAsignado: 'Dario Jose Jimenez',

        estado: ORDER_STATUS.EN_DIAGNOSTICO,

        contadorInicial: 18450,
        contadorFinal: null,
        montoCobro: null,

        repuestosUsados: [],
    },
    {
        id: 3,
        codigo: 'ORD-2026-003',
        fechaIngreso: '2026-08-25',
        fechaEntregado: null,

        clienteId: 3,
        clienteNombre: 'Inversiones C.A.',
        clienteCedulaRif: 'J-40123987-0',
        clienteTelefono: '+58 286-9612233',
        clienteEmail: 'contacto@inversiones.com',

        equipoModelo: 'Canon Pixma G3110',
        tipoEquipo: 'Impresora Tinta Continua',
        equipoSerie: 'BMN99012',
        equipoMarca: 'Canon',

        fallaReportada: 'Imprime con líneas blancas verticales en el color negro.',
        diagnosticoInicial: 'Imprime con líneas blancas verticales en el color negro.',
        diagnostico: 'Cabezal negro obstruido parcialmente y falta de purgado.',
        observacionesFisicas: 'Caja original y transformador.',
        accesorios: 'Caja original y transformador.',

        tecnicoId: 2,
        tecnicoAsignado: 'Dario Jose Jimenez',

        estado: ORDER_STATUS.SOLUCION_COTIZACION,

        contadorInicial: 6700,
        contadorFinal: null,
        montoCobro: null,

        repuestosUsados: [
            { id: 'rep-2', nombre: 'Líquido Limpiador de Cabezal 100ml', cantidad: 1 },
        ],
    },
    {
        id: 4,
        codigo: 'ORD-2026-004',
        fechaIngreso: '2026-08-26',
        fechaEntregado: null,

        clienteId: 4,
        clienteNombre: 'Andrés López',
        clienteCedulaRif: 'V-15987654',
        clienteTelefono: '+58 412-5554321',
        clienteEmail: 'andres.lopez@email.com',

        equipoModelo: 'Thermal Printer POS-80',
        tipoEquipo: 'Impresora Térmica',
        equipoSerie: 'POS80-9982',
        equipoMarca: 'Generic',

        fallaReportada: 'El cortador automático de papel se traba al finalizar la impresión del ticket.',
        diagnosticoInicial: 'El cortador automático de papel se traba al finalizar la impresión del ticket.',
        diagnostico: 'Engranaje de corte con residuos de papel y desalineado.',
        observacionesFisicas: 'Fuente de alimentación 24V incluida.',
        accesorios: 'Fuente de alimentación 24V.',

        tecnicoId: 4,
        tecnicoAsignado: 'Eloy',

        estado: ORDER_STATUS.PROCESO_TECNICO,

        contadorInicial: 32100,
        contadorFinal: null,
        montoCobro: null,

        repuestosUsados: [
            { id: 'rep-3', nombre: 'Engranaje de Guillotina POS-80', cantidad: 1 },
        ],
    },
    {
        id: 5,
        codigo: 'ORD-2026-005',
        fechaIngreso: '2026-08-26',
        fechaEntregado: null,

        clienteId: 5,
        clienteNombre: 'Lucía Fernández',
        clienteCedulaRif: 'V-22341908',
        clienteTelefono: '+58 416-7778899',
        clienteEmail: 'lucia.f@email.com',

        equipoModelo: 'Laptop Dell Inspiron 15',
        tipoEquipo: 'Computadora Portátil',
        equipoSerie: 'HST-11029',
        equipoMarca: 'Dell',

        fallaReportada: 'Mantenimiento preventivo general, limpieza interna y cambio de pasta térmica.',
        diagnosticoInicial: 'Mantenimiento preventivo general, limpieza interna y cambio de pasta térmica.',
        diagnostico: 'Mantenimiento preventivo concluido satisfactoriamente.',
        observacionesFisicas: 'Cargador original.',
        accesorios: 'Cargador original.',

        tecnicoId: 1,
        tecnicoAsignado: 'Hector Luis Rodriguez',

        estado: ORDER_STATUS.LISTO_ENTREGA,

        contadorInicial: 0,
        contadorFinal: 0,
        montoCobro: 35.0,

        repuestosUsados: [
            { id: 'rep-4', nombre: 'Pasta Térmica Artic MX-4 (0.5g)', cantidad: 1 },
        ],
    },
    {
        id: 6,
        codigo: 'ORD-2026-000',
        fechaIngreso: '2026-08-10',
        fechaEntregado: '2026-08-15',

        clienteId: 6,
        clienteNombre: 'Pedro Perez',
        clienteCedulaRif: 'V-11223344',
        clienteTelefono: '+58 414-0000000',
        clienteEmail: 'pedro.perez@email.com',

        equipoModelo: 'Epson EcoTank L805',
        tipoEquipo: 'Impresora Fotográfica',
        equipoSerie: 'SER-000000',
        equipoMarca: 'Epson',

        fallaReportada: 'Mantenimiento del módulo de tracción de CD/DVD.',
        diagnosticoInicial: 'Mantenimiento del módulo de tracción de CD/DVD.',
        diagnostico: 'Calibración de sensor de charola y lubricación.',
        observacionesFisicas: 'Bandeja de CD original.',
        accesorios: 'Bandeja de CD original.',

        tecnicoId: 3,
        tecnicoAsignado: 'Domingo',

        estado: ORDER_STATUS.ENTREGADO,

        contadorInicial: 9800,
        contadorFinal: 9850,
        montoCobro: 50.0,

        repuestosUsados: [],
    },
];

export const getOrdenesByTecnicoId = (tecnicoId) => {
    const idNum = typeof tecnicoId === 'string' ? parseInt(tecnicoId, 10) : tecnicoId;
    return mockOrdenes.filter((o) => o.tecnicoId === idNum);
};

export const getOrdenesActivasByClienteId = (clienteId) => {
    return mockOrdenes.filter(
        (o) =>
            o.clienteId === clienteId &&
            o.estado !== ORDER_STATUS.ENTREGADO &&
            o.estado !== ORDER_STATUS.CANCELADO
    );
};

export const getHistorialBySerial = (serial) => {
    return mockOrdenes
        .filter((o) => o.equipoSerie === serial)
        .sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso))
        .map((o) => ({
            orden: o.codigo,
            fecha: o.fechaEntregado || o.fechaIngreso,
            tipo: o.diagnosticoInicial ? 'Reparación' : 'Diagnóstico',
            tecnico: o.tecnicoAsignado,
            diagnostico: o.diagnostico || o.fallaReportada || 'Pendiente',
            repuestos: o.repuestosUsados?.length > 0
                ? o.repuestosUsados.map((r) => r.nombre).join(', ')
                : 'Ninguno',
            contador: o.contadorFinal || o.contadorInicial || 0,
            estado: o.estado,
        }));
};
