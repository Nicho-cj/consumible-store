import { useState, useMemo } from 'react';
import { UserPlus, Users, Wrench, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import FilterBar from '../components/common/FilterBar';
import TecnicoCard from '../components/common/TecnicoCard';
import TecnicoHistorialModal from '../components/modals/TecnicoHistorialModal';
import { normalizeText } from '../utils/text';
import { mockTecnicos } from '../data/tecnicosData';
import { mockOrdenes, ORDER_STATUS } from '../data/ordenesData';

const TecnicosPage = () => {
    const [tecnicos, setTecnicos] = useState(mockTecnicos);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [nuevoTecnico, setNuevoTecnico] = useState({
        nombre: '',
        cargo: 'Técnico',
        estado: 'ACTIVE',
    });

    const [selectedTecnicoHistory, setSelectedTecnicoHistory] = useState(null);

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

    const handleSaveTecnico = (e) => {
        e.preventDefault();
        const nuevo = {
            id: Date.now(),
            ...nuevoTecnico,
            ordenesActuales: [],
            historialOrdenes: [],
        };
        setTecnicos([nuevo, ...tecnicos]);
        setIsCreateOpen(false);
        setNuevoTecnico({ nombre: '', cargo: 'Técnico', estado: 'ACTIVE' });
    };

    const stats = useMemo(() => {
        const activos = tecnicos.filter((t) => t.estado === 'ACTIVE').length;

        const ordenesAsignadas = mockOrdenes.filter(
            (o) => o.estado !== ORDER_STATUS.ENTREGADO && o.estado !== ORDER_STATUS.CANCELADO
        ).length;

        const enEspera = mockOrdenes.filter(
            (o) => o.estado === ORDER_STATUS.SOLUCION_COTIZACION
        ).length;

        return { activos, ordenesAsignadas, enEspera };
    }, [tecnicos]);

    const filteredTechnicians = useMemo(() => {
        return tecnicos.filter((tec) => {
            const term = normalizeText(searchQuery);
            const matchesName = normalizeText(tec.nombre).includes(term);
            const matchesRole = normalizeText(tec.cargo).includes(term);
            const matchesSearch = matchesName || matchesRole;
            const matchesStatus = statusFilter === 'ALL' || tec.estado === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tecnicos, searchQuery, statusFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Gestión de Técnicos</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Administración de personal técnico, asignación y carga de trabajo en taller
                    </p>
                </div>
                <Button variant="primary" icon={UserPlus} onClick={() => setIsCreateOpen(true)}>
                    Agregar Técnico
                </Button>
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

            {filteredTechnicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {filteredTechnicians.map((tec) => (
                        <TecnicoCard
                            key={tec.id}
                            technician={tec}
                            onViewOrders={() => alert(`Mostrando órdenes activas de: ${tec.nombre}`)}
                            onViewHistory={() => setSelectedTecnicoHistory(tec)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-slate-500 text-xs">
                    No se encontraron técnicos que coincidan con los filtros aplicados.
                </Card>
            )}

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
                    <Input
                        label="Cargo / Especialidad"
                        placeholder="Ej. Técnico Senior / Especialista Kyocera"
                        value={nuevoTecnico.cargo}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, cargo: e.target.value })}
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
