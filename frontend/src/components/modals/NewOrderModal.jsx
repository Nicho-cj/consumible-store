import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Search, CheckCircle2 } from 'lucide-react';
import { CLIENTES_MOCK, EQUIPOS_MOCK } from '../../data/modalData';
import { sanitizeDocumentNumber } from '../../utils/text';

const COUNTRY_CODES = [
    { code: '+58', country: 'VE', name: 'Venezuela (+58)' },
    { code: '+57', country: 'CO', name: 'Colombia (+57)' },
    { code: '+1', country: 'US/CA', name: 'USA / Canadá (+1)' },
    { code: '+34', country: 'ES', name: 'España (+34)' },
    { code: '+56', country: 'CL', name: 'Chile (+56)' },
    { code: '+54', country: 'AR', name: 'Argentina (+54)' },
    { code: '+51', country: 'PE', name: 'Perú (+51)' },
    { code: '+593', country: 'EC', name: 'Ecuador (+593)' },
    { code: '+507', country: 'PA', name: 'Panamá (+507)' },
    { code: '+52', country: 'MX', name: 'México (+52)' },
    { code: '+55', country: 'BR', name: 'Brasil (+55)' },
    { code: '+591', country: 'BO', name: 'Bolivia (+591)' },
    { code: '+598', country: 'UY', name: 'Uruguay (+598)' },
];

const NewOrderModal = ({ isOpen, onClose, onSubmit }) => {
    // Estado Datos del Cliente
    const [tipoDoc, setTipoDoc] = useState('V');
    const [numeroDoc, setNumeroDoc] = useState('');
    const [nombre, setNombre] = useState('');
    const [codigoPais, setCodigoPais] = useState('+58');
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

    // Estado Asignación
    const [tecnicoId, setTecnicoId] = useState('');

    // Sanitización en tiempo real al tipear el documento
    const handleNumeroDocChange = (e) => {
        setNumeroDoc(sanitizeDocumentNumber(e.target.value));
    };

    // Buscar Cliente por Cédula/RIF
    const handleSearchCliente = () => {
        const fullCedula = `${tipoDoc}-${numeroDoc}`.trim();
        const cliente = CLIENTES_MOCK[fullCedula];

        if (cliente) {
            setNombre(cliente.nombre);
            setDireccion(cliente.direccion);

            if (cliente.telefono) {
                let tel = cliente.telefono.trim();
                const matchedCode = COUNTRY_CODES.find(c => tel.startsWith(c.code));
                if (matchedCode) {
                    setCodigoPais(matchedCode.code);
                    tel = tel.replace(matchedCode.code, '').trim();
                } else {
                    setCodigoPais('+58');
                }
                tel = tel.replace(/^0+/, '');
                setTelefono(tel);
            } else {
                setTelefono('');
            }

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

    const resetForm = () => {
        setTipoDoc('V');
        setNumeroDoc('');
        setNombre('');
        setCodigoPais('+58');
        setTelefono('');
        setDireccion('');
        setClienteEncontrado(false);
        setSerial('');
        setMarca('');
        setModelo('');
        setFalla('');
        setObservaciones('');
        setEquipoEncontrado(false);
        setTecnicoId('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanTel = telefono.trim().replace(/^0+/, '');
        const telefonoCompleto = cleanTel ? `${codigoPais} ${cleanTel}` : '';
        const cedulaRifCompleta = `${tipoDoc}-${numeroDoc}`.trim();

        const nuevaOrden = {
            cliente: { cedulaRif: cedulaRifCompleta, nombre, telefono: telefonoCompleto, direccion },
            equipo: { serial, marca, modelo, falla, observaciones },
            tecnicoId
        };
        onSubmit(nuevaOrden);
        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Nueva Orden de Servicio" maxWidth="max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECCIÓN: Datos del Cliente */}
                <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 border-b border-[#E2E8F0] pb-1">
                        1. Datos del Cliente
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selector de Tipo de Documento + Cédula/RIF */}
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-xs font-semibold text-slate-700">
                                Cédula / RIF
                            </label>
                            <div className="flex w-full items-center">
                                <select
                                    value={tipoDoc}
                                    onChange={(e) => setTipoDoc(e.target.value)}
                                    className="bg-slate-50 border border-r-0 border-[#E2E8F0] text-xs font-bold text-slate-700 rounded-l-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent cursor-pointer transition-all shrink-0"
                                >
                                    <option value="V">V-</option>
                                    <option value="J">J-</option>
                                    <option value="G">G-</option>
                                    <option value="E">E-</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="12345678"
                                    value={numeroDoc}
                                    onChange={handleNumeroDocChange}
                                    required
                                    className="w-full bg-white border border-r-0 border-[#E2E8F0] text-xs text-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all placeholder:text-slate-400 font-mono uppercase"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    icon={Search}
                                    onClick={handleSearchCliente}
                                    className="rounded-l-none rounded-r-md"
                                >
                                    Buscar
                                </Button>
                            </div>
                        </div>

                        <Input
                            label="Nombre Completo"
                            placeholder="Nombre del cliente"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />

                        {/* Selector de Código de País + Teléfono */}
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-xs font-semibold text-slate-700">
                                Número de Contacto (WhatsApp)
                            </label>
                            <div className="flex w-full">
                                <select
                                    value={codigoPais}
                                    onChange={(e) => setCodigoPais(e.target.value)}
                                    className="bg-slate-50 border border-r-0 border-[#E2E8F0] text-xs font-semibold text-slate-700 rounded-l-md px-2 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent cursor-pointer transition-all shrink-0"
                                >
                                    {COUNTRY_CODES.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.code} ({item.country})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    placeholder="Ej. 414-1234567"
                                    value={telefono}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (val.startsWith('0')) {
                                            val = val.substring(1);
                                        }
                                        setTelefono(val);
                                    }}
                                    required
                                    className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-r-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <span className="text-[10px] text-slate-400">
                                Ingrese sin el cero inicial (Ej. 4141234567)
                            </span>
                        </div>

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

                {/* SECCIÓN: Asignación de Técnico */}
                <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 border-b border-[#E2E8F0] pb-1">
                        3. Asignación Inicial
                    </h4>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Asignar Técnico Responsable
                        </label>
                        <select
                            name="tecnicoId"
                            value={tecnicoId}
                            onChange={(e) => setTecnicoId(e.target.value)}
                            className="w-full bg-white text-xs font-medium text-slate-800 p-2.5 border border-[#E2E8F0] rounded-md outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all"
                        >
                            <option value="">-- Seleccionar Técnico (Opcional) --</option>
                            <option value="1">Dario Jose Jimenez (Técnico)</option>
                            <option value="2">Jesús Saavedra (Técnico)</option>
                            <option value="3">Hector Luis Rodriguez (Técnico)</option>
                        </select>
                    </div>
                </div>

                {/* Acciones Finales del Formulario */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                    <Button type="button" variant="secondary" onClick={handleClose}>
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