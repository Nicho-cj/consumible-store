// src/pages/TecnicoOrdenesPage.jsx
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

// Simulación del técnico autenticado
const CURRENT_TECNICO_ID = "2";

const TECNICO_TAB_STATUS_MAP = {
    TODAS: [
        ORDER_STATUS.RECIBIDO,
        ORDER_STATUS.EN_DIAGNOSTICO,
        ORDER_STATUS.ESPERANDO_APROBACION,
        ORDER_STATUS.EN_REPARACION,
        ORDER_STATUS.LISTO
    ],
    DIAGNOSTICO: [ORDER_STATUS.RECIBIDO, ORDER_STATUS.EN_DIAGNOSTICO],
    EN_REPARACION: [ORDER_STATUS.EN_REPARACION],
    ESPERANDO: [ORDER_STATUS.ESPERANDO_APROBACION],
    TERMINADAS: [ORDER_STATUS.LISTO, ORDER_STATUS.ENTREGADO]
};

const TecnicoOrdenesPage = ({ onOpenDiagnosticoModal }) => {
    const [ordenes, setOrdenes] = useState(mockOrdenes);
    const [activeTab, setActiveTab] = useState('TODAS');
    const [soloMisOrdenes, setSoloMisOrdenes] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Estado para el modal de diagnóstico local
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filterFields = [
        {
            id: 'search',
            label: 'Buscar (Serial / Cliente / Técnico / Equipo)',
            type: 'text',
            placeholder: 'Ej. EPSON, SER-990011, Juan...',
            value: searchQuery,
            onChange: setSearchQuery
        }
    ];

    const handleResetFilters = () => {
        setSearchQuery('');
    };

    // Abre el modal delegando al prop externo si existe o usando el estado local
    const handleOpenModal = (orden) => {
        if (typeof onOpenDiagnosticoModal === 'function') {
            onOpenDiagnosticoModal(orden);
        } else {
            setSelectedOrder(orden);
            setIsModalOpen(true);
        }
    };

    // Actualiza el estado global/local de las órdenes al guardar en el modal
    const handleSaveOrden = (ordenActualizada) => {
        setOrdenes((prev) =>
            prev.map((o) => (o.id === ordenActualizada.id || o.codigo === ordenActualizada.codigo ? ordenActualizada : o))
        );
    };

    const filteredOrders = useMemo(() => {
        return ordenes.filter((orden) => {
            const nombreTecnico = orden.tecnicoNombre || orden.tecnicoAsignado || orden.tecnico || '';
            const idTecnico = orden.tecnicoId || orden.idTecnico;

            if (soloMisOrdenes) {
                const isAssignedToMe = idTecnico === CURRENT_TECNICO_ID ||
                    normalizeText(nombreTecnico).includes('jesus');
                if (!isAssignedToMe) return false;
            }

            const allowedStatuses = TECNICO_TAB_STATUS_MAP[activeTab] || [];
            const currentStatus = orden.estado || orden.status;
            if (!allowedStatuses.includes(currentStatus)) return false;

            const query = normalizeText(searchQuery);
            const matchesSerial = normalizeText(orden.equipoSerie || orden.serial || '').includes(query);
            const matchesClient = normalizeText(orden.clienteNombre || orden.cliente || '').includes(query);
            const matchesEquipo = normalizeText(orden.equipoModelo || orden.equipo || '').includes(query);
            const matchesCodigo = normalizeText(orden.codigo || orden.numeroOrden || '').includes(query);
            const matchesTecnico = normalizeText(nombreTecnico).includes(query);

            return matchesSerial || matchesClient || matchesEquipo || matchesCodigo || matchesTecnico;
        });
    }, [ordenes, activeTab, searchQuery, soloMisOrdenes]);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800', render: (row) => row.codigo || row.numeroOrden || `#${row.id}` },
        {
            key: 'equipo',
            label: 'Equipo',
            render: (row) => (
                <div>
                    <span className="font-semibold block text-slate-700">{row.equipoModelo || row.equipo}</span>
                    <span className="font-mono text-[11px] text-slate-500">S/N: {row.equipoSerie || row.serial || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'cliente',
            label: 'Cliente',
            className: 'text-slate-700 text-xs font-medium',
            render: (row) => row.clienteNombre || row.cliente || 'N/D'
        },
        {
            key: 'tecnico',
            label: 'Técnico Asignado',
            render: (row) => {
                const nombreTecnico = row.tecnicoNombre || row.tecnicoAsignado || row.tecnico || 'Sin Asignar';
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/40">
                        <UserCheck size={13} />
                        {nombreTecnico}
                    </span>
                );
            }
        },
        { key: 'falla', label: 'Falla Reportada', className: 'max-w-xs truncate text-slate-600', render: (row) => row.fallaReportada || row.falla || 'Sin detalle' },
        { key: 'estado', label: 'Estatus', render: (row) => <StatusBadge status={row.estado || row.status} /> },
        {
            key: 'acciones',
            label: 'Acción',
            className: 'text-right',
            render: (row) => {
                const currentStatus = row.estado || row.status;
                const isDiagnostico = currentStatus === ORDER_STATUS.RECIBIDO || currentStatus === ORDER_STATUS.EN_DIAGNOSTICO;
                const isReparacion = currentStatus === ORDER_STATUS.EN_REPARACION;

                return (
                    <Button
                        size="sm"
                        variant={isDiagnostico || isReparacion ? "primary" : "secondary"}
                        icon={isDiagnostico ? Wrench : isReparacion ? Play : FileText}
                        onClick={() => handleOpenModal(row)}
                    >
                        {isDiagnostico ? 'Diagnosticar' : isReparacion ? 'Trabajar Orden' : 'Ver Ficha'}
                    </Button>
                );
            }
        }
    ];

    const tabs = [
        { id: 'TODAS', label: 'Todas las Órdenes', icon: Clock },
        { id: 'DIAGNOSTICO', label: 'Por Diagnosticar', icon: Wrench },
        { id: 'ESPERANDO', label: 'Esp. Aprobación', icon: AlertCircle },
        { id: 'EN_REPARACION', label: 'En Reparación', icon: Play },
        { id: 'TERMINADAS', label: 'Listas / Finalizadas', icon: CheckCircle2 },
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

            {/* Tabs de Filtro de Trabajo */}
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

            {/* Render del Modal de Diagnóstico integrado */}
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