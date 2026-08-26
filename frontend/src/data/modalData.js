import { ORDER_STATUS } from '../utils/status';

// Mock de Clientes pre-registrados para autocompletado por Cédula/RIF
export const CLIENTES_MOCK = {
    'V-28611721': {
        nombre: 'Jesus Saavedra',
        telefono: '+58 414-1234567',
        direccion: 'Puerto Ordaz, Edo. Bolívar'
    },
    'J-12345678-0': {
        nombre: 'Inversiones C.A.',
        telefono: '+58 424-9876543',
        direccion: 'Zona Industrial Unare II, Puerto Ordaz'
    },
    'V-87654321': {
        nombre: 'Carlos Rodríguez',
        telefono: '+58 412-5554433',
        direccion: 'Alta Vista, Puerto Ordaz'
    },
    'J-[#97C719]-1': {
        nombre: 'Clínica Guayana',
        telefono: '+58 286-9301122',
        direccion: 'Av. Las Américas, Puerto Ordaz'
    }
};

// Mock de Equipos registrados para autocompletado por Número de Serial
export const EQUIPOS_MOCK = {
    'SER-990011': {
        marca: 'HP',
        modelo: 'LaserJet Pro M404dn'
    },
    'SER-11029': {
        marca: 'Epson',
        modelo: 'EcoTank L3110'
    },
    'SER-443322': {
        marca: 'Canon',
        modelo: 'PIXMA G3110'
    },
    'SER-776655': {
        marca: 'Zebra',
        modelo: 'ZD220'
    },
    'SER-000000': {
        marca: 'Epson',
        modelo: 'EcoTank L805'
    }
};

// Lista general de órdenes de servicio registradas
export const mockOrdenesData = [
    {
        id: 'ORD-2026-001',
        codigo: 'ORD-2026-001',
        fechaIngreso: '2026-08-10',
        fechaCierre: '2026-08-14',
        tecnico: 'Hector Luis Rodriguez',
        cliente: {
            cedulaRif: 'V-87654321',
            nombre: 'Carlos Rodríguez',
            telefono: '+58 412-5554433',
            direccion: 'Alta Vista, Puerto Ordaz'
        },
        equipo: {
            serial: 'SER-11029',
            marca: 'Epson',
            modelo: 'EcoTank L3110',
            falla: 'Inyectores tapados y almohadillas saturadas',
            observaciones: 'Incluye cables de alimentación y tanque lleno de tinta'
        },
        trabajoRealizado: 'Limpieza de cabezal y cambio de almohadillas',
        repuestosUsados: 'Almohadillas Epson L3110',
        montoTotal: 35.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 'ORD-2026-002',
        codigo: 'ORD-2026-002',
        fechaIngreso: '2026-08-12',
        fechaCierre: '2026-08-15',
        tecnico: 'Dario Jose Jimenez',
        cliente: {
            cedulaRif: 'V-12345678',
            nombre: 'Jesús Saavedra',
            telefono: '+58 414-1234567',
            direccion: 'Puerto Ordaz, Edo. Bolívar'
        },
        equipo: {
            serial: 'SER-990011',
            marca: 'HP',
            modelo: 'LaserJet Pro M404dn',
            falla: 'Atasco constante de papel en la bandeja principal',
            observaciones: 'Muestra desgaste evidente en los gomas de arrastre'
        },
        trabajoRealizado: 'Reemplazo de rodillo de arrastre (Pick-up roller)',
        repuestosUsados: 'Pick-up roller HP M404',
        montoTotal: 45.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 'ORD-2026-003',
        codigo: 'ORD-2026-003',
        fechaIngreso: '2026-08-13',
        fechaCierre: '2026-08-16',
        tecnico: 'Hector Luis Rodriguez',
        cliente: {
            cedulaRif: 'J-12345678-0',
            nombre: 'Inversiones C.A.',
            telefono: '+58 424-9876543',
            direccion: 'Zona Industrial Unare II, Puerto Ordaz'
        },
        equipo: {
            serial: 'SER-443322',
            marca: 'Canon',
            modelo: 'PIXMA G3110',
            falla: 'Mangueras del sistema continuo con aire',
            observaciones: 'Nivel de tinta bajo en el contenedor cian'
        },
        trabajoRealizado: 'Mantenimiento general de sistema continuo y purga de tintas',
        repuestosUsados: 'Ninguno',
        montoTotal: 25.0,
        estado: ORDER_STATUS.ENTREGADO
    },
    {
        id: 'ORD-2026-012',
        codigo: 'ORD-2026-012',
        fechaIngreso: '2026-08-22',
        fechaCierre: '2026-08-25',
        tecnico: 'Jesús Saavedra',
        cliente: {
            cedulaRif: 'J-[#97C719]-1',
            nombre: 'Clínica Guayana',
            telefono: '+58 286-9301122',
            direccion: 'Av. Las Américas, Puerto Ordaz'
        },
        equipo: {
            serial: 'SER-776655',
            marca: 'Zebra',
            modelo: 'ZD220',
            falla: 'No detecta la brecha de las etiquetas de código de barras',
            observaciones: 'Acumulación de pegamento en la superficie del cabezal'
        },
        trabajoRealizado: 'Limpieza de cabezal térmico y calibración de sensor de etiquetas',
        repuestosUsados: 'Ninguno',
        montoTotal: 30.0,
        estado: ORDER_STATUS.ENTREGADO
    }
];