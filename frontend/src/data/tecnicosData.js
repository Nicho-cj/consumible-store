import { TECHNICIAN_STATUS } from '../utils/status';

export const mockTecnicos = [
    {
        id: 1,
        nombre: 'Hector Luis Rodriguez',
        cargo: 'Técnico',
        especialidad: 'Impresoras Epson / Multifuncionales',
        telefono: '+58 414-5551234',
        estado: TECHNICIAN_STATUS.ACTIVE,
    },
    {
        id: 2,
        nombre: 'Dario Jose Jimenez',
        cargo: 'Técnico',
        especialidad: 'Impresoras HP / Láser',
        telefono: '+58 424-5555678',
        estado: TECHNICIAN_STATUS.ACTIVE,
    },
    {
        id: 3,
        nombre: 'Domingo',
        cargo: 'Técnico',
        especialidad: 'Impresoras Canon / Tinta Continua',
        telefono: '+58 412-5559012',
        estado: TECHNICIAN_STATUS.ON_BREAK,
    },
    {
        id: 4,
        nombre: 'Eloy',
        cargo: 'Técnico',
        especialidad: 'Térmicas / POS / Equipos especiales',
        telefono: '+58 416-5553456',
        estado: TECHNICIAN_STATUS.OFF_DUTY,
    },
];

export const getTecnicoById = (id) => {
    const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    return mockTecnicos.find((t) => t.id === idNum);
};

export const getTecnicoNombre = (id) => {
    const tecnico = getTecnicoById(id);
    return tecnico ? tecnico.nombre : 'Sin Asignar';
};
