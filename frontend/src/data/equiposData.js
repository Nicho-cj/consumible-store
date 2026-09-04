export const mockEquipos = [
    {
        id: 1,
        serial: 'X3K891234',
        tipo: 'Impresora Multifuncional',
        marca: 'Epson',
        modelo: 'EcoTank L3110',
        descripcion: 'Multifuncional de inyección continua, dúplex manual.',
        clienteId: 1,
        cliente: 'Carlos Rodríguez',
        contadorBN: 12450,
        contadorColor: 8300,
    },
    {
        id: 2,
        serial: 'CND8K22019',
        tipo: 'Impresora Láser',
        marca: 'HP',
        modelo: 'LaserJet Pro M404dn',
        descripcion: 'Láser monocromática departamental, dúplex automático.',
        clienteId: 2,
        cliente: 'María Gómez',
        contadorBN: 18450,
        contadorColor: 0,
    },
    {
        id: 3,
        serial: 'BMN99012',
        tipo: 'Impresora Tinta Continua',
        marca: 'Canon',
        modelo: 'Pixma G3110',
        descripcion: 'Impresora multifuncional con sistema de tinta continua.',
        clienteId: 3,
        cliente: 'Inversiones C.A.',
        contadorBN: 6700,
        contadorColor: 4200,
    },
    {
        id: 4,
        serial: 'POS80-9982',
        tipo: 'Impresora Térmica',
        marca: 'Generic',
        modelo: 'POS-80 Printer',
        descripcion: 'Impresora térmica de tickets con cortador automático.',
        clienteId: 4,
        cliente: 'Andrés López',
        contadorBN: 32100,
        contadorColor: 0,
    },
    {
        id: 5,
        serial: 'HST-11029',
        tipo: 'Computadora Portátil',
        marca: 'Dell',
        modelo: 'Inspiron 15',
        descripcion: 'Laptop de oficina, mantenimiento preventivo general.',
        clienteId: 5,
        cliente: 'Lucía Fernández',
        contadorBN: 0,
        contadorColor: 0,
    },
    {
        id: 6,
        serial: 'SER-000000',
        tipo: 'Impresora Fotográfica',
        marca: 'Epson',
        modelo: 'EcoTank L805',
        descripcion: 'Impresora fotográfica con 6 canales de tinta.',
        clienteId: 6,
        cliente: 'Pedro Perez',
        contadorBN: 9800,
        contadorColor: 15600,
    },
];

export const getEquipoBySerial = (serial) => mockEquipos.find((e) => e.serial === serial);
export const getEquiposByClienteId = (clienteId) => mockEquipos.filter((e) => e.clienteId === clienteId);

export const EQUIPOS_MOCK = mockEquipos.reduce((acc, equipo) => {
    acc[equipo.serial] = equipo;
    return acc;
}, {});
