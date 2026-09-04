import { useState, useMemo } from 'react';
import { Wrench, Clock, AlertCircle, CheckCircle2, Play, FileText, UserCheck, Users } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import FilterBar from '../components/common/FilterBar';
import TecnicoDiagnosticoModal from '../components/modals/TecnicoDiagnosticoModal';
import { normalizeText } from '../utils/text';
import { mockOrdenes, ORDER_STATUS } from '../data/ordenesData';

const CURRENT_TECNICO_ID = 2;

const TECNICO_TAB_STATUS_MAP = {
    TODAS: [
        ORDER_STATUS.REGISTRADO,
        ORDER_STATUS.EN_DIAGNOSTICO,
        ORDER_STATUS.SOLUCION_COTIZACION,
        ORDER_STATUS.PROCESO_TECNICO,
        ORDER_STATUS.LISTO_ENTREGA,
        ORDER_STATUS.ENTREGADO,
    ],
    POR_DIAGNOSTICAR: [ORDER_STATUS.REGISTRADO, ORDER_STATUS.EN_DIAGNOSTICO],
    EN_COTIZACION: [ORDER_STATUS.SOLUCION_COTIZACION],
    EN_REPARACION: [ORDER_STATUS.PROCESO_TECNICO],
    TERMINADAS: [ORDER_STATUS.LISTO_ENTREGA, ORDER_STATUS.ENTREGADO],
};

const TecnicoOrdenesPage = () => {
    const [ordenes, setOrdenes] = useState(mockOrdenes);
    const [activeTab, setActiveTab] = useState('TODAS');
    const [soloMisOrdenes, setSoloMisOrdenes] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filterFields = [
        {
            id: 'search',
            label: 'Buscar (Serial / Cliente / Técnico / Equipo)',
            type: 'text',
            placeholder: 'Ej. Epson, X3K891234...',
            value: searchQuery,
            onChange: setSearchQuery,
        },
    ];

    const handleResetFilters = () => {
        setSearchQuery('');
    };

    const handleOpenModal = (orden) => {
        setSelectedOrder(orden);
        setIsModalOpen(true);
    };

    const handleSaveOrden = (ordenActualizada) => {
        setOrdenes((prev) =>
            prev.map((o) => (o.id === ordenActualizada.id ? ordenActualizada : o))
        );
    };

    const filteredOrders = useMemo(() => {
        return ordenes.filter((orden) => {
            if (soloMisOrdenes && orden.tecnicoId !== CURRENT_TECNICO_ID) return false;

            const allowedStatuses = TECNICO_TAB_STATUS_MAP[activeTab] || [];
            if (!allowedStatuses.includes(orden.estado)) return false;

            const query = normalizeText(searchQuery);
            const matchesSerial = normalizeText(orden.equipoSerie || '').includes(query);
            const matchesClient = normalizeText(orden.clienteNombre || '').includes(query);
            const matchesEquipo = normalizeText(orden.equipoModelo || '').includes(query);
            const matchesCodigo = normalizeText(orden.codigo || '').includes(query);
            const matchesTecnico = normalizeText(orden.tecnicoAsignado || '').includes(query);

            return matchesSerial || matchesClient || matchesEquipo || matchesCodigo || matchesTecnico;
        });
    }, [ordenes, activeTab, searchQuery, soloMisOrdenes]);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        {
            key: 'equipo',
            label: 'Equipo',
            render: (row) => (
                <div>
                    <span className="font-semibold block text-slate-700">{row.equipoModelo}</span>
                    <span className="font-mono text-[11px] text-slate-500">S/N: {row.equipoSerie || 'N/A'}</span>
                </div>
            ),
        },
        {
            key: 'cliente',
            label: 'Cliente',
            className: 'text-slate-700 text-xs font-medium',
            render: (row) => row.clienteNombre || 'N/D',
        },
        {
            key: 'tecnico',
            label: 'Técnico Asignado',
            render: (row) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                    <UserCheck size={13} />
                    {row.tecnicoAsignado || 'Sin Asignar'}
                </span>
            ),
        },
        { key: 'fallaReportada', label: 'Falla Reportada', className: 'max-w-xs truncate text-slate-600' },
        { key: 'estado', label: 'Estatus', render: (row) => <StatusBadge status={row.estado} /> },
        {
            key: 'acciones',
            label: 'Acción',
            className: 'text-right',
            render: (row) => {
                const isDiagnostico =
                    row.estado === ORDER_STATUS.REGISTRADO || row.estado === ORDER_STATUS.EN_DIAGNOSTICO;
                const isReparacion = row.estado === ORDER_STATUS.PROCESO_TECNICO;

                let label = 'Ver Ficha';
                let variant = 'secondary';
                let icon = FileText;

                if (isDiagnostico) {
                    label = 'Diagnosticar';
                    variant = 'primary';
                    icon = Wrench;
                } else if (isReparacion) {
                    label = 'Trabajar Orden';
                    variant = 'primary';
                    icon = Play;
                }

                return (
                    <Button
                        size="sm"
                        variant={variant}
                        icon={icon}
                        onClick={() => handleOpenModal(row)}
                    >
                        {label}
                    </Button>
                );
            },
        },
    ];

    const tabs = [
        { id: 'TODAS', label: 'Todas', icon: Clock },
        { id: 'POR_DIAGNOSTICAR', label: 'Por Diagnosticar', icon: Wrench },
        { id: 'EN_COTIZACION', label: 'En Cotización', icon: AlertCircle },
        { id: 'EN_REPARACION', label: 'En Reparación', icon: Play },
        { id: 'TERMINADAS', label: 'Finalizadas', icon: CheckCircle2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Estación de Trabajo Técnico</h2>
                    <p className="text-xs text-slate-500 mt-1">Gestión e historial de órdenes de servicio en taller</p>
                </div>

                <button
                    onClick={() => setSoloMisOrdenes(!soloMisOrdenes)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${soloMisOrdenes
                            ? 'bg-[#55720C] text-white border-[#55720C] shadow-sm'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <Users size={14} />
                    {soloMisOrdenes ? 'Viendo solo mis órdenes' : 'Ver órdenes de todos'}
                </button>
            </div>

            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs border-b-2 transition-colors whitespace-nowrap ${isActive
                                    ? 'border-[#55720C] text-[#55720C] bg-slate-50/50'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            <Card>
                <Table
                    columns={columns}
                    data={filteredOrders}
                    emptyMessage="No se encontraron órdenes para este filtro."
                />
            </Card>

            <TecnicoDiagnosticoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onSaveStatus={handleSaveOrden}
            />
        </div>
    );
};

export default TecnicoOrdenesPage;
