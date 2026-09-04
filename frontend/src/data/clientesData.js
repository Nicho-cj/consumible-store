export const mockClientes = [
    {
        id: 1,
        nombre: 'Carlos Rodríguez',
        cedulaRif: 'V-18234567',
        telefono: '+58 414-1234567',
        email: 'carlos.rodriguez@email.com',
        direccion: 'Alta Vista, Puerto Ordaz',
        estado: 'ACTIVE',
    },
    {
        id: 2,
        nombre: 'María Gómez',
        cedulaRif: 'V-20112334',
        telefono: '+58 424-9876543',
        email: 'maria.gomez@email.com',
        direccion: '5 de Julio, Puerto Ordaz',
        estado: 'ACTIVE',
    },
    {
        id: 3,
        nombre: 'Inversiones C.A.',
        cedulaRif: 'J-40123987-0',
        telefono: '+58 286-9612233',
        email: 'contacto@inversiones.com',
        direccion: 'Zona Industrial Unare II, Puerto Ordaz',
        estado: 'ACTIVE',
    },
    {
        id: 4,
        nombre: 'Andrés López',
        cedulaRif: 'V-15987654',
        telefono: '+58 412-5554321',
        email: 'andres.lopez@email.com',
        direccion: 'Vista al Sol, Puerto Ordaz',
        estado: 'ACTIVE',
    },
    {
        id: 5,
        nombre: 'Lucía Fernández',
        cedulaRif: 'V-22341908',
        telefono: '+58 416-7778899',
        email: 'lucia.f@email.com',
        direccion: 'Paraguaipoa, Municipio Sifontes',
        estado: 'ACTIVE',
    },
    {
        id: 6,
        nombre: 'Pedro Perez',
        cedulaRif: 'V-11223344',
        telefono: '+58 414-0000000',
        email: 'pedro.perez@email.com',
        direccion: 'Caicara del Orinoco',
        estado: 'ACTIVE',
    },
];

export const getClienteById = (id) => mockClientes.find((c) => c.id === id);
export const getClienteByCedula = (cedula) => mockClientes.find((c) => c.cedulaRif === cedula);
