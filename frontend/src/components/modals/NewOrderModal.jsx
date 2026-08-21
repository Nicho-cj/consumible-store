import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Search, CheckCircle2 } from 'lucide-react';

// Base de datos simulada de prueba para autocompletar
const CLIENTES_MOCK = {
    'V-12345678': { nombre: 'Jesús Saavedra', telefono: '0414-1234567', direccion: 'Puerto Ordaz, Bolívar' }
};

const EQUIPOS_MOCK = {
    'SER-990011': { marca: 'HP', modelo: 'LaserJet Pro M404dn' }
};

const NewOrderModal = ({ isOpen, onClose, onSubmit }) => {
    // Estado Datos del Cliente
    const [cedulaRif, setCedulaRif] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [clienteEncontrado, setClienteEncontrado] = useState(false);

    // Estado Datos del Equipo
    const [serial, setSerial] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [falla, setFalla] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [equipoEncontrado, setEquipoEncontrado] = useState(false);

    // Buscar Cliente por Cedula/RIF
    const handleSearchCliente = () => {
        const cliente = CLIENTES_MOCK[cedulaRif.trim()];
        if (cliente) {
            setNombre(cliente.nombre);
            setTelefono(cliente.telefono);
            setDireccion(cliente.direccion);
            setClienteEncontrado(true);
        } else {
            setClienteEncontrado(false);
        }
    };

    // Buscar Equipo por Serial
    const handleSearchEquipo = () => {
        const equipo = EQUIPOS_MOCK[serial.trim()];
        if (equipo) {
            setMarca(equipo.marca);
            setModelo(equipo.modelo);
            setEquipoEncontrado(true);
        } else {
            setEquipoEncontrado(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevaOrden = {
            cliente: { cedulaRif, nombre, telefono, direccion },
            equipo: { serial, marca, modelo, falla, observaciones }
        };
        onSubmit(nuevaOrden);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nueva Órden de Servicio" maxWidth="max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECCIÓN: Datos del Cliente */}
                <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 border-b border-[#E2E8F0] pb-1">
                        1. Datos del Cliente
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-2 items-end">
                            <Input
                                label="Cédula / RIF"
                                placeholder="Ej. V-12345678"
                                value={cedulaRif}
                                onChange={(e) => setCedulaRif(e.target.value)}
                                required
                            />
                            <Button type="button" variant="secondary" icon={Search} onClick={handleSearchCliente}>
                                Buscar
                            </Button>
                        </div>

                        <Input
                            label="Nombre Completo"
                            placeholder="Nombre del cliente"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />

                        <Input
                            label="Número de Contacto"
                            placeholder="Ej. 0414-0000000"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />

                        <Input
                            label="Dirección"
                            placeholder="Dirección del cliente"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </div>

                    {clienteEncontrado && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Cliente registrado encontrado y autocompletado.
                        </p>
                    )}
                </div>

                {/* SECCIÓN: Datos del Equipo */}
                <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 border-b border-[#E2E8F0] pb-1">
                        2. Datos del Equipo
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex gap-2 items-end col-span-1 md:col-span-3">
                            <Input
                                label="Número de Serial"
                                placeholder="Ej. SER-990011"
                                value={serial}
                                onChange={(e) => setSerial(e.target.value)}
                                required
                            />
                            <Button type="button" variant="secondary" icon={Search} onClick={handleSearchEquipo}>
                                Buscar Serial
                            </Button>
                        </div>

                        <Input
                            label="Marca"
                            placeholder="Ej. Epson, HP, Canon"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            required
                        />

                        <Input
                            label="Modelo"
                            placeholder="Ej. L3110"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            required
                        />

                        <div className="col-span-1 md:col-span-3">
                            <Input
                                label="Falla Reportada"
                                placeholder="Describe la falla indicada por el cliente..."
                                value={falla}
                                onChange={(e) => setFalla(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-1 md:col-span-3 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700">Observaciones / Estado Físico</label>
                            <textarea
                                rows={2}
                                placeholder="Cargador original, rayones en la carcasa, sin cable de datos..."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md p-3 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {equipoEncontrado && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Historial del equipo encontrado y autocompletado.
                        </p>
                    )}
                </div>

                {/* Acciones Finales del Formulario */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar Orden de Servicio
                    </Button>
                </div>

            </form>
        </Modal>
    );
};

export default NewOrderModal;