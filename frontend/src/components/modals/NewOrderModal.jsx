import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { sanitizeDocumentNumber } from '../../utils/text';
import { listClientes, listEquipos, listTecnicos, createCliente, createEquipo } from '../../api/entidades';

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
    const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);
    const [clienteId, setClienteId] = useState(null);

    // Estado Datos del Equipo
    const [serial, setSerial] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [falla, setFalla] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [equipoEncontrado, setEquipoEncontrado] = useState(false);
    const [equipoNoEncontrado, setEquipoNoEncontrado] = useState(false);
    const [equipoId, setEquipoId] = useState(null);

    // Estado Asignación
    const [tecnicoId, setTecnicoId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Catalogos cargados desde el backend cuando se abre el modal (FASE 5-1)
    const [catalogoClientes, setCatalogoClientes] = useState(null);
    const [catalogoEquipos, setCatalogoEquipos] = useState(null);
    const [tecnicos, setTecnicos] = useState(null);

    const loadingRegistros = isOpen && catalogoClientes === null;

    useEffect(() => {
        if (!isOpen) return;
        let cancel = false;
        Promise.all([listClientes(), listEquipos(), listTecnicos()])
            .then(([clientes, equipos, tecnicos]) => {
                if (cancel) return;
                setCatalogoClientes(clientes);
                setCatalogoEquipos(equipos);
                setTecnicos(tecnicos);
            })
            .catch((err) => {
                if (!cancel) console.error('Error cargando catálogos:', err);
            });
        return () => { cancel = true; };
    }, [isOpen]);

    // Sanitización en tiempo real al tipear el documento
    const handleNumeroDocChange = (e) => {
        setNumeroDoc(sanitizeDocumentNumber(e.target.value));
    };

    // Buscar Cliente por Cédula/RIF contra el backend
    const handleSearchCliente = () => {
        if (!catalogoClientes) return;
        const fullCedula = `${tipoDoc}-${numeroDoc}`.toUpperCase().trim();
        const cliente = catalogoClientes.find((c) => c.cedulaRif.toUpperCase() === fullCedula);

        if (cliente) {
            setNombre(cliente.nombre);
            setDireccion(cliente.direccion);
            setClienteId(cliente.id);

            if (cliente.telefono) {
                let tel = cliente.telefono.trim();
                const matchedCode = COUNTRY_CODES.find(c => tel.startsWith(c.code));
                if (matchedCode) {
                    setCodigoPais(matchedCode.code);
                    tel = tel.replace(matchedCode.code, '').trim();
                } else {
                    setCodigoPais('+58');
                    tel = tel.replace(/^\+58\s?/, '').trim();
                }
                tel = tel.replace(/^0+/, '');
                setTelefono(tel);
            } else {
                setTelefono('');
            }

            setClienteEncontrado(true);
            setClienteNoEncontrado(false);
        } else {
            setClienteId(null);
            setClienteEncontrado(false);
            setClienteNoEncontrado(true);
        }
    };

    // Buscar Equipo por Serial contra el backend
    const handleSearchEquipo = () => {
        if (!catalogoEquipos) return;
        const serialBusqueda = serial.trim().toUpperCase();
        const equipo = catalogoEquipos.find((eq) => eq.serial.toUpperCase() === serialBusqueda);

        if (equipo) {
            setMarca(equipo.marca);
            setModelo(equipo.modelo);
            setEquipoId(equipo.id);
            setEquipoEncontrado(true);
            setEquipoNoEncontrado(false);
        } else {
            setEquipoId(null);
            setEquipoEncontrado(false);
            setEquipoNoEncontrado(true);
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
        setClienteNoEncontrado(false);
        setClienteId(null);
        setSerial('');
        setMarca('');
        setModelo('');
        setFalla('');
        setObservaciones('');
        setEquipoEncontrado(false);
        setEquipoNoEncontrado(false);
        setEquipoId(null);
        setTecnicoId('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // ------- HANDLER PRINCIPAL: crea cliente/equipo si hace falta y luego la orden real
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        const cleanTel = telefono.trim().replace(/^0+/, '');
        const telefonoCompleto = cleanTel ? `${codigoPais} ${cleanTel}` : '';
        const cedulaRifCompleta = `${tipoDoc}-${numeroDoc}`.toUpperCase().trim();

        setSubmitting(true);
        try {
            // 1) Asegurar cliente registrado (buscar por cédula/RIF o crearlo)
            let idCliente = clienteId;
            if (!idCliente) {
                const clienteBuscado = catalogoClientes.find(
                    (c) => c.cedulaRif.toUpperCase() === cedulaRifCompleta
                );
                if (clienteBuscado) {
                    idCliente = clienteBuscado.id;
                } else {
                    const nuevoCliente = await createCliente({
                        cedulaRif: cedulaRifCompleta,
                        nombre,
                        telefono: telefonoCompleto,
                        direccion,
                    });
                    idCliente = nuevoCliente.id;
                }
            }

            // 2) Asegurar equipo registrado (buscar por serial o crearlo)
            let idEquipo = equipoId;
            if (!idEquipo) {
                const equipoBuscado = catalogoEquipos.find(
                    (eq) => eq.serial.toUpperCase() === serial.trim().toUpperCase()
                );
                if (equipoBuscado) {
                    idEquipo = equipoBuscado.id;
                } else {
                    const nuevoEquipo = await createEquipo({
                        serial: serial.trim().toUpperCase(),
                        marca,
                        modelo,
                        descripcion: observaciones,
                        clienteId: idCliente,
                    });
                    idEquipo = nuevoEquipo.id;
                }
            }

            const nuevaOrden = {
                cliente: {
                    id: idCliente,
                    cedulaRif: cedulaRifCompleta,
                    nombre,
                    telefono: telefonoCompleto,
                    direccion,
                },
                equipo: {
                    id: idEquipo,
                    serial: serial.trim().toUpperCase(),
                    marca,
                    modelo,
                    falla,
                    observaciones,
                },
                tecnicoId,
            };
            await onSubmit(nuevaOrden);
            resetForm();
        } catch (err) {
            console.error('Error guardando la orden:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
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
                    {clienteNoEncontrado && (
                        <p className="text-[11px] text-amber-600 font-semibold mt-2 flex items-center gap-1">
                            <AlertCircle size={14} /> Cédula/RIF no encontrada. Se registrará al crear la orden.
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
                    {equipoNoEncontrado && (
                        <p className="text-[11px] text-amber-600 font-semibold mt-2 flex items-center gap-1">
                            <AlertCircle size={14} /> Serial no registrado. Se registrará al crear la orden.
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
                            disabled={loadingRegistros}
                            className="w-full bg-white text-xs font-medium text-slate-800 p-2.5 border border-[#E2E8F0] rounded-md outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all disabled:opacity-60"
                        >
                            <option value="">-- Seleccionar Técnico (Opcional) --</option>
                            {tecnicos && tecnicos.map((tec) => (
                                <option key={tec.id} value={tec.id}>{tec.nombre}</option>
                            ))}
                        </select>
                </div>
                </div>

                {/* Acciones Finales del Formulario */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? 'Guardando...' : 'Guardar Orden de Servicio'}
                    </Button>
                </div>

            </form>
        </Modal>
    );
};

export default NewOrderModal;