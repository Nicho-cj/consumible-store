import { useState, useEffect } from 'react';
import { Plus, History, Building2 } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import FilterBar from '../components/common/FilterBar';
import { normalizeText } from '../utils/text';
import { listEquipos, createEquipo, getEquipoOrdenes, listClientes } from '../api/entidades';
import { listOrdenes } from '../api/ordenes';
import StatusBadge from '../components/common/StatusBadge';

const TIPOS_COMPATIBLES = [
    'Multifuncional / Fotocopiadora',
    'Impresora Láser',
    'Tinta Continua / EcoTank',
    'Impresora Térmica / POS',
];

const EquiposPage = ({ currentRole }) => {
    const esAdmin = currentRole === 'ADMIN_RECEPCION';
    const [equipos, setEquipos] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados de filtros para FilterBar
    const [searchSerial, setSearchSerial] = useState('');
    const [searchClient, setSearchClient] = useState('');

    // Estados de modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);
    const [clientes, setClientes] = useState([]);

    const [submitError, setSubmitError] = useState('');

    // Formulario de alta (RF-03)
    const [nuevoEquipo, setNuevoEquipo] = useState({
        serial: '',
        tipo: TIPOS_COMPATIBLES[0],
        marca: '',
        modelo: '',
        descripcion: '',
        clienteId: '',
        contadorBN: 0,
        contadorColor: 0
    });

    useEffect(() => {
        let cancel = false;
        Promise.all([listEquipos(), listOrdenes()])
            .then(([equiposData, ordenesData]) => {
                if (cancel) return;
                setEquipos(equiposData);
                setOrdenes(ordenesData);
            })
            .catch((err) => {
                if (!cancel) {
                    console.error('Error cargando equipos:', err);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancel) setLoading(false);
            });
        return () => { cancel = true; };
    }, []);

    const reloadEquipos = () => {
        setLoading(true);
        Promise.all([listEquipos(), listOrdenes()])
            .then(([equiposData, ordenesData]) => {
                setEquipos(equiposData);
                setOrdenes(ordenesData);
                setError('');
            })
            .catch((err) => {
                console.error('Error cargando equipos:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    // Configuración para el componente reutilizable FilterBar
    const filterFields = [
        {
            id: 'serial',
            label: 'Buscar por Serial / Modelo (RF-04)',
            type: 'text',
            placeholder: 'Ej. SER-KY2040...',
            value: searchSerial,
            onChange: setSearchSerial,
        },
        {
            id: 'cliente',
            label: 'Cliente',
            type: 'text',
            placeholder: 'Ej. Tecnología Global...',
            value: searchClient,
            onChange: setSearchClient,
        }
    ];

    const handleResetFilters = () => {
        setSearchSerial('');
        setSearchClient('');
    };

    const openCreateModal = () => {
        setSubmitError('');
        setNuevoEquipo({
            serial: '',
            tipo: TIPOS_COMPATIBLES[0],
            marca: '',
            modelo: '',
            descripcion: '',
            clienteId: '',
            contadorBN: 0,
            contadorColor: 0
        });
        listClientes()
            .then(setClientes)
            .catch((err) => console.error('Error cargando clientes:', err));
        setIsCreateOpen(true);
    };

    // Guardar nuevo equipo (RF-03) via API
    const handleSaveEquipo = async (e) => {
        e.preventDefault();
        setSubmitError('');
        try {
            const creado = await createEquipo({
                serial: nuevoEquipo.serial.trim().toUpperCase(),
                tipo: nuevoEquipo.tipo,
                marca: nuevoEquipo.marca,
                modelo: nuevoEquipo.modelo,
                descripcion: nuevoEquipo.descripcion,
                clienteId: nuevoEquipo.clienteId ? Number(nuevoEquipo.clienteId) : undefined,
                contadorBN: Number(nuevoEquipo.contadorBN) || 0,
                contadorColor: Number(nuevoEquipo.contadorColor) || 0,
            });
            setEquipos((prev) => [creado, ...prev]);
            setIsCreateOpen(false);
        } catch (err) {
            console.error('Error creando equipo:', err);
            setSubmitError(err.message);
        }
    };

    const openExpediente = (equipo) => {
        setSelectedEquipment(equipo);
        setHistorial([]);
        setHistorialLoading(true);
        getEquipoOrdenes(equipo.id)
            .then(setHistorial)
            .catch((err) => console.error('Error cargando historial del equipo:', err))
            .finally(() => setHistorialLoading(false));
    };

    // Filtro con normalizeText
    const filteredEquipos = equipos.filter(item => {
        const matchSerial = normalizeText(item.serial).includes(normalizeText(searchSerial)) ||
            normalizeText(item.marca).includes(normalizeText(searchSerial)) ||
            normalizeText(item.modelo).includes(normalizeText(searchSerial));
        const matchClient = normalizeText(item.cliente || '').includes(normalizeText(searchClient));
        return matchSerial && matchClient;
    });

    const serviciosCount = (serial) =>
        ordenes.filter((o) => o.equipoSerial === serial).length;

    // Columnas de la tabla principal de Equipos
    const columns = [
        {
            key: 'serial',
            label: 'Serial / Tipo',
            render: (row) => (
                <div>
                    <span className="font-mono font-bold text-slate-800 block text-xs">{row.serial}</span>
                    <span className="text-[11px] text-slate-400">{row.tipo}</span>
                </div>
            )
        },
        {
            key: 'equipo',
            label: 'Marca y Modelo',
            render: (row) => (
                <span className="font-semibold text-slate-800">{row.marca} {row.modelo}</span>
            )
        },
        {
            key: 'cliente',
            label: 'Cliente',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-slate-700">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    <span>{row.cliente || '-'}</span>
                </div>
            )
        },
        {
            key: 'contador',
            label: 'Contador Páginas',
            render: (row) => (
                <span className="font-mono font-semibold text-slate-700">
                    {row.contadorBN?.toLocaleString()} B/N
                    {row.contadorColor > 0 && ` | ${row.contadorColor?.toLocaleString()} Color`}
                </span>
            )
        },
        {
            key: 'servicios',
            label: 'Servicios',
            render: (row) => {
                const count = serviciosCount(row.serial);
                return (
                    <span className="bg-[#F3F7E9] text-[#55720C] font-semibold px-2 py-0.5 rounded text-[11px]">
                        {count} {count === 1 ? 'Servicio' : 'Servicios'}
                    </span>
                );
            }
        },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-right',
            render: (row) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openExpediente(row)}
                >
                    <History size={14} className="text-[#97C719]" />
                    <span>Expediente</span>
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Expediente y Registro de Equipos</h2>
                    <p className="text-xs text-slate-500 mt-1">Control unificado de fichas técnicas, contadores e historial.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={reloadEquipos} disabled={loading}>
                        <History size={14} className="text-[#97C719]" />
                        <span>Refrescar</span>
                    </Button>
                    {esAdmin && (
                        <Button variant="primary" onClick={openCreateModal}>
                            <Plus size={16} />
                            <span>Registrar Equipo</span>
                        </Button>
                    )}
                </div>
            </div>

            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            {loading && <p className="text-sm text-slate-500">Cargando equipos...</p>}
            {error && <p className="text-sm text-red-500">Error al cargar: {error}</p>}

            {!loading && !error && (
                <Card>
                    <Table
                        columns={columns}
                        data={filteredEquipos}
                        emptyMessage="No se encontraron equipos registrados."
                    />
                </Card>
            )}

            {esAdmin && (
                /* MODAL RF-03: Alta de Ficha Técnica */
                <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Registrar Ficha Técnica de Equipo (RF-03)">
                <form onSubmit={handleSaveEquipo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            label="Número de Serial Único *"
                            placeholder="Ej. SER-KY2040-001"
                            value={nuevoEquipo.serial}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, serial: e.target.value })}
                            required
                        />
                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">Tipo de Dispositivo *</label>
                            <select
                                value={nuevoEquipo.tipo}
                                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo: e.target.value })}
                                className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719]"
                            >
                                {TIPOS_COMPATIBLES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Marca *"
                            placeholder="Ej. Kyocera, HP, Epson"
                            value={nuevoEquipo.marca}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, marca: e.target.value })}
                            required
                        />
                        <Input
                            label="Modelo *"
                            placeholder="Ej. ECOSYS M2040dn"
                            value={nuevoEquipo.modelo}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, modelo: e.target.value })}
                            required
                        />
                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">Cliente Propietario</label>
                            <select
                                value={nuevoEquipo.clienteId}
                                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, clienteId: e.target.value })}
                                className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719]"
                            >
                                <option value="">Seleccione un cliente...</option>
                                {clientes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre} ({c.cedulaRif})</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            type="number"
                            label="Contador Inicial de Páginas B/N"
                            placeholder="0"
                            value={nuevoEquipo.contadorBN}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, contadorBN: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            type="number"
                            label="Contador Inicial de Color"
                            placeholder="0"
                            value={nuevoEquipo.contadorColor}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, contadorColor: parseInt(e.target.value) || 0 })}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Descripción / Especificaciones"
                                placeholder="Detalles técnicos del equipo..."
                                value={nuevoEquipo.descripcion}
                                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, descripcion: e.target.value })}
                            />
                        </div>
                    </div>
                    {submitError && <p className="text-xs text-red-500">{submitError}</p>}
                    <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar Ficha
                        </Button>
                    </div>
                </form>
                </Modal>
            )}

            {/* MODAL RF-04: Consultar Historial del Equipo */}
            <Modal
                isOpen={!!selectedEquipment}
                onClose={() => setSelectedEquipment(null)}
                title={`Expediente Técnico: ${selectedEquipment?.serial || ''}`}
                maxWidth="max-w-4xl"
            >
                {selectedEquipment && (
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                                <span className="text-slate-400 block font-medium">Marca y Modelo</span>
                                <span className="font-bold text-slate-800">{selectedEquipment.marca} {selectedEquipment.modelo}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Tipo</span>
                                <span className="font-semibold text-slate-700">{selectedEquipment.tipo}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Cliente</span>
                                <span className="font-semibold text-slate-700">{selectedEquipment.cliente || '-'}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <History size={14} className="text-[#97C719]" />
                                Historial de Reparaciones y Mantenimientos ({historial.length})
                            </h4>
                            {historialLoading ? (
                                <p className="text-xs text-slate-500 p-3">Cargando historial...</p>
                            ) : historial.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-[#E2E8F0]">
                                    <History className="mx-auto size-8 text-slate-400 mb-2" />
                                    <p className="text-xs text-slate-500 font-medium">
                                        Este equipo aún no tiene reparaciones o servicios registrados.
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-xs text-slate-700">
                                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-[#E2E8F0]">
                                            <tr>
                                                <th className="p-2.5">N° Orden</th>
                                                <th className="p-2.5 text-right">Cont. Inicial</th>
                                                <th className="p-2.5 text-right">Cont. Final</th>
                                                <th className="p-2.5">Fecha</th>
                                                <th className="p-2.5">Técnico</th>
                                                <th className="p-2.5">Diagnóstico</th>
                                                <th className="p-2.5 text-right">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E2E8F0]">
                                            {historial.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="p-2.5 font-mono font-bold text-slate-800">{item.codigo}</td>
                                                    <td className="p-2.5 text-right font-mono text-slate-700">{item.contadorInicial?.toLocaleString() ?? '-'}</td>
                                                    <td className="p-2.5 text-right font-mono text-slate-700">{item.contadorFinal?.toLocaleString() ?? '-'}</td>
                                                    <td className="p-2.5 text-slate-500">{item.fechaIngreso}</td>
                                                    <td className="p-2.5 font-medium text-slate-700">{item.tecnicoNombre || '-'}</td>
                                                    <td className="p-2.5 text-slate-600 max-w-xs truncate" title={item.diagnostico}>{item.diagnostico || '-'}</td>
                                                    <td className="p-2.5 text-right"><StatusBadge status={item.estado} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button variant="secondary" onClick={() => setSelectedEquipment(null)}>
                                Cerrar Expediente
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EquiposPage;