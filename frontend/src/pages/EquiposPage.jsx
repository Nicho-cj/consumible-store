import { useState, useMemo } from 'react';
import { Plus, History, Building2 } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import FilterBar from '../components/common/FilterBar';
import { normalizeText } from '../utils/text';
import { mockEquipos } from '../data/equiposData';

const EquiposPage = () => {
    const [equipos, setEquipos] = useState(mockEquipos);

    // Estados de filtros para FilterBar
    const [searchSerial, setSearchSerial] = useState('');
    const [searchClient, setSearchClient] = useState('');

    // Estados de modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    // Formulario de alta (RF-03)
    const [nuevoEquipo, setNuevoEquipo] = useState({
        serial: '',
        tipo: 'Multifuncional / Fotocopiadora',
        marca: '',
        modelo: '',
        descripcion: '',
        cliente: '',
        contadorBN: 0,
        contadorColor: 0
    });

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
            placeholder: 'Ej. DellAcuatica...',
            value: searchClient,
            onChange: setSearchClient,
        }
    ];

    const handleResetFilters = () => {
        setSearchSerial('');
        setSearchClient('');
    };

    // Guardar nuevo equipo (RF-03)
    const handleSaveEquipo = (e) => {
        e.preventDefault();
        const nuevo = {
            ...nuevoEquipo,
            id: Date.now(),
            serial: nuevoEquipo.serial.trim().toUpperCase(),
            historial: []
        };
        setEquipos([nuevo, ...equipos]);
        setIsCreateOpen(false);
        setNuevoEquipo({
            serial: '',
            tipo: 'Multifuncional / Fotocopiadora',
            marca: '',
            modelo: '',
            descripcion: '',
            cliente: '',
            contadorBN: 0,
            contadorColor: 0
        });
    };

    // Filtro con normalizeText
    const filteredEquipos = useMemo(() => {
        return equipos.filter(item => {
            const matchSerial = normalizeText(item.serial).includes(normalizeText(searchSerial)) ||
                normalizeText(item.marca).includes(normalizeText(searchSerial)) ||
                normalizeText(item.modelo).includes(normalizeText(searchSerial));
            const matchClient = normalizeText(item.cliente).includes(normalizeText(searchClient));
            return matchSerial && matchClient;
        });
    }, [equipos, searchSerial, searchClient]);

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
                    <span>{row.cliente}</span>
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
            key: 'historial',
            label: 'Servicios',
            render: (row) => (
                <span className="bg-[#F3F7E9] text-[#55720C] font-semibold px-2 py-0.5 rounded text-[11px]">
                    {row.historial.length} {row.historial.length === 1 ? 'Servicio' : 'Servicios'}
                </span>
            )
        },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-right',
            render: (row) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedEquipment(row)}
                >
                    <History size={14} className="text-[#97C719]" />
                    <span>Expediente</span>
                </Button>
            )
        }
    ];

    // Columnas para el modal de Historial (RF-04)
    const historyColumns = [
        { key: 'orden', label: 'N° Orden', className: 'font-mono font-bold text-slate-800' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'tecnico', label: 'Técnico' },
        { key: 'diagnostico', label: 'Diagnóstico y Solución' },
        { key: 'repuestos', label: 'Repuestos' },
        {
            key: 'contador',
            label: 'Contador',
            render: (r) => <span className="font-mono">{r.contador?.toLocaleString()} pág.</span>
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Expediente y Registro de Equipos</h2>
                    <p className="text-xs text-slate-500 mt-1">Control unificado de fichas técnicas, contadores e historial.</p>
                </div>
                <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                    <Plus size={16} />
                    <span>Registrar Equipo</span>
                </Button>
            </div>

            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            <Card>
                <Table
                    columns={columns}
                    data={filteredEquipos}
                    emptyMessage="No se encontraron equipos registrados."
                />
            </Card>

            {/* MODAL RF-03: Alta de Ficha Técnica */}
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
                                <option value="Multifuncional / Fotocopiadora">Multifuncional / Fotocopiadora</option>
                                <option value="Impresora Láser">Impresora Láser</option>
                                <option value="Tinta Continua">Tinta Continua / EcoTank</option>
                                <option value="Impresora Térmica">Impresora Térmica / POS</option>
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
                        <Input
                            label="Cliente Propietario *"
                            placeholder="Ej. DellAcuatica CA"
                            value={nuevoEquipo.cliente}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, cliente: e.target.value })}
                            required
                        />
                        <Input
                            type="number"
                            label="Contador Inicial de Páginas"
                            placeholder="0"
                            value={nuevoEquipo.contadorBN}
                            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, contadorBN: parseInt(e.target.value) || 0 })}
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
                                <span className="font-semibold text-slate-700">{selectedEquipment.cliente}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Contador Total</span>
                                <span className="font-mono font-bold text-[#55720C] bg-[#F3F7E9] px-2 py-0.5 rounded">
                                    {selectedEquipment.contadorBN?.toLocaleString()} pág.
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <History size={14} className="text-[#97C719]" />
                                Historial de Reparaciones y Mantenimientos
                            </h4>
                            <Table
                                columns={historyColumns}
                                data={selectedEquipment.historial}
                                emptyMessage="Este equipo aún no tiene reparaciones o servicios registrados."
                            />
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