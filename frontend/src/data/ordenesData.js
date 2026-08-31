export const ORDER_STATUS = {
    RECIBIDO: 'RECIBIDO',
    EN_DIAGNOSTICO: 'EN_DIAGNOSTICO',
    ESPERANDO_APROBACION: 'ESPERANDO_APROBACION',
    EN_REPARACION: 'EN_REPARACION',
    LISTO: 'LISTO',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO'
};

export const mockOrdenes = [
    {
        id: 1,
        codigo: 'ORD-2026-001',
        numeroOrden: 'ORD-2026-001',
        fechaIngreso: '24/08/2026',
        fechaEntregado: null,

        // Cliente
        clienteId: 'cli-101',
        clienteNombre: 'Carlos Rodríguez',
        clienteDocumento: 'V-18234567',
        clienteCedulaRif: 'V-18234567',
        clienteTelefono: '+58 414-1234567',
        clienteEmail: 'carlos.rodriguez@email.com',

        // Equipo
        equipoModelo: 'Epson EcoTank L3110',
        tipoEquipo: 'Impresora Multifuncional',
        equipoSerie: 'X3K891234',
        serial: 'X3K891234',
        equipoMarca: 'Epson',
        equipo: 'Epson L3110',

        // Falla y Observaciones
        fallaReportada: 'No enciende tras apagón eléctrico y huele a quemado.',
        diagnosticoInicial: 'No enciende tras apagón eléctrico y huele a quemado.',
        diagnostico: 'Tarjeta lógica dañada por sobrevoltaje y fusible quemado.',
        fallaReal: 'Tarjeta lógica dañada por sobrevoltaje y fusible quemado.',
        observacionesFisicas: 'Cargador original, sin cable USB, carcasa rayada en el lateral derecho.',
        accesorios: 'Cable de poder, cable USB y bandeja de papel.',

        // Asignación Técnica
        tecnicoId: '2',
        tecnicoNombre: 'Jesús Saavedra',
        tecnicoAsignado: 'Jesús Saavedra',

        // Estatus
        estado: ORDER_STATUS.EN_DIAGNOSTICO,
        estatus: 'En Diagnóstico',

        // Repuestos Consumidos (Solo control técnico)
        repuestosUsados: [
            { id: 'rep-1', nombre: 'Tarjeta Lógica L3110', descripcion: 'Tarjeta Lógica L3110', cantidad: 1 }
        ],
        repuestos: [
            { id: 'rep-1', nombre: 'Tarjeta Lógica L3110', descripcion: 'Tarjeta Lógica L3110', cantidad: 1 }
        ]
    },
    {
        id: 2,
        codigo: 'ORD-2026-002',
        numeroOrden: 'ORD-2026-002',
        fechaIngreso: '25/08/2026',
        fechaEntregado: null,

        // Cliente
        clienteId: 'cli-102',
        clienteNombre: 'María Gómez',
        clienteDocumento: 'V-20112334',
        clienteCedulaRif: 'V-20112334',
        clienteTelefono: '+58 424-9876543',
        clienteEmail: 'maria.gomez@email.com',

        // Equipo
        equipoModelo: 'HP LaserJet Pro M404dn',
        tipoEquipo: 'Impresora Láser',
        equipoSerie: 'CND8K22019',
        serial: 'CND8K22019',
        equipoMarca: 'HP',
        equipo: 'HP LaserJet M404dn',

        // Falla y Observaciones
        fallaReportada: 'Atasco constante de papel en la bandeja 2 al imprimir más de 5 páginas.',
        diagnosticoInicial: 'Atasco constante de papel en la bandeja 2 al imprimir más de 5 páginas.',
        diagnostico: '',
        fallaReal: '',
        observacionesFisicas: 'Equipo completo con tóner usado instalado.',
        accesorios: 'Toner instalado, sin cables.',

        // Asignación Técnica
        tecnicoId: '1',
        tecnicoNombre: 'Carlos Mendoza',
        tecnicoAsignado: 'Carlos Mendoza',

        // Estatus
        estado: ORDER_STATUS.RECIBIDO,
        estatus: 'Recibido',

        // Repuestos Consumidos
        repuestosUsados: [],
        repuestos: []
    },
    {
        id: 3,
        codigo: 'ORD-2026-003',
        numeroOrden: 'ORD-2026-003',
        fechaIngreso: '25/08/2026',
        fechaEntregado: null,

        // Cliente
        clienteId: 'cli-103',
        clienteNombre: 'Inversiones C.A.',
        clienteDocumento: 'J-40123987-0',
        clienteCedulaRif: 'J-40123987-0',
        clienteTelefono: '+58 286-9612233',
        clienteEmail: 'contacto@inversiones.com',

        // Equipo
        equipoModelo: 'Canon Pixma G3110',
        tipoEquipo: 'Impresora Tinta Continua',
        equipoSerie: 'BMN99012',
        serial: 'BMN99012',
        equipoMarca: 'Canon',
        equipo: 'Canon G3110',

        // Falla y Observaciones
        fallaReportada: 'Imprime con líneas blancas verticales en el color negro.',
        diagnosticoInicial: 'Imprime con líneas blancas verticales en el color negro.',
        diagnostico: 'Cabezal negro obstruido parcialmente y falta de purgado.',
        fallaReal: 'Cabezal negro obstruido parcialmente y falta de purgado.',
        observacionesFisicas: 'Caja original y transformador.',
        accesorios: 'Caja original y transformador.',

        // Asignación Técnica
        tecnicoId: '2',
        tecnicoNombre: 'Jesús Saavedra',
        tecnicoAsignado: 'Jesús Saavedra',

        // Estatus
        estado: ORDER_STATUS.ESPERANDO_APROBACION,
        estatus: 'Esperando Aprobación',

        // Repuestos Consumidos
        repuestosUsados: [
            { id: 'rep-2', nombre: 'Líquido Limpiador de Cabezal 100ml', descripcion: 'Líquido Limpiador de Cabezal 100ml', cantidad: 1 }
        ],
        repuestos: [
            { id: 'rep-2', nombre: 'Líquido Limpiador de Cabezal 100ml', descripcion: 'Líquido Limpiador de Cabezal 100ml', cantidad: 1 }
        ]
    },
    {
        id: 4,
        codigo: 'ORD-2026-004',
        numeroOrden: 'ORD-2026-004',
        fechaIngreso: '26/08/2026',
        fechaEntregado: null,

        // Cliente
        clienteId: 'cli-104',
        clienteNombre: 'Andrés López',
        clienteDocumento: 'V-15987654',
        clienteCedulaRif: 'V-15987654',
        clienteTelefono: '+58 412-5554321',
        clienteEmail: 'andres.lopez@email.com',

        // Equipo
        equipoModelo: 'Thermal Printer POS-80',
        tipoEquipo: 'Impresora Térmica',
        equipoSerie: 'POS80-9982',
        serial: 'POS80-9982',
        equipoMarca: 'Generic',
        equipo: 'POS-80 Printer',

        // Falla y Observaciones
        fallaReportada: 'El cortador automático de papel se traba al finalizar la impresión del ticket.',
        diagnosticoInicial: 'El cortador automático de papel se traba al finalizar la impresión del ticket.',
        diagnostico: 'Engranaje de corte con residuos de papel y desalineado.',
        fallaReal: 'Engranaje de corte con residuos de papel y desalineado.',
        observacionesFisicas: 'Fuente de alimentación 24V incluida.',
        accesorios: 'Fuente de alimentación 24V.',

        // Asignación Técnica
        tecnicoId: '2',
        tecnicoNombre: 'Jesús Saavedra',
        tecnicoAsignado: 'Jesús Saavedra',

        // Estatus
        estado: ORDER_STATUS.EN_REPARACION,
        estatus: 'En Reparación',

        // Repuestos Consumidos
        repuestosUsados: [
            { id: 'rep-3', nombre: 'Engranaje de Guillotina POS-80', descripcion: 'Engranaje de Guillotina POS-80', cantidad: 1 }
        ],
        repuestos: [
            { id: 'rep-3', nombre: 'Engranaje de Guillotina POS-80', descripcion: 'Engranaje de Guillotina POS-80', cantidad: 1 }
        ]
    },
    {
        id: 5,
        codigo: 'ORD-2026-005',
        numeroOrden: 'ORD-2026-005',
        fechaIngreso: '26/08/2026',
        fechaEntregado: null,

        // Cliente
        clienteId: 'cli-105',
        clienteNombre: 'Lucía Fernández',
        clienteDocumento: 'V-22341908',
        clienteCedulaRif: 'V-22341908',
        clienteTelefono: '+58 416-7778899',
        clienteEmail: 'lucia.f@email.com',

        // Equipo
        equipoModelo: 'Laptop Dell Inspiron 15',
        tipoEquipo: 'Computadora Portátil',
        equipoSerie: 'HST-11029',
        serial: 'HST-11029',
        equipoMarca: 'Dell',
        equipo: 'Dell Inspiron 15',

        // Falla y Observaciones
        fallaReportada: 'Mantenimiento preventivo general, limpieza interna y cambio de pasta térmica.',
        diagnosticoInicial: 'Mantenimiento preventivo general, limpieza interna y cambio de pasta térmica.',
        diagnostico: 'Mantenimiento preventivo concluido satisfactoriamente.',
        fallaReal: 'Mantenimiento preventivo concluido satisfactoriamente.',
        observacionesFisicas: 'Cargador original.',
        accesorios: 'Cargador original.',

        // Asignación Técnica
        tecnicoId: '2',
        tecnicoNombre: 'Jesús Saavedra',
        tecnicoAsignado: 'Jesús Saavedra',

        // Estatus
        estado: ORDER_STATUS.LISTO,
        estatus: 'Listo',

        // Repuestos Consumidos
        repuestosUsados: [
            { id: 'rep-4', nombre: 'Pasta Térmica Artic MX-4 (0.5g)', descripcion: 'Pasta Térmica Artic MX-4 (0.5g)', cantidad: 1 }
        ],
        repuestos: [
            { id: 'rep-4', nombre: 'Pasta Térmica Artic MX-4 (0.5g)', descripcion: 'Pasta Térmica Artic MX-4 (0.5g)', cantidad: 1 }
        ]
    },
    {
        id: 6,
        codigo: 'ORD-2026-000',
        numeroOrden: 'ORD-2026-000',
        fechaIngreso: '10/08/2026',
        fechaEntregado: '15/08/2026',

        // Cliente
        clienteId: 'cli-106',
        clienteNombre: 'Pedro Perez',
        clienteDocumento: 'V-11223344',
        clienteCedulaRif: 'V-11223344',
        clienteTelefono: '+58 414-0000000',
        clienteEmail: 'pedro.perez@email.com',

        // Equipo
        equipoModelo: 'Epson EcoTank L805',
        tipoEquipo: 'Impresora Fotográfica',
        equipoSerie: 'SER-000000',
        serial: 'SER-000000',
        equipoMarca: 'Epson',
        equipo: 'Epson L805',

        // Falla y Observaciones
        fallaReportada: 'Mantenimiento del módulo de tracción de CD/DVD.',
        diagnosticoInicial: 'Mantenimiento del módulo de tracción de CD/DVD.',
        diagnostico: 'Calibración de sensor de charola y lubricación.',
        fallaReal: 'Calibración de sensor de charola y lubricación.',
        observacionesFisicas: 'Bandeja de CD original.',
        accesorios: 'Bandeja de CD original.',

        // Asignación Técnica
        tecnicoId: '1',
        tecnicoNombre: 'Carlos Mendoza',
        tecnicoAsignado: 'Carlos Mendoza',

        // Estatus
        estado: ORDER_STATUS.ENTREGADO,
        estatus: 'Entregado',

        // Repuestos Consumidos
        repuestosUsados: [],
        repuestos: []
    }
];

export const MOCK_ORDENES = mockOrdenes;