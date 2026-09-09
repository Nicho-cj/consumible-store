import { useState, useEffect, useMemo } from 'react';
import { UserPlus, Users, Wrench, AlertTriangle, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import FilterBar from '../components/common/FilterBar';
import TecnicoCard from '../components/common/TecnicoCard';
import TecnicoHistorialModal from '../components/modals/TecnicoHistorialModal';
import { normalizeText } from '../utils/text';
import { listTecnicos, createTecnico } from '../api/entidades';
import { listOrdenes } from '../api/ordenes';

const TecnicosPage = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevoTecnico, setNuevoTecnico] = useState({
        nombre: '',
        estado: 'ACTIVE',
    });
    const [submitError, setSubmitError] = useState('');

    const [selectedTecnicoHistory, setSelectedTecnicoHistory] = useState(null);

    useEffect(() => {
        let cancel = false;
        Promise.all([listTecnicos(), listOrdenes()])
            .then(([tecnicosData, ordenesData]) => {
                if (cancel) return;
                setTecnicos(tecnicosData);
                setOrdenes(ordenesData);
            })
            .catch((err) => {
                if (!cancel) {
                    console.error('Error cargando técnicos:', err);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancel) setLoading(false);
            });
        return () => { cancel = true; };
    }, []);

    const reload = () => {
        setLoading(true);
        Promise.all([listTecnicos(), listOrdenes()])
            .then(([tecnicosData, ordenesData]) => {
                setTecnicos(tecnicosData);
                setOrdenes(ordenesData);
                setError('');
            })
            .catch((err) => {
                console.error('Error cargando técnicos:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    const filterFields = [
        {
            id: 'search',
            label: 'Buscar Técnico',
            type: 'text',
            placeholder: 'Nombre o Apellido...',
            value: searchQuery,
            onChange: setSearchQuery,
        },
        {
            id: 'status',
            label: 'Estatus del Técnico',
            type: 'select',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'Todos los estatus', value: 'ALL' },
                { label: 'Activo', value: 'ACTIVE' },
                { label: 'En Pausa', value: 'ON_BREAK' },
                { label: 'Inactivo', value: 'OFF_DUTY' },
            ],
        },
    ];

    const handleResetFilters = () => {
        setSearchQuery('');
        setStatusFilter('ALL');
    };

    const handleSaveTecnico = async (e) => {
        e.preventDefault();
        setSubmitError('');
        try {
            const creado = await createTecnico({
                nombre: nuevoTecnico.nombre.trim(),
                estado: nuevoTecnico.estado,
            });
            setTecnicos((prev) => [creado, ...prev]);
            setIsCreateOpen(false);
            setNuevoTecnico({ nombre: '', estado: 'ACTIVE' });
        } catch (err) {
            console.error('Error creando técnico:', err);
            setSubmitError(err.message);
        }
    };

    const stats = useMemo(() => {
        const activos = tecnicos.filter((t) => t.estado === 'ACTIVE').length;

        const ordenesAsignadas = ordenes.filter(
            (o) => o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO'
        ).length;

        const enEspera = ordenes.filter(
            (o) => o.estado === 'SOLUCION_COTIZACION'
        ).length;

        return { activos, ordenesAsignadas, enEspera };
    }, [tecnicos, ordenes]);

    const filteredTechnicians = useMemo(() => {
        return tecnicos.filter((tec) => {
            const term = normalizeText(searchQuery);
            const matchesName = normalizeText(tec.nombre).includes(term);
            const matchesRole = normalizeText(tec.cargo || '').includes(term);
            const matchesSearch = matchesName || matchesRole;
            const matchesStatus = statusFilter === 'ALL' || tec.estado === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tecnicos, searchQuery, statusFilter]);

    const ordenesPorTecnico = useMemo(() => {
        const map = {};
        ordenes.forEach((o) => {
            if (!o.tecnicoId) return;
            if (!map[o.tecnicoId]) map[o.tecnicoId] = [];
            map[o.tecnicoId].push(o);
        });
        return map;
    }, [ordenes]);

    const apertura = (tecnico) => {
        const tecOrdenes = (ordenesPorTecnico[tecnico.id] || [])
            .filter((o) => o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO');
        alert(`Mostrando órdenes activas de: ${tecnico.nombre}\n${tecOrdenes.length} órdenes en taller:\n- ` +
            tecOrdenes.map((o) => `${o.codigo} (${o.estado})`).join('\n- ') || 'Sin órdenes activas.');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Gestión de Técnicos</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Administración de personal técnico, asignación y carga de trabajo en taller
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        variant="secondary"
                        onClick={reload}
                        disabled={loading}
                        className="inline-flex items-center justify-center p-2 rounded font-semibold transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100 bg-white"
                    >
                        <RefreshCw size={14} />
                    </button>
                    <Button variant="primary" icon={UserPlus} onClick={() => { setSubmitError(''); setIsCreateOpen(true); }}>
                        Agregar Técnico
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Técnicos Activos</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">{stats.activos}</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F3F7E9] text-[#55720C]">
                        <Users size={20} />
                    </div>
                </Card>

                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Órdenes en Taller</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">{stats.ordenesAsignadas}</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                        <Wrench size={20} />
                    </div>
                </Card>

                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Pendientes por Aprobación</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">{stats.enEspera}</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                        <AlertTriangle size={20} />
                    </div>
                </Card>
            </div>

            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            {loading && <p className="text-sm text-slate-500">Cargando técnicos...</p>}
            {error && <p className="text-sm text-red-500">Error al cargar: {error}</p>}

            {!loading && !error && (filteredTechnicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {filteredTechnicians.map((tec) => (
                        <TecnicoCard
                            key={tec.id}
                            technician={{
                                ...tec,
                                ordenesActuales: (ordenesPorTecnico[tec.id] || [])
                                    .filter((o) => o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO')
                                    .map((o) => ({ codigo: o.codigo, estatus: o.estado })),
                            }}
                            onViewOrders={apertura}
                            onViewHistory={() => setSelectedTecnicoHistory(tec)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-slate-500 text-xs">
                    No se encontraron técnicos que coincidan con los filtros aplicados.
                </Card>
            ))}

            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Registrar Nuevo Técnico"
            >
                <form onSubmit={handleSaveTecnico} className="space-y-4">
                    <Input
                        label="Nombre Completo *"
                        placeholder="Ej. Eloy Rodríguez"
                        value={nuevoTecnico.nombre}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, nombre: e.target.value })}
                        required
                    />
                    <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Estatus Inicial</label>
                        <select
                            value={nuevoTecnico.estado}
                            onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, estado: e.target.value })}
                            className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719]"
                        >
                            <option value="ACTIVE">Activo</option>
                            <option value="ON_BREAK">En Pausa</option>
                            <option value="OFF_DUTY">Inactivo</option>
                        </select>
                    </div>
                    {submitError && <p className="text-xs text-red-500">{submitError}</p>}
                    <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar Técnico
                        </Button>
                    </div>
                </form>
            </Modal>

            <TecnicoHistorialModal
                isOpen={!!selectedTecnicoHistory}
                onClose={() => setSelectedTecnicoHistory(null)}
                technician={selectedTecnicoHistory}
            />
        </div>
    );
};

export default TecnicosPage;