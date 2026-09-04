import { ORDER_STATUS } from '../utils/status';
import { mockClientes } from './clientesData';
import { mockEquipos } from './equiposData';

export const CLIENTES_MOCK = mockClientes.reduce((acc, cliente) => {
    acc[cliente.cedulaRif] = {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
    };
    return acc;
}, {});

export const EQUIPOS_MOCK = mockEquipos.reduce((acc, equipo) => {
    acc[equipo.serial] = {
        marca: equipo.marca,
        modelo: equipo.modelo,
    };
    return acc;
}, {});
